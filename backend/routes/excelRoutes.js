import express from 'express';
import multer from '../config/multer.js';
import { importExcelData, getImportTemplate } from '../controllers/excelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Import Excel/CSV data
router.post('/import', protect, multer.single('file'), importExcelData);

// Get import template
router.get('/template', protect, getImportTemplate);

export default router;
