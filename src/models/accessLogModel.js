import { query } from '../config/db.js';

/**
 * Log a course access by a user.
 * @param {{user_id:number,course_id:number,ip_address?:string}} entry
 * @returns {Promise<object>} inserted log row
 */
export async function createAccessLog(entry) {
	const text = `INSERT INTO AccessLog (user_id, course_id, ip_address) VALUES ($1,$2,$3) RETURNING *`;
	const values = [entry.user_id, entry.course_id, entry.ip_address || null];
	const res = await query(text, values);
	return res.rows[0];
}

/**
 * Get access log by id.
 * @param {number} log_id
 * @returns {Promise<object|null>}
 */
export async function getAccessLogById(log_id) {
	const text = `SELECT * FROM AccessLog WHERE log_id = $1`;
	const res = await query(text, [log_id]);
	return res.rows[0] || null;
}

/**
 * Get logs for a user.
 * @param {number} user_id
 * @returns {Promise<Array>} array of logs
 */
export async function getLogsByUserId(user_id) {
	const text = `SELECT * FROM AccessLog WHERE user_id = $1 ORDER BY access_time DESC`;
	const res = await query(text, [user_id]);
	return res.rows;
}

/**
 * Get logs for a course.
 * @param {number} course_id
 * @returns {Promise<Array>} array of logs
 */
export async function getLogsByCourseId(course_id) {
	const text = `SELECT * FROM AccessLog WHERE course_id = $1 ORDER BY access_time DESC`;
	const res = await query(text, [course_id]);
	return res.rows;
}

/**
 * Get logs between two timestamps.
 * @param {string|Date} from
 * @param {string|Date} to
 * @returns {Promise<Array>} array of logs
 */
export async function getLogsBetween(from, to) {
	const text = `SELECT * FROM AccessLog WHERE access_time >= $1 AND access_time <= $2 ORDER BY access_time DESC`;
	const res = await query(text, [from, to]);
	return res.rows;
}

/**
 * Delete an access log by id.
 * @param {number} log_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteAccessLogById(log_id) {
	const text = `DELETE FROM AccessLog WHERE log_id = $1`;
	const res = await query(text, [log_id]);
	return res.rowCount > 0;
}

export default {
	createAccessLog,
	getAccessLogById,
	getLogsByUserId,
	getLogsByCourseId,
	getLogsBetween,
	deleteAccessLogById,
};

