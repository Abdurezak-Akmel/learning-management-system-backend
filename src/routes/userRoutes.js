import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { fetchAllUsers, deleteUser, fetchUserById, updateUserByIdController, fetchUserByStatus } from '../controllers/userControllers.js';

const router = express.Router();

// Admin: get all users
router.get('/get-all-users', authenticate, requireAdmin, fetchAllUsers);
// Tested and working

//Admin: get user by id
router.get('/get-user-by-id/:id', authenticate, requireAdmin, fetchUserById);

//Admin: get user by status
router.get('/get-user-by-status/:status', authenticate, requireAdmin, fetchUserByStatus);
// Tested and working

// Admin: update a user
router.put('/update-user-by-id/:id', authenticate, requireAdmin, updateUserByIdController);
// Tested and Working

// Admin: delete a user
router.delete('/delete-user-by-id/:id', authenticate, requireAdmin, deleteUser);

export default router;
