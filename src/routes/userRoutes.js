import express from 'express';
import { fetchAllUsers, updateUserRole, deleteUser } from '../controllers/userControllers.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { upload, uploadReceipt, getUserReceipts } from '../controllers/receiptControllers.js';

const router = express.Router();

// Admin: get all users
router.get('/', authenticate, requireAdmin, fetchAllUsers);

// Admin: update a user's role
router.patch('/:id/role', authenticate, requireAdmin, updateUserRole);

// Admin: delete a user
router.delete('/:id', authenticate, requireAdmin, deleteUser);

// User: upload receipt
router.post('/receipts', authenticate, upload.single('receipt'), uploadReceipt);

// User: get their receipts
router.get('/receipts', authenticate, getUserReceipts);

export default router;
