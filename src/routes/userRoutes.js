import express from 'express';
import { fetchAllUsers, updateUserRole, deleteUser } from '../controllers/userControllers.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Admin: get all users
router.get('/users', authenticate, requireAdmin, fetchAllUsers);

// Admin: update a user's role
router.patch('/users/:id/role', authenticate, requireAdmin, updateUserRole);

// Admin: delete a user
router.delete('/users/:id', authenticate, requireAdmin, deleteUser);

export default router;
