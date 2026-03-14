import { getAllUsers, updateUserById, deleteUserById, getUserById } from '../models/userModel.js';

/**
 * Admin controller: return all users.
 */
export async function fetchAllUsers(req, res) {
	try {
		const users = await getAllUsers();
		// Remove sensitive fields from response
		const safe = users.map(u => {
			const { password_hash, verification_token, verification_token_expiry, ...rest } = u || {};
			return rest;
		});
		return res.json({ success: true, users: safe });
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('fetchAllUsers error:', err);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

export async function updateUserByIdController(req, res) {
	try {
		const userId = Number(req.params.id);
		if (!Number.isInteger(userId) || userId <= 0) {
			return res.status(400).json({ success: false, message: 'Invalid user id' });
		}

		const updates = req.body || {};
		if (Object.keys(updates).length === 0) {
			return res.status(400).json({ success: false, message: 'At least one field must be provided for update' });
		}

		// Validate that only allowed user table fields are being updated
		const allowedFields = ['name', 'email', 'role_id', 'status', 'email_verified'];
		const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));
		
		if (invalidFields.length > 0) {
			return res.status(400).json({ 
				success: false, 
				message: `Invalid fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}` 
			});
		}

		// Convert role_id to number if provided
		if (updates.role_id !== undefined) {
			const roleIdNum = Number(updates.role_id);
			if (!Number.isInteger(roleIdNum)) {
				return res.status(400).json({ success: false, message: 'role_id must be an integer' });
			}
			updates.role_id = roleIdNum;
		}

		// Convert email_verified to boolean if provided
		if (updates.email_verified !== undefined) {
			updates.email_verified = Boolean(updates.email_verified);
		}

		const updated = await updateUserById(userId, updates);
		if (!updated) return res.status(404).json({ success: false, message: 'User not found' });

		const { password_hash, verification_token, verification_token_expiry, ...userSafe } = updated || {};
		return res.json({ success: true, user: userSafe });
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('updateUserRole error:', err);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

export async function deleteUser(req, res) {
	try {
		const userId = Number(req.params.id);
		if (!Number.isInteger(userId) || userId <= 0) {
			return res.status(400).json({ success: false, message: 'Invalid user id' });
		}

		const ok = await deleteUserById(userId);
		if (!ok) return res.status(404).json({ success: false, message: 'User not found' });

		return res.json({ success: true, message: 'User deleted' });
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error('deleteUser error:', err);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

/**
 * Controller function to fetch a user by ID
 */
export async function fetchUserById(req, res) {
	try {
		const userId = Number(req.params.id);
		if (!Number.isInteger(userId) || userId <= 0) {
			return res.status(400).json({ success: false, message: 'Invalid user id' });
		}

		const user = await getUserById(userId);
		if (!user) {
			return res.status(404).json({ success: false, message: 'User not found' });
		}

		// Remove sensitive fields from response
		const { password_hash, verification_token, verification_token_expiry, ...userSafe } = user;
		return res.json({ success: true, user: userSafe });
	} catch (err) {
		console.error('fetchUserById error:', err);
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
}

export default { fetchAllUsers, updateUserByIdController, deleteUser, fetchUserById };
