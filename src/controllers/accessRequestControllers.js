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
    const { course_id, receipt_id, payment_amount } = req.body;

    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }

    if (payment_amount === undefined || payment_amount === null) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount is required'
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
      payment_amount,
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

/**
 * Admin controller function to get all access requests
 */
export async function getAllAccessRequestsController(req, res) {
  try {
    const { status, course_id, user_id } = req.query;
    let accessRequests;

    if (status === 'pending') {
      accessRequests = await getPendingRequests();
    } else if (status) {
      accessRequests = await getRequestsByStatus(status);
    } else if (course_id) {
      accessRequests = await getRequestsByCourseId(Number(course_id));
    } else if (user_id) {
      accessRequests = await getRequestsByUserId(Number(user_id));
    } else {
      // Get all requests with detailed info
      const text = `
        SELECT ar.*, u.email, c.title as course_title
        FROM AccessRequest ar
        JOIN "User" u ON ar.user_id = u.user_id
        JOIN Course c ON ar.course_id = c.course_id
        ORDER BY ar.requested_at DESC
      `;
      const res = await query(text);
      accessRequests = res.rows;
    }

    res.status(200).json({
      success: true,
      data: accessRequests
    });
  } catch (error) {
    console.error('Error fetching all access requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching access requests',
      error: error.message
    });
  }
}

/**
 * Admin controller function to get a specific access request by ID
 */
export async function getAccessRequestByIdController(req, res) {
  try {
    const request_id = Number(req.params.request_id);

    if (!Number.isInteger(request_id) || request_id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }

    const accessRequest = await getAccessRequestById(request_id);

    if (!accessRequest) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: accessRequest
    });
  } catch (error) {
    console.error('Error fetching access request:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching access request',
      error: error.message
    });
  }
}

/**
 * Admin controller function to update access request status
 */
export async function updateAccessRequestStatusController(req, res) {
  try {
    const request_id = Number(req.params.request_id);
    const { status, reviewed_at } = req.body;

    if (!Number.isInteger(request_id) || request_id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status values
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected'
      });
    }

    const updates = {
      status,
      reviewed_at: reviewed_at || new Date()
    };

    const updatedRequest = await updateAccessRequestById(request_id, updates);

    if (!updatedRequest) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Access request updated successfully',
      data: updatedRequest
    });
  } catch (error) {
    console.error('Error updating access request:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating access request',
      error: error.message
    });
  }
}

/**
 * Admin controller function to delete an access request
 */
export async function deleteAccessRequestController(req, res) {
  try {
    const request_id = Number(req.params.request_id);

    if (!Number.isInteger(request_id) || request_id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request ID'
      });
    }

    const deleted = await deleteAccessRequestById(request_id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Access request not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Access request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting access request:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting access request',
      error: error.message
    });
  }
}

/**
 * Admin controller function to get pending requests
 */
export async function getPendingRequestsController(req, res) {
  try {
    const pendingRequests = await getPendingRequests();

    res.status(200).json({
      success: true,
      data: pendingRequests
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending requests',
      error: error.message
    });
  }
}

/**
 * Admin controller function to get requests by course ID
 */
export async function getRequestsByCourseIdController(req, res) {
  try {
    const course_id = Number(req.params.course_id);

    if (!Number.isInteger(course_id) || course_id <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }

    const requests = await getRequestsByCourseId(course_id);

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching requests by course ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requests',
      error: error.message
    });
  }
}

/**
 * Admin controller function to get requests by status
 */
export async function getRequestsByStatusController(req, res) {
  try {
    const { status } = req.params;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const requests = await getRequestsByStatus(status);

    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching requests by status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching requests',
      error: error.message
    });
  }
}

export default {
  createAccessRequestController,
  getUserAccessRequests,
  getAllAccessRequestsController,
  getAccessRequestByIdController,
  updateAccessRequestStatusController,
  deleteAccessRequestController,
  getPendingRequestsController,
  getRequestsByCourseIdController,
  getRequestsByStatusController
};