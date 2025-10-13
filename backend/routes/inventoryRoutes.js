import express from 'express';
const router = express.Router();
import {
  getInventory,
  getLocations,
  recordAdjustment,
  transferStock,
  getMovements,
  getValuation,
  generateReorderRecommendations,
  getTurnoverMetrics
} from '../controllers/inventoryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { validateInventoryAdjustment, validateObjectIdParam } from '../middleware/validationMiddleware.js';

// All routes are protected
router.route('/')
  .get(protect, getInventory);

router.route('/locations')
  .get(protect, getLocations);

router.route('/adjustment')
  .post(protect, authorize('admin', 'manager'), validateInventoryAdjustment, recordAdjustment);

router.route('/transfer')
  .post(protect, authorize('admin', 'manager'), validateInventoryAdjustment, transferStock);

router.route('/movements')
  .get(protect, getMovements);

router.route('/valuation')
  .get(protect, authorize('admin', 'manager'), getValuation);

router.route('/reorder')
  .post(protect, authorize('admin', 'manager'), generateReorderRecommendations);

router.route('/turnover')
  .get(protect, authorize('admin', 'manager'), getTurnoverMetrics);

export default router;