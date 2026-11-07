import express from 'express';
import {
  loginDemo,
  getDemoMe,
  resetDemoData,
  createDemoComplaint,
  getDemoComplaints,
  getDemoComplaintById,
  assignDemoStaff,
  updateDemoComplaintStatus,
  deleteDemoComplaint,
  getDemoRooms,
  createDemoRoom,
  deleteDemoRoom,
  getDemoStaff,
  createDemoStaff,
  deleteDemoStaff,
} from '../controllers/demoController.js';
import {
  checkDemoEnabled,
  protectDemo,
  authorizeDemo,
} from '../middleware/demoAuth.js';
import {
  demoAuthLimiter,
  demoResetLimiter,
  demoApiLimiter,
} from '../middleware/rateLimiter.js';

const router = express.Router();

// Apply server-side demo mode enable check across all demo routes
router.use(checkDemoEnabled);

// 1. Demo Entry / Authentication (Public, rate-limited)
router.post('/auth/login', demoAuthLimiter, loginDemo);

// 2. Safe Demo Database Reset (Public, rate-limited, flushes only demo collections)
router.post('/reset', demoResetLimiter, resetDemoData);

// 3. All subsequent routes require valid Demo JWT signed with DEMO_JWT_SECRET
router.use(protectDemo);

// 4. Demo User Session
router.get('/auth/me', getDemoMe);

// 5. Demo Complaints
// Staff listing sub-route (must precede /:id)
router.get('/complaints/staff', demoApiLimiter, authorizeDemo('admin'), getDemoStaff);

router.route('/complaints')
  .get(demoApiLimiter, getDemoComplaints)
  .post(demoApiLimiter, authorizeDemo('resident', 'admin'), createDemoComplaint);

router.patch('/complaints/:id/assign', demoApiLimiter, authorizeDemo('admin'), assignDemoStaff);
router.patch('/complaints/:id/status', demoApiLimiter, authorizeDemo('admin', 'staff'), updateDemoComplaintStatus);

router.route('/complaints/:id')
  .get(demoApiLimiter, getDemoComplaintById)
  .delete(demoApiLimiter, authorizeDemo('admin'), deleteDemoComplaint);

// 6. Demo Rooms
router.route('/rooms')
  .get(demoApiLimiter, getDemoRooms)
  .post(demoApiLimiter, authorizeDemo('admin'), createDemoRoom);

router.delete('/rooms/:id', demoApiLimiter, authorizeDemo('admin'), deleteDemoRoom);

// 7. Demo Staff Management (both /staff and real route aliases /auth/create-staff & /users/:id)
router.route('/staff')
  .get(demoApiLimiter, authorizeDemo('admin'), getDemoStaff)
  .post(demoApiLimiter, authorizeDemo('admin'), createDemoStaff);

router.delete('/staff/:id', demoApiLimiter, authorizeDemo('admin'), deleteDemoStaff);

// Real route aliases for demo mode
router.post('/auth/create-staff', demoApiLimiter, authorizeDemo('admin'), createDemoStaff);
router.delete('/users/:id', demoApiLimiter, authorizeDemo('admin'), deleteDemoStaff);

export default router;

