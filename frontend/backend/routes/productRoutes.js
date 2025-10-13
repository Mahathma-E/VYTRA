import express from 'express';
const router = express.Router();
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getProductMovements,
  bulkImport,
  getCategories
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

// All routes are protected and require admin or manager role
router.route('/')
  .post(protect, authorize('admin', 'manager'), upload.array('images', 5), createProduct)
  .get(protect, getProducts);

router.route('/low-stock')
  .get(protect, authorize('admin', 'manager'), getLowStockProducts);

router.route('/categories')
  .get(protect, getCategories);

router.route('/bulk-import')
  .post(protect, authorize('admin', 'manager'), upload.single('file'), bulkImport);

router.route('/:id')
  .get(protect, getProductById)
  .put(protect, authorize('admin', 'manager'), upload.array('images', 5), updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/movements')
  .get(protect, getProductMovements);

export default router;