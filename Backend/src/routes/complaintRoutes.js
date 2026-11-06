import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  assignStaff,
  updateComplaintStatus,
  getStaffList,
  deleteComplaint,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

// All complaint routes require authentication
router.use(protect);

// 1. Staff list route (Must precede /:id)
router.get('/staff', authorize('admin'), getStaffList);

// 2. Main complaints collection routes
router.route('/')
  .post(authorize('resident', 'admin'), createComplaint)
  .get(getComplaints);

// 3. Status and Assignment sub-routes
router.patch('/:id/assign', authorize('admin'), assignStaff);
router.patch('/:id/status', authorize('admin', 'staff'), updateComplaintStatus);

// 4. Single complaint resource routes
router.route('/:id')
  .get(getComplaintById)
  .delete(authorize('admin'), deleteComplaint);

export default router;
