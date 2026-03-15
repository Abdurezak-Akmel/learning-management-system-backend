import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import {
  createVideoController,
  getAllVideosController,
  getVideosByCourseIdController,
  updateVideoController,
  deleteVideoController
} from '../controllers/videoControllers.js';

const router = express.Router();

// Admin: create video
router.post('/create-video', authenticate, requireAdmin, createVideoController);

// Admin: get all videos
router.get('/get-all-videos', authenticate, requireAdmin, getAllVideosController);

// User: get videos by course ID
router.get('/get-videos/:course_id', authenticate, getVideosByCourseIdController);

// Admin: update video
router.put('/update-video/:id', authenticate, requireAdmin, updateVideoController);

// Admin: delete video
router.delete('/delete-video/:id', authenticate, requireAdmin, deleteVideoController);

export default router;