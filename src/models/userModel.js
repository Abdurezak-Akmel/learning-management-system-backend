import { query } from '../config/db.js';

/**
 * Create a new user.
 * @param {{name?:string,email:string,password_hash:string,role_id?:number,status?:string,email_verified?:boolean,verification_token?:string,verification_token_expiry?:Date,registration_device:string}} user
 * @returns {Promise<object>} inserted user row
 */
export async function createUser(user) {
	const text = `INSERT INTO "User" (name, email, password_hash, role_id, status, email_verified, verification_token, verification_token_expiry, registration_device) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
	const values = [
		user.name || null,
		user.email,
		user.password_hash,
		user.role_id || null,
		user.status || null,
		user.email_verified === undefined ? false : user.email_verified,
		user.verification_token || null,
		user.verification_token_expiry || null,
		user.registration_device,
	];
	const res = await query(text, values);
	return res.rows[0];
}

/**
 * Get a user by id.
 * @param {number} user_id
 * @returns {Promise<object|null>}
 */
export async function getUserById(user_id) {
	const text = `SELECT * FROM "User" WHERE user_id = $1`;
	const res = await query(text, [user_id]);
	return res.rows[0] || null;
}

/**
 * Get a user by email.
 * @param {string} email
 * @returns {Promise<object|null>}
 */
export async function getUserByEmail(email) {
	const text = `SELECT * FROM "User" WHERE email = $1`;
	const res = await query(text, [email]);
	return res.rows[0] || null;
}

/**
 * Get a user by name.
 * @param {string} name
 * @returns {Promise<object|null>}
 */
export async function getUserByName(name) {
	const text = `SELECT * FROM "User" WHERE name = $1`;
	const res = await query(text, [name]);
	return res.rows[0] || null;
}

/**
 * Get a user by verification token.
 * @param {string} token
 * @returns {Promise<object|null>}
 */
export async function getUserByVerificationToken(token) {
	const text = `SELECT * FROM "User" WHERE verification_token = $1`;
	const res = await query(text, [token]);
	return res.rows[0] || null;
}

/**
 * Get all users (simple list).
 * @returns {Promise<Array>} array of users
 */
export async function getAllUsers() {
	const text = `SELECT * FROM "User" ORDER BY user_id`;
	const res = await query(text);
	return res.rows;
}

/**
 * Update a user by id. Only fields present in `updates` are changed.
 * @param {number} user_id
 * @param {object} updates
 * @returns {Promise<object|null>} updated row or null
 */
export async function updateUserById(user_id, updates) {
	const set = [];
	const values = [];
	let idx = 1;
	const allowed = [
		'name',
		'email',
		'password_hash',
		'role_id',
		'status',
		'email_verified',
		'verification_token',
		'verification_token_expiry',
		'registration_device',
	];
	for (const key of allowed) {
		if (Object.prototype.hasOwnProperty.call(updates, key)) {
			set.push(`${key} = $${idx++}`);
			values.push(updates[key]);
		}
	}
	if (set.length === 0) return getUserById(user_id);

	const text = `UPDATE "User" SET ${set.join(', ')} WHERE user_id = $${idx} RETURNING *`;
	values.push(user_id);
	const res = await query(text, values);
	return res.rows[0] || null;
}

/**
 * Delete a user by id.
 * @param {number} user_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteUserById(user_id) {
	const text = `DELETE FROM "User" WHERE user_id = $1`;
	const res = await query(text, [user_id]);
	return res.rowCount > 0;
}

export default {
	createUser,
	getUserById,
	getUserByEmail,
	getUserByName,
	getUserByVerificationToken,
	getAllUsers,
	updateUserById,
	deleteUserById,
};

