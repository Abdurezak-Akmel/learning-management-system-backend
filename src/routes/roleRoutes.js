import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { getAllRolesController, createRoleController } from '../controllers/roleControllers.js';

const router = express.Router();

// Admin: get all roles
router.get('/get-all-roles', authenticate, requireAdmin, getAllRolesController);
// Tested and working

//Admin: create new role
router.post('/create-new-role', authenticate, requireAdmin, createRoleController);

export default router;