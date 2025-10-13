import express from 'express';
const router = express.Router();
import {
  getAlerts,
  markAlertAsRead,
  markAlertAsResolved,
  deleteAlert,
  getAlertSummary,
  updateAlertPreferences,
  createAlert
} from '../controllers/alertController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// All routes are protected
router.route('/')
  .get(protect, getAlerts)
  .post(protect, authorize('admin', 'manager'), createAlert);

router.route('/summary')
  .get(protect, getAlertSummary);

router.route('/settings')
  .post(protect, updateAlertPreferences);

router.route('/:id/read')
  .put(protect, markAlertAsRead);

router.route('/:id/resolve')
  .put(protect, markAlertAsResolved);

router.route('/:id')
  .delete(protect, deleteAlert);

export default router;