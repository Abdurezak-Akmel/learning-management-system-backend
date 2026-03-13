import { query } from '../config/db.js';

/**
 * Create a new role.
 * @param {{role_name: string, description?: string}} role
 * @returns {Promise<object>} inserted role row
 */
export async function createRole(role) {
	const text = `INSERT INTO Role (role_name, description) VALUES ($1, $2) RETURNING *`;
	const values = [role.role_name, role.description || null];
	const res = await query(text, values);
	return res.rows[0];
}

/**
 * Get a role by its id.
 * @param {number} role_id
 * @returns {Promise<object|null>} role or null
 */
export async function getRoleById(role_id) {
	const text = `SELECT * FROM Role WHERE role_id = $1`;
	const res = await query(text, [role_id]);
	return res.rows[0] || null;
}

/**
 * Get a role by its name.
 * @param {string} role_name
 * @returns {Promise<object|null>} role or null
 */
export async function getRoleByName(role_name) {
	const text = `SELECT * FROM Role WHERE role_name = $1`;
	const res = await query(text, [role_name]);
	return res.rows[0] || null;
}

/**
 * Get all roles.
 * @returns {Promise<Array>} array of roles
 */
export async function getAllRoles() {
	const text = `SELECT * FROM Role ORDER BY role_id`;
	const res = await query(text);
	return res.rows;
}

/**
 * Update a role by id.
 * Only updates fields provided in the `updates` object.
 * @param {number} role_id
 * @param {{role_name?: string, description?: string}} updates
 * @returns {Promise<object|null>} updated row or null
 */
export async function updateRoleById(role_id, updates) {
	// Build dynamic SET clause
	const set = [];
	const values = [];
	let idx = 1;
	if (updates.role_name !== undefined) {
		set.push(`role_name = $${idx++}`);
		values.push(updates.role_name);
	}
	if (updates.description !== undefined) {
		set.push(`description = $${idx++}`);
		values.push(updates.description);
	}
	if (set.length === 0) return getRoleById(role_id);

	const text = `UPDATE Role SET ${set.join(', ')} WHERE role_id = $${idx} RETURNING *`;
	values.push(role_id);
	const res = await query(text, values);
	return res.rows[0] || null;
}

/**
 * Delete a role by id.
 * @param {number} role_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteRoleById(role_id) {
	const text = `DELETE FROM Role WHERE role_id = $1`;
	const res = await query(text, [role_id]);
	return res.rowCount > 0;
}

export default {
	createRole,
	getRoleById,
	getRoleByName,
	getAllRoles,
	updateRoleById,
	deleteRoleById,
};

