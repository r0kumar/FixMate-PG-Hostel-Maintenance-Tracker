import express from 'express';
import {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from '../controllers/roomController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getRooms)
  .post(authorize('admin'), createRoom);

router.route('/:id')
  .patch(authorize('admin'), updateRoom)
  .delete(authorize('admin'), deleteRoom);

export default router;

