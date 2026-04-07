import {
  createVideo,
  getVideoById,
  getVideosByCourseId,
  getAllVideos,
  updateVideoById,
  deleteVideoById
} from '../models/videoModel.js';

/**
 * Admin controller: create a new video
 */
export async function createVideoController(req, res) {
  try {
    const { course_id, title, description, youtube_url, order_index, duration } = req.body || {};

    if (!course_id || !youtube_url) {
      return res.status(400).json({
        success: false,
        message: 'course_id and youtube_url are required'
      });
    }

    // Validate course_id is a number
    if (!Number.isInteger(Number(course_id))) {
      return res.status(400).json({
        success: false,
        message: 'course_id must be a valid integer'
      });
    }

    // Validate order_index if provided
    if (order_index !== undefined) {
      if (!Number.isInteger(Number(order_index))) {
        return res.status(400).json({
          success: false,
          message: 'order_index must be a valid integer'
        });
      }
    }

    const videoData = {
      course_id: Number(course_id),
      title: title ? title.trim() : null,
      description: description ? description.trim() : null,
      youtube_url: youtube_url.trim(),
      order_index: order_index ? Number(order_index) : null,
      duration: duration
    };

    const newVideo = await createVideo(videoData);

    return res.status(201).json({
      success: true,
      message: 'Video created successfully',
      video: newVideo
    });
  } catch (err) {
    console.error('createVideoController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * Admin controller: get all videos
 */
export async function getAllVideosController(req, res) {
  try {
    const videos = await getAllVideos();
    return res.json({ success: true, videos });
  } catch (err) {
    console.error('getAllVideosController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * User controller: get videos by course ID
 */
export async function getVideosByCourseIdController(req, res) {
  try {
    const courseId = Number(req.params.course_id);
    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }

    const videos = await getVideosByCourseId(courseId);
    return res.json({ success: true, videos });
  } catch (err) {
    console.error('getVideosByCourseIdController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/*
  * Controller: get video by ID
  */
export async function getVideosByVideoIdController(req, res) {
  try {
    const videoId = Number(req.params.id);
    if (!Number.isInteger(videoId) || videoId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video ID'
      });
    }

    const video = await getVideoById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    return res.json({ success: true, video });
  } catch (err) {
    console.error('getVideosByVideoIdController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * Admin controller: update video
 */
export async function updateVideoController(req, res) {
  try {
    const videoId = Number(req.params.id);
    if (!Number.isInteger(videoId) || videoId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video ID'
      });
    }

    const updates = req.body || {};
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one field must be provided for update'
      });
    }

    // Validate allowed fields
    const allowedFields = ['course_id', 'title', 'description', 'youtube_url', 'order_index', 'duration'];
    const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}`
      });
    }

    // Convert numeric fields
    const numericFields = ['course_id', 'order_index', 'duration'];
    for (const field of numericFields) {
      if (updates[field] !== undefined) {
        updates[field] = Number(updates[field]);
        if (!Number.isInteger(updates[field])) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a valid integer`
          });
        }
      }
    }

    // Trim string fields
    const stringFields = ['title', 'description', 'youtube_url'];
    stringFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates[field] = updates[field] ? updates[field].trim() : null;
      }
    });

    // Add updated_at timestamp
    updates.updated_at = new Date();

    const updatedVideo = await updateVideoById(videoId, updates);
    if (!updatedVideo) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    return res.json({
      success: true,
      message: 'Video updated successfully',
      video: updatedVideo
    });
  } catch (err) {
    console.error('updateVideoController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * Admin controller: delete video
 */
export async function deleteVideoController(req, res) {
  try {
    const videoId = Number(req.params.id);
    if (!Number.isInteger(videoId) || videoId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video ID'
      });
    }

    const deleted = await deleteVideoById(videoId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }

    return res.json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (err) {
    console.error('deleteVideoController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

export default {
  createVideoController,
  getAllVideosController,
  getVideosByCourseIdController,
  getVideosByVideoIdController,
  updateVideoController,
  deleteVideoController
};