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
import path from 'path';
import fs from 'fs/promises';
import multer from 'multer';

// Ensure the course-materials directory exists
const MATERIALS_DIR = path.join(process.cwd(), 'uploads', 'course-materials');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory, controller will save to disk
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types for course materials
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/avi',
      'video/mpeg',
      'audio/mpeg',
      'audio/wav',
      'application/zip',
      'application/x-zip-compressed'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, images, videos, audio, and ZIP files are allowed.'), false);
    }
  }
});

/**
 * Admin controller: create a new course material
 */
export async function createMaterialController(req, res) {
  try {
    const { course_id, title, description } = req.body || {};

    if (!course_id || !title) {
      return res.status(400).json({
        success: false,
        message: 'course_id and title are required'
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required'
      });
    }

    // Validate course_id is a number
    if (!Number.isInteger(Number(course_id))) {
      return res.status(400).json({
        success: false,
        message: 'course_id must be a valid integer'
      });
    }

    // Ensure the materials directory exists
    try {
      await fs.access(MATERIALS_DIR);
    } catch (err) {
      await fs.mkdir(MATERIALS_DIR, { recursive: true });
    }

    // Generate unique filename to avoid conflicts
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName);
    const baseName = path.basename(originalName, fileExtension);
    const timestamp = Date.now();
    const uniqueFilename = `${baseName}_${timestamp}${fileExtension}`;
    
    // Store file in course-materials directory
    const filePath = path.join(MATERIALS_DIR, uniqueFilename);
    await fs.writeFile(filePath, req.file.buffer);

    // Create file URL for accessing the file
    const fileUrl = `/uploads/course-materials/${uniqueFilename}`;

    const materialData = {
      course_id: Number(course_id),
      title: title.trim(),
      description: description ? description.trim() : null,
      file_name: originalName,
      file_type: fileExtension.substring(1), // Remove the dot from extension
      file_size: req.file.size,
      file_url: fileUrl
    };

    const newMaterial = await createMaterial(materialData);

    return res.status(201).json({
      success: true,
      message: 'Course material created successfully',
      material: newMaterial
    });
  } catch (err) {
    console.error('createMaterialController error:', err);
    
    // Clean up uploaded file if database operation failed
    if (req.file && req.file.originalname) {
      try {
        const uniqueFilename = `${path.basename(req.file.originalname, path.extname(req.file.originalname))}_${Date.now()}${path.extname(req.file.originalname)}`;
        const filePath = path.join(MATERIALS_DIR, uniqueFilename);
        await fs.unlink(filePath);
      } catch (cleanupErr) {
        console.error('Failed to cleanup file:', cleanupErr);
      }
    }
    
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

    // Get material info to find the file path before deleting
    const material = await getMaterialById(materialId);
    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Delete the physical file if it exists
    if (material.file_url) {
      try {
        const fileName = path.basename(material.file_url);
        const filePath = path.join(MATERIALS_DIR, fileName);
        await fs.access(filePath); // Check if file exists
        await fs.unlink(filePath); // Delete the file
        console.log(`Deleted file: ${filePath}`);
      } catch (fileErr) {
        console.error('Failed to delete file:', fileErr);
        // Continue with database deletion even if file deletion fails
      }
    }

    // Delete the material record from database
    const deleted = await deleteMaterialById(materialId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    return res.json({
      success: true,
      message: 'Course material deleted successfully'
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