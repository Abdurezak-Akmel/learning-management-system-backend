import { query } from '../config/db.js';
import {
  createAccessRequest,
  getAccessRequestById,
  getRequestsByUserId,
  getRequestsByCourseId,
  getRequestsByStatus,
  getPendingRequests,
  updateAccessRequestById,
  deleteAccessRequestById
} from '../models/accessRequestModel.js';

/**
 * Controller function to create a new access request
 */
export async function createAccessRequestController(req, res) {
  try {
    const { course_id, receipt_id } = req.body;

    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    // Check if user already has a pending or approved request for this course
    const existingRequestText = `
      SELECT * FROM AccessRequest 
      WHERE user_id = $1 AND course_id = $2 AND status IN ('pending', 'approved')
    `;
    const existingRequest = await query(existingRequestText, [req.user.user_id, course_id]);

    if (existingRequest.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'You already have a pending or approved access request for this course'
      });
    }

    const accessRequestData = {
      user_id: req.user.user_id,
      course_id,
      receipt_id: receipt_id || null,
      status: 'pending'
    };

    const accessRequest = await createAccessRequest(accessRequestData);

    res.status(201).json({
      success: true,
      message: 'Access request created successfully',
      data: accessRequest
    });
  } catch (error) {
    console.error('Error creating access request:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating access request',
      error: error.message
    });
  }
}

/**
 * Controller function to get user's access requests
 */
export async function getUserAccessRequests(req, res) {
  try {
    const accessRequests = await getRequestsByUserId(req.user.user_id);

    res.status(200).json({
      success: true,
      data: accessRequests
    });
  } catch (error) {
    console.error('Error fetching user access requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching access requests',
      error: error.message
    });
  }
}

export default {
  createAccessRequestController,
  getUserAccessRequests
};