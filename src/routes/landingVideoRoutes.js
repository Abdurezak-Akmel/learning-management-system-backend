import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import {
    createLandingVideoController,
    updateLandingVideoController,
    getAllLandingVideosController,
    getLandingVideoByIdController,
    deleteLandingVideoController
} from '../controllers/landingVideoControllers.js';

const router = express.Router();

// Admin: create landing video
router.post('/create-landing-video', authenticate, requireAdmin, createLandingVideoController);

// Admin: update landing video
router.put('/update-landing-video/:id', authenticate, requireAdmin, updateLandingVideoController);

// Admin: delete landing video
router.delete('/delete-landing-video/:id', authenticate, requireAdmin, deleteLandingVideoController);

// Public: get all landing videos
router.get('/get-all-landing-videos', getAllLandingVideosController);

// Public: get landing video by id
router.get('/get-landing-video/:id', getLandingVideoByIdController);

export default router;