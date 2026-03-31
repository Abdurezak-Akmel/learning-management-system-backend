import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import {
    createProjectController,
    getAllProjectsController,
    getProjectByIdController,
    updateProjectController,
    deleteProjectController
} from '../controllers/projectControllers.js';

const router = express.Router();

// Admin: create project
router.post('/create-project', authenticate, requireAdmin, createProjectController);
// Tested and Working

// User: get project by ID
router.get('/get-project/:id', authenticate, getProjectByIdController);

// Admin: update project
router.put('/update-project/:id', authenticate, requireAdmin, updateProjectController);

// Admin: delete project
router.delete('/delete-project/:id', authenticate, requireAdmin, deleteProjectController);
// Tested and Working

// Public: get all projects
router.get('/get-all-projects', getAllProjectsController);

export default router;