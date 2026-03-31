import {
    createProject,
    getProjectById,
    getAllProjects,
    updateProjectById,
    deleteProjectById
} from '../models/projectModel.js';

/**
 * Admin controller: create a new project
 */
export async function createProjectController(req, res) {
    try {
        const { title, description, category, level } = req.body || {};

        if (!title || title.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Title is required'
            });
        }

        const projectData = {
            title: title.trim(),
            description: description ? description.trim() : null,
            category: category ? category.trim() : null,
            level: level ? level.trim() : null
        };

        const newProject = await createProject(projectData);

        return res.status(201).json({
            success: true,
            message: 'Project created successfully',
            project: newProject
        });
    } catch (err) {
        console.error('createProjectController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

/**
 * Public controller: get all projects
 */
export async function getAllProjectsController(req, res) {
    try {
        const projects = await getAllProjects();
        return res.json({ success: true, projects });
    } catch (err) {
        console.error('getAllProjectsController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

/**
 * User controller: get project by ID
 */
export async function getProjectByIdController(req, res) {
    try {
        const projectId = Number(req.params.id);
        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
        }

        const project = await getProjectById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        return res.json({ success: true, project });
    } catch (err) {
        console.error('getProjectByIdController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

/**
 * Admin controller: update project
 */
export async function updateProjectController(req, res) {
    try {
        const projectId = Number(req.params.id);
        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID'
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

        const updatedProject = await updateProjectById(projectId, updates);
        if (!updatedProject) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        return res.json({
            success: true,
            message: 'Project updated successfully',
            project: updatedProject
        });
    } catch (err) {
        console.error('updateProjectController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

/**
 * Admin controller: delete project
 */
export async function deleteProjectController(req, res) {
    try {
        const projectId = Number(req.params.id);
        if (!Number.isInteger(projectId) || projectId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid project ID'
            });
        }

        const deleted = await deleteProjectById(projectId);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        return res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (err) {
        console.error('deleteProjectController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

export default {
    createProjectController,
    getAllProjectsController,
    getProjectByIdController,
    updateProjectController,
    deleteProjectController
};
