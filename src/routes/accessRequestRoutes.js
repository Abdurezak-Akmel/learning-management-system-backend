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

//Create a new access request for a course (requires authentication)
router.post('/access-requests', authenticate, createAccessRequestController);
// Tester and working

//Get all access requests for the authenticated user
router.get('/access-requests', authenticate, getUserAccessRequests);

//Get all access requests with optional filtering (admin only)
router.get('/admin/access-requests', authenticate, requireAdmin, getAllAccessRequestsController);

//Get all pending access requests (admin only)
router.get('/admin/access-requests/pending', authenticate, requireAdmin, getPendingRequestsController);

//Get all access requests for a specific course (admin only)
router.get('/admin/access-requests/course/:course_id', authenticate, requireAdmin, getRequestsByCourseIdController);

//Get all access requests by status (admin only)
router.get('/admin/access-requests/status/:status', authenticate, requireAdmin, getRequestsByStatusController);

//Update access request status by ID (approve/reject) (admin only)
router.put('/admin/access-requests/:request_id/status', authenticate, requireAdmin, updateAccessRequestStatusController);

//Delete an access request by ID (admin only)
router.delete('/admin/access-requests/:request_id', authenticate, requireAdmin, deleteAccessRequestController);

//Get a specific access request by ID (User)
router.get('/access-requests/:request_id', authenticate, getAccessRequestByIdController);

export default router;