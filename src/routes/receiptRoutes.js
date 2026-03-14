import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { upload, uploadReceipt, getUserReceipts } from '../controllers/receiptControllers.js';

const router = express.Router();

// User: upload receipt
router.post('/upload-receipt', authenticate, upload.single('receipt'), uploadReceipt);

// User: get their receipts
router.get('/get-my-receipt', authenticate, getUserReceipts);

export default router;