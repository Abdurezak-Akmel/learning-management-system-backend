import { getAllRoles, createRole, getRoleById, updateRoleById } from '../models/roleModel.js';

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
 * Controller function to get a role by ID
 */
export async function getRoleByIdController(req, res) {
	try {
		const { id } = req.params || {};

		if (!id || isNaN(id)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid role ID'
			});
		}

		const role = await getRoleById(id);
		if (!role) {
			return res.status(404).json({
				success: false,
				message: 'Role not found'
			});
		}

		return res.json({ success: true, role });
	} catch (err) {
		console.error('getRoleByIdController error:', err);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

/**
 * Controller function to update a role by ID
 */
export async function updateRoleController(req, res) {
	try {
		const { id } = req.params || {};
		const { role_name, description } = req.body || {};

		const roleId = Number(id);

		if (!id || isNaN(roleId)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid role ID'
			});
		}

		if (!role_name || role_name.trim() === '') {
			return res.status(400).json({
				success: false,
				message: 'Role name is required'
			});
		}

		// Check if role exists
		const existingRole = await getRoleById(roleId);
		if (!existingRole) {
			return res.status(404).json({
				success: false,
				message: 'Role not found'
			});
		}

		// Check if role name already exists (and it's not the same role)
		const { getRoleByName } = await import('../models/roleModel.js');
		const roleByName = await getRoleByName(role_name.trim());

		if (roleByName && roleByName.role_id !== roleId) {
			return res.status(409).json({
				success: false,
				message: 'Role name already exists'
			});
		}

		const roleData = {
			role_name: role_name.trim(),
			description: description ? description.trim() : null
		};

		const updatedRole = await updateRoleById(roleId, roleData);

		return res.status(200).json({
			success: true,
			message: 'Role updated successfully',
			role: updatedRole
		});
	} catch (err) {
		console.error('updateRoleController error:', err);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: err.message
		});
	}
}

export default {
	getAllRolesController,
	getRoleByIdController,
	createRoleController,
	updateRoleController
};