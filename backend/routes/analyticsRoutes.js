import express from 'express';
const router = express.Router();
import {
  getDashboardMetrics,
  getProductForecast,
  getTrends,
  getABCAnalysis,
  getSeasonalPatterns,
  generateCustomReport,
  getSupplierPerformance,
  getStockOptimization
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

// All routes are protected
router.route('/dashboard')
  .get(protect, getDashboardMetrics);

router.route('/forecast/:productId')
  .get(protect, getProductForecast);

router.route('/trends')
  .get(protect, getTrends);

router.route('/abc-analysis')
  .get(protect, authorize('admin', 'manager'), getABCAnalysis);

router.route('/seasonal-patterns')
  .get(protect, getSeasonalPatterns);

router.route('/custom-report')
  .post(protect, authorize('admin', 'manager'), generateCustomReport);

router.route('/supplier-performance')
  .get(protect, authorize('admin', 'manager'), getSupplierPerformance);

router.route('/stock-optimization')
  .get(protect, authorize('admin', 'manager'), getStockOptimization);

export default router;