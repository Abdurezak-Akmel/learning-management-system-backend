import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { createAccessRequestController, getUserAccessRequests } from '../controllers/accessRequestControllers.js';

const router = express.Router();

// User: create access request
router.post('/access-requests', authenticate, createAccessRequestController);

// User: get their access requests
router.get('/access-requests', authenticate, getUserAccessRequests);

export default router;