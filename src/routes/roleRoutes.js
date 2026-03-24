import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { getAllRolesController, createRoleController, updateRoleController, getRoleByIdController } from '../controllers/roleControllers.js';

const router = express.Router();

// Admin: get all roles
router.get('/get-all-roles', authenticate, requireAdmin, getAllRolesController);
// Tested and working

// Admin: get role by ID
router.get('/get-role-by-id/:id', authenticate, requireAdmin, getRoleByIdController);

//Admin: create new role
router.post('/create-new-role', authenticate, requireAdmin, createRoleController);
// Tested and working

// Admin: update existing role
router.put('/update-role-by-id/:id', authenticate, requireAdmin, updateRoleController);

export default router;