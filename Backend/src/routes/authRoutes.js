import express from 'express';
import {
  register,
  login,
  getMe,
  createStaff,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes
router.get('/me', protect, getMe);

// Admin-only route for creating staff accounts
router.post('/create-staff', protect, authorize('admin'), createStaff);

export default router;
