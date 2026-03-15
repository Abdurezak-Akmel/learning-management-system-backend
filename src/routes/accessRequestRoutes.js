import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import { 
  createAccessRequestController, 
  getUserAccessRequests,
  getAllAccessRequestsController,
  getAccessRequestByIdController,
  updateAccessRequestStatusController,
  deleteAccessRequestController,
  getPendingRequestsController,
  getRequestsByCourseIdController,
  getRequestsByStatusController
} from '../controllers/accessRequestControllers.js';

const router = express.Router();

// User routes
// POST /access-requests - Create a new access request for a course (requires authentication)
router.post('/access-requests', authenticate, createAccessRequestController);

// GET /access-requests - Get all access requests for the authenticated user
router.get('/access-requests', authenticate, getUserAccessRequests);

// Admin routes
// GET /admin/access-requests - Get all access requests with optional filtering (admin only)
router.get('/admin/access-requests', authenticate, requireAdmin, getAllAccessRequestsController);

// GET /admin/access-requests/pending - Get all pending access requests (admin only)
router.get('/admin/access-requests/pending', authenticate, requireAdmin, getPendingRequestsController);

// GET /admin/access-requests/course/:course_id - Get all access requests for a specific course (admin only)
router.get('/admin/access-requests/course/:course_id', authenticate, requireAdmin, getRequestsByCourseIdController);

// GET /admin/access-requests/status/:status - Get all access requests by status (admin only)
router.get('/admin/access-requests/status/:status', authenticate, requireAdmin, getRequestsByStatusController);

// GET /admin/access-requests/:request_id - Get a specific access request by ID (admin only)
router.get('/admin/access-requests/:request_id', authenticate, requireAdmin, getAccessRequestByIdController);

// PUT /admin/access-requests/:request_id/status - Update access request status (approve/reject) (admin only)
router.put('/admin/access-requests/:request_id/status', authenticate, requireAdmin, updateAccessRequestStatusController);

// DELETE /admin/access-requests/:request_id - Delete an access request (admin only)
router.delete('/admin/access-requests/:request_id', authenticate, requireAdmin, deleteAccessRequestController);

export default router;