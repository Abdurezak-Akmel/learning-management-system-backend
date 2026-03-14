import { getAllRoles, createRole } from '../models/roleModel.js';

/**
 * Controller function to get all roles
 */
export async function getAllRolesController(req, res) {
	try {
		const roles = await getAllRoles();
		return res.json({ success: true, roles });
	} catch (err) {
		console.error('getAllRolesController error:', err);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

/**
 * Controller function to create a new role
 */
export async function createRoleController(req, res) {
	try {
		const { role_name, description } = req.body || {};

		if (!role_name || role_name.trim() === '') {
			return res.status(400).json({ 
				success: false, 
				message: 'Role name is required' 
			});
		}

		if (typeof role_name !== 'string') {
			return res.status(400).json({ 
				success: false, 
				message: 'Role name must be a string' 
			});
		}

		// Check if role name already exists
		const { getRoleByName } = await import('../models/roleModel.js');
		const existingRole = await getRoleByName(role_name.trim());
		if (existingRole) {
			return res.status(409).json({ 
				success: false, 
				message: 'Role with this name already exists' 
			});
		}

		const roleData = {
			role_name: role_name.trim(),
			description: description ? description.trim() : null
		};

		const newRole = await createRole(roleData);

		return res.status(201).json({ 
			success: true, 
			message: 'Role created successfully',
			role: newRole 
		});
	} catch (err) {
		console.error('createRoleController error:', err);
		return res.status(500).json({ 
			success: false, 
			message: 'Internal server error',
			error: err.message 
		});
	}
}

export default {
	getAllRolesController,
	createRoleController
};