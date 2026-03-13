import { query } from '../config/db.js';

/**
 * Create a password reset token record.
 * @param {{user_id:number, reset_token:string, expires_at:Date, used?:boolean}} token
 * @returns {Promise<object>} inserted row
 */
export async function createToken(token) {
	const text = `INSERT INTO password_reset_tokens (user_id, reset_token, expires_at, used) VALUES ($1,$2,$3,$4) RETURNING *`;
	const values = [token.user_id, token.reset_token, token.expires_at, token.used === undefined ? false : token.used];
	const res = await query(text, values);
	return res.rows[0];
}

/**
 * Get token by id.
 * @param {number} id
 * @returns {Promise<object|null>}
 */
export async function getTokenById(id) {
	const text = `SELECT * FROM password_reset_tokens WHERE id = $1`;
	const res = await query(text, [id]);
	return res.rows[0] || null;
}

/**
 * Get tokens for a user.
 * @param {number} user_id
 * @returns {Promise<Array>}
 */
export async function getTokensByUserId(user_id) {
	const text = `SELECT * FROM password_reset_tokens WHERE user_id = $1 ORDER BY created_at DESC`;
	const res = await query(text, [user_id]);
	return res.rows;
}

/**
 * Get a token record by its reset token value.
 * @param {string} resetToken
 * @returns {Promise<object|null>}
 */
export async function getTokenByResetToken(resetToken) {
	const text = `SELECT * FROM password_reset_tokens WHERE reset_token = $1`;
	const res = await query(text, [resetToken]);
	return res.rows[0] || null;
}

/**
 * Get a valid (not used and not expired) token by reset token value.
 * @param {string} resetToken
 * @returns {Promise<object|null>}
 */
export async function getValidTokenByResetToken(resetToken) {
	const text = `SELECT * FROM password_reset_tokens WHERE reset_token = $1 AND used = FALSE AND expires_at > NOW()`;
	const res = await query(text, [resetToken]);
	return res.rows[0] || null;
}

/**
 * Mark a token as used.
 * @param {number} id
 * @returns {Promise<object|null>} updated row
 */
export async function markTokenUsed(id) {
	const text = `UPDATE password_reset_tokens SET used = TRUE WHERE id = $1 RETURNING *`;
	const res = await query(text, [id]);
	return res.rows[0] || null;
}

/**
 * Delete a token by id.
 * @param {number} id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteTokenById(id) {
	const text = `DELETE FROM password_reset_tokens WHERE id = $1`;
	const res = await query(text, [id]);
	return res.rowCount > 0;
}

/**
 * Delete all tokens for a user.
 * @param {number} user_id
 * @returns {Promise<number>} number of rows deleted
 */
export async function deleteTokensByUserId(user_id) {
	const text = `DELETE FROM password_reset_tokens WHERE user_id = $1`;
	const res = await query(text, [user_id]);
	return res.rowCount;
}

/**
 * Remove expired tokens.
 * @returns {Promise<number>} number of rows deleted
 */
export async function purgeExpiredTokens() {
	const text = `DELETE FROM password_reset_tokens WHERE expires_at <= NOW()`;
	const res = await query(text);
	return res.rowCount;
}

export default {
	createToken,
	getTokenById,
	getTokensByUserId,
	getTokenByResetToken,
	getValidTokenByResetToken,
	markTokenUsed,
	deleteTokenById,
	deleteTokensByUserId,
	purgeExpiredTokens,
};

