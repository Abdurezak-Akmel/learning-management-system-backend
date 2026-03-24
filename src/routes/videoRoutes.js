import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import {
  createVideoController,
  getAllVideosController,
  getVideosByCourseIdController,
  updateVideoController,
  deleteVideoController,
  getVideosByVideoIdController,
} from '../controllers/videoControllers.js';

const router = express.Router();

// Admin: create video
router.post('/create-video', authenticate, requireAdmin, createVideoController);

// Admin: get all videos
router.get('/get-all-videos', authenticate, requireAdmin, getAllVideosController);

// User: get videos by course ID
router.get('/get-videos/:course_id', authenticate, getVideosByCourseIdController);

// User: get video by ID (optional, can be used for editing)
router.get('/get-video/:id', authenticate, getVideosByVideoIdController);
// TEsted and Working

// Admin: update video
router.put('/update-video/:id', authenticate, requireAdmin, updateVideoController);

// Admin: delete video
router.delete('/delete-video/:id', authenticate, requireAdmin, deleteVideoController);

export default router;