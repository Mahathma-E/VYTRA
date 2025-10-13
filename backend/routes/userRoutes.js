import express from 'express';
const router = express.Router();
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserActivity
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// All routes are protected and require admin role
router.route('/')
  .get(protect, authorize('admin'), getUsers);

router.route('/:id')
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router.route('/:id/activity')
  .get(protect, authorize('admin'), getUserActivity);

export default router;