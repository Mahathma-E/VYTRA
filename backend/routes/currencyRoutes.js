import express from 'express';
import { getExchangeRate } from '../controllers/currencyController.js';

const router = express.Router();

// GET /api/currency/rate?from=USD&to=INR
router.get('/rate', getExchangeRate);

export default router;


