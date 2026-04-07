import {
  createLandingVideo,
  updateLandingVideoById,
  getLandingVideoById,
  getAllLandingVideos,
  deleteLandingVideoById,
} from '../models/landingVideoModel.js';

/**
 * Admin controller: create a new landing video
 */
export async function createLandingVideoController(req, res) {
  try {
    const { title, description, youtube_url, order_index, duration } = req.body || {};

    if (!youtube_url) {
      return res.status(400).json({
        success: false,
        message: 'youtube_url is required',
      });
    }

    const videoData = {
      title: title ? title.trim() : null,
      description: description ? description.trim() : null,
      youtube_url: youtube_url.trim(),
      order_index: order_index !== undefined ? Number(order_index) : 0,
      duration: duration !== undefined ? Number(duration) : null,
    };

    const newVideo = await createLandingVideo(videoData);

    return res.status(201).json({
      success: true,
      message: 'Landing video created successfully',
      video: newVideo,
    });
  } catch (err) {
    console.error('createLandingVideoController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
}

/**
 * Admin controller: update an existing landing video
 */
export async function updateLandingVideoController(req, res) {
  try {
    const landVideoId = Number(req.params.id);
    if (!Number.isInteger(landVideoId) || landVideoId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid landing video ID',
      });
    }

    const updates = req.body || {};
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one field must be provided for update',
      });
    }

    // Validate allowed fields
    const allowedFields = ['title', 'description', 'youtube_url', 'order_index', 'duration'];
    const invalidFields = Object.keys(updates).filter((field) => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}`,
      });
    }

    // Format fields
    if (updates.title !== undefined) updates.title = updates.title ? updates.title.trim() : null;
    if (updates.description !== undefined) updates.description = updates.description ? updates.description.trim() : null;
    if (updates.youtube_url !== undefined) updates.youtube_url = updates.youtube_url ? updates.youtube_url.trim() : null;
    if (updates.order_index !== undefined) updates.order_index = Number(updates.order_index);
    if (updates.duration !== undefined) updates.duration = Number(updates.duration);

    const updatedVideo = await updateLandingVideoById(landVideoId, updates);

    if (!updatedVideo) {
      return res.status(404).json({
        success: false,
        message: 'Landing video not found',
      });
    }

    return res.json({
      success: true,
      message: 'Landing video updated successfully',
      video: updatedVideo,
    });
  } catch (err) {
    console.error('updateLandingVideoController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
}

/**
 * Public controller: get all landing videos
 */
export async function getAllLandingVideosController(req, res) {
  try {
    const videos = await getAllLandingVideos();
    return res.json({
      success: true,
      videos,
    });
  } catch (err) {
    console.error('getAllLandingVideosController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
}

/**
 * Public controller: get a single landing video by id
 */
export async function getLandingVideoByIdController(req, res) {
  try {
    const landVideoId = Number(req.params.id);
    if (!Number.isInteger(landVideoId) || landVideoId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid landing video ID',
      });
    }

    const video = await getLandingVideoById(landVideoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Landing video not found',
      });
    }

    return res.json({
      success: true,
      video,
    });
  } catch (err) {
    console.error('getLandingVideoByIdController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
}

/**
 * Admin controller: delete a landing video
 */
export async function deleteLandingVideoController(req, res) {
  try {
    const landVideoId = Number(req.params.id);
    if (!Number.isInteger(landVideoId) || landVideoId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid landing video ID',
      });
    }

    const deleted = await deleteLandingVideoById(landVideoId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Landing video not found',
      });
    }

    return res.json({
      success: true,
      message: 'Landing video deleted successfully',
    });
  } catch (err) {
    console.error('deleteLandingVideoController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
    });
  }
}

export default {
  createLandingVideoController,
  updateLandingVideoController,
  getAllLandingVideosController,
  getLandingVideoByIdController,
  deleteLandingVideoController,
};
