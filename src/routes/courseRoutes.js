import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController
} from '../controllers/courseControllers.js';

const router = express.Router();

// Admin: create course
router.post('/create-course', authenticate, requireAdmin, createCourseController);
// Tested and Working

// Admin: get all courses
router.get('/get-all-courses', authenticate, requireAdmin, getAllCoursesController);

// User: get course by ID
router.get('/get-course/:id', authenticate, getCourseByIdController);

// Admin: update course
router.put('/update-course/:id', authenticate, requireAdmin, updateCourseController);

// Admin: delete course
router.delete('/delete-course/:id', authenticate, requireAdmin, deleteCourseController);
// Tested and Working

export default router;