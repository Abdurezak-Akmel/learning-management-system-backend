import {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourseById,
  deleteCourseById
} from '../models/courseModel.js';

/**
 * Admin controller: create a new course
 */
export async function createCourseController(req, res) {
  try {
    const { title, description, category, level } = req.body || {};

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Title must be a string'
      });
    }

    const courseData = {
      title: title.trim(),
      description: description ? description.trim() : null,
      category: category ? category.trim() : null,
      level: level ? level.trim() : null
    };

    const newCourse = await createCourse(courseData);

    return res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: newCourse
    });
  } catch (err) {
    console.error('createCourseController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * User controller: get all courses
 */
export async function getAllCoursesController(req, res) {
  try {
    const courses = await getAllCourses();
    return res.json({ success: true, courses });
  } catch (err) {
    console.error('getAllCoursesController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * User controller: get course by ID
 */
export async function getCourseByIdController(req, res) {
  try {
    const courseId = Number(req.params.id);
    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }

    const course = await getCourseById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    return res.json({ success: true, course });
  } catch (err) {
    console.error('getCourseByIdController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * Admin controller: update course
 */
export async function updateCourseController(req, res) {
  try {
    const courseId = Number(req.params.id);
    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
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
    const allowedFields = ['title', 'description', 'category', 'level'];
    const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}`
      });
    }

    // Trim string fields
    const stringFields = ['title', 'description', 'category', 'level'];
    stringFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates[field] = updates[field] ? updates[field].trim() : null;
      }
    });

    const updatedCourse = await updateCourseById(courseId, updates);
    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    return res.json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (err) {
    console.error('updateCourseController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * Admin controller: delete course
 */
export async function deleteCourseController(req, res) {
  try {
    const courseId = Number(req.params.id);
    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }

    const deleted = await deleteCourseById(courseId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    return res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (err) {
    console.error('deleteCourseController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

export default {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  updateCourseController,
  deleteCourseController
};