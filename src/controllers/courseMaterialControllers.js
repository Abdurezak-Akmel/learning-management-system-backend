import {
  createMaterial,
  getMaterialById,
  getMaterialsByCourseId,
  getMaterialsByTitle,
  getMaterialsByFilename,
  getMaterialsByFileType,
  getAllMaterials,
  updateMaterialById,
  deleteMaterialById
} from '../models/courseMaterialModel.js';

/**
 * Admin controller: create a new course material
 */
export async function createMaterialController(req, res) {
  try {
    const { course_id, title, description, file_name, file_type, file_size, file_url } = req.body || {};

    if (!course_id || !title || !file_name || !file_url) {
      return res.status(400).json({
        success: false,
        message: 'course_id, title, file_name, and file_url are required'
      });
    }

    // Validate course_id is a number
    if (!Number.isInteger(Number(course_id))) {
      return res.status(400).json({
        success: false,
        message: 'course_id must be a valid integer'
      });
    }

    const materialData = {
      course_id: Number(course_id),
      title: title.trim(),
      description: description ? description.trim() : null,
      file_name: file_name.trim(),
      file_type: file_type ? file_type.trim() : null,
      file_size: file_size ? Number(file_size) : null,
      file_url: file_url.trim()
    };

    const newMaterial = await createMaterial(materialData);

    return res.status(201).json({
      success: true,
      message: 'Course material created successfully',
      material: newMaterial
    });
  } catch (err) {
    console.error('createMaterialController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * Admin controller: get all course materials
 */
export async function getAllMaterialsController(req, res) {
  try {
    const materials = await getAllMaterials();
    return res.json({ success: true, materials });
  } catch (err) {
    console.error('getAllMaterialsController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * User controller: get material by ID
 */
export async function getMaterialByIdController(req, res) {
  try {
    const materialId = Number(req.params.id);
    if (!Number.isInteger(materialId) || materialId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid material ID'
      });
    }

    const material = await getMaterialById(materialId);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    return res.json({ success: true, material });
  } catch (err) {
    console.error('getMaterialByIdController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

export async function getMaterialsByCourseIdController(req, res) {
  try {
    const courseId = Number(req.params.course_id);
    if (!Number.isInteger(courseId) || courseId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid course ID'
      });
    }

    const materials = await getMaterialsByCourseId(courseId);
    return res.json({ success: true, materials });
  } catch (err) {
    console.error('getMaterialsByCourseIdController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

export async function getMaterialsByTitleController(req, res) {
  try {
    const { title } = req.query;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title query parameter is required'
      });
    }

    const materials = await getMaterialsByTitle(title.trim());
    return res.json({ success: true, materials });
  } catch (err) {
    console.error('getMaterialsByTitleController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

export async function getMaterialsByFilenameController(req, res) {
  try {
    const { file_name } = req.query;
    
    if (!file_name) {
      return res.status(400).json({
        success: false,
        message: 'File name query parameter is required'
      });
    }

    const materials = await getMaterialsByFilename(file_name.trim());
    return res.json({ success: true, materials });
  } catch (err) {
    console.error('getMaterialsByFilenameController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

export async function getMaterialsByFileTypeController(req, res) {
  try {
    const { file_type } = req.query;
    
    if (!file_type) {
      return res.status(400).json({
        success: false,
        message: 'File type query parameter is required'
      });
    }

    const materials = await getMaterialsByFileType(file_type.trim());
    return res.json({ success: true, materials });
  } catch (err) {
    console.error('getMaterialsByFileTypeController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * Admin controller: update course material
 */
export async function updateMaterialController(req, res) {
  try {
    const materialId = Number(req.params.id);
    if (!Number.isInteger(materialId) || materialId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid material ID'
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
    const allowedFields = ['course_id', 'title', 'description', 'file_name', 'file_type', 'file_size', 'file_url'];
    const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Invalid fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}`
      });
    }

    // Convert course_id and file_size to numbers if provided
    if (updates.course_id !== undefined) {
      updates.course_id = Number(updates.course_id);
      if (!Number.isInteger(updates.course_id)) {
        return res.status(400).json({
          success: false,
          message: 'course_id must be a valid integer'
        });
      }
    }

    if (updates.file_size !== undefined) {
      updates.file_size = Number(updates.file_size);
      if (!Number.isInteger(updates.file_size)) {
        return res.status(400).json({
          success: false,
          message: 'file_size must be a valid integer'
        });
      }
    }

    // Trim string fields
    const stringFields = ['title', 'description', 'file_name', 'file_type', 'file_url'];
    stringFields.forEach(field => {
      if (updates[field] !== undefined) {
        updates[field] = updates[field] ? updates[field].trim() : null;
      }
    });

    // Add updated_at timestamp
    updates.updated_at = new Date();

    const updatedMaterial = await updateMaterialById(materialId, updates);
    if (!updatedMaterial) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    return res.json({
      success: true,
      message: 'Material updated successfully',
      material: updatedMaterial
    });
  } catch (err) {
    console.error('updateMaterialController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

/**
 * Admin controller: delete course material
 */
export async function deleteMaterialController(req, res) {
  try {
    const materialId = Number(req.params.id);
    if (!Number.isInteger(materialId) || materialId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid material ID'
      });
    }

    const deleted = await deleteMaterialById(materialId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    return res.json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (err) {
    console.error('deleteMaterialController error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
}

export default {
  createMaterialController,
  getAllMaterialsController,
  getMaterialByIdController,
  getMaterialsByCourseIdController,
  getMaterialsByTitleController,
  getMaterialsByFilenameController,
  getMaterialsByFileTypeController,
  updateMaterialController,
  deleteMaterialController
};