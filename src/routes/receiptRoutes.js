import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { upload, uploadReceipt, getUserReceipts, fetchAllReceipts, getReceiptById, deleteReceiptByIdController } from '../controllers/receiptControllers.js';

const router = express.Router();

// Admin: get all receipts
router.get('/get-all-receipts', authenticate, requireAdmin, fetchAllReceipts);

// Admin: delete receipt by id
router.delete('/delete-receipt/:id', authenticate, requireAdmin, deleteReceiptByIdController);

// User: upload receipt
router.post('/upload-receipt', authenticate, upload.single('receipt'), uploadReceipt);
// Tested and working

// User: get receipt by id
router.get('/get-receipt/:id', authenticate, getReceiptById);

// User: get their receipts
router.get('/get-my-receipt', authenticate, getUserReceipts);

export default router;