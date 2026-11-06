import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getUsers);

router.route('/:id')
  .get(getUserById)
  .patch(updateUser)
  .delete(authorize('admin'), deleteUser);

export default router;

