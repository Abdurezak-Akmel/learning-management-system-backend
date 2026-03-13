import { getAllUsers, updateUserById, deleteUserById } from '../models/userModel.js';

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

export async function updateUserRole(req, res) {
	try {
		const userId = Number(req.params.id);
		if (!Number.isInteger(userId) || userId <= 0) {
			return res.status(400).json({ success: false, message: 'Invalid user id' });
		}

		const { role_id } = req.body || {};
		if (role_id === undefined || role_id === null) {
			return res.status(400).json({ success: false, message: 'role_id is required in body' });
		}
		const roleIdNum = Number(role_id);
		if (!Number.isInteger(roleIdNum)) {
			return res.status(400).json({ success: false, message: 'role_id must be an integer' });
		}

		const updated = await updateUserById(userId, { role_id: roleIdNum });
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

export default { fetchAllUsers, updateUserRole, deleteUser };
