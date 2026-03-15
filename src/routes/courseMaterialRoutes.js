import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import {
  createMaterialController,
  getAllMaterialsController,
  getMaterialByIdController,
  getMaterialsByCourseIdController,
  getMaterialsByTitleController,
  getMaterialsByFilenameController,
  getMaterialsByFileTypeController,
  updateMaterialController,
  deleteMaterialController
} from '../controllers/courseMaterialControllers.js';

const router = express.Router();

// Admin: create course material
router.post('/create-course-material', authenticate, requireAdmin, createMaterialController);

// Admin: get all course materials
router.get('/all-course-materials', authenticate, requireAdmin, getAllMaterialsController);

// User: get material by ID
router.get('/course-material/:id', authenticate, getMaterialByIdController);

// User: get materials by course ID
router.get('/course/:course_id/materials', authenticate, getMaterialsByCourseIdController);

// Admin: get materials by title
router.get('/search-by-title', authenticate, requireAdmin, getMaterialsByTitleController);

// Admin: get materials by file name
router.get('/search-by-filename', authenticate, requireAdmin, getMaterialsByFilenameController);

// Admin: get materials by file type
router.get('/search-by-filetype', authenticate, requireAdmin, getMaterialsByFileTypeController);

// Admin: update course material
router.put('/update-course-material/:id', authenticate, requireAdmin, updateMaterialController);

// Admin: delete course material
router.delete('/delete-course-material/:id', authenticate, requireAdmin, deleteMaterialController);

export default router;