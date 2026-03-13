import { query } from '../config/db.js';

/**
 * Create a new access request.
 * @param {{user_id:number,course_id:number,receipt_id?:number,status?:string}} req
 * @returns {Promise<object>} inserted request row
 */
export async function createAccessRequest(req) {
  const text = `INSERT INTO AccessRequest (user_id, course_id, receipt_id, status) VALUES ($1,$2,$3,$4) RETURNING *`;
  const values = [req.user_id, req.course_id, req.receipt_id || null, req.status || null];
  const res = await query(text, values);
  return res.rows[0];
}

/**
 * Get an access request by id.
 * @param {number} request_id
 * @returns {Promise<object|null>}
 */
export async function getAccessRequestById(request_id) {
  const text = `SELECT * FROM AccessRequest WHERE request_id = $1`;
  const res = await query(text, [request_id]);
  return res.rows[0] || null;
}

/**
 * Get requests by user id.
 * @param {number} user_id
 * @returns {Promise<Array>} array of requests
 */
export async function getRequestsByUserId(user_id) {
  const text = `SELECT * FROM AccessRequest WHERE user_id = $1 ORDER BY requested_at DESC`;
  const res = await query(text, [user_id]);
  return res.rows;
}

/**
 * Get requests by course id.
 * @param {number} course_id
 * @returns {Promise<Array>} array of requests
 */
export async function getRequestsByCourseId(course_id) {
  const text = `SELECT * FROM AccessRequest WHERE course_id = $1 ORDER BY requested_at DESC`;
  const res = await query(text, [course_id]);
  return res.rows;
}

/**
 * Get requests by status.
 * @param {string} status
 * @returns {Promise<Array>} array of requests
 */
export async function getRequestsByStatus(status) {
  const text = `SELECT * FROM AccessRequest WHERE status = $1 ORDER BY requested_at DESC`;
  const res = await query(text, [status]);
  return res.rows;
}

/**
 * Get requests reviewed by a specific reviewer.
 * @param {number} reviewer_id
 * @returns {Promise<Array>} array of requests
 */
export async function getRequestsReviewedBy(reviewer_id) {
  const text = `SELECT * FROM AccessRequest WHERE reviewed_by = $1 ORDER BY reviewed_at DESC`;
  const res = await query(text, [reviewer_id]);
  return res.rows;
}

/**
 * Get pending requests (status = 'pending').
 * @returns {Promise<Array>} array of requests
 */
export async function getPendingRequests() {
  const text = `SELECT * FROM AccessRequest WHERE status = 'pending' ORDER BY requested_at`;
  const res = await query(text);
  return res.rows;
}

/**
 * Update an access request by id. Only allowed fields provided in `updates` will be changed.
 */
export async function updateAccessRequestById(request_id, updates) {
  const allowed = ['user_id', 'course_id', 'receipt_id', 'status', 'requested_at', 'reviewed_by', 'reviewed_at'];
  const set = [];
  const values = [];
  let idx = 1;
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      set.push(`${key} = $${idx++}`);
      values.push(updates[key]);
    }
  }
  if (set.length === 0) return getAccessRequestById(request_id);

  const text = `UPDATE AccessRequest SET ${set.join(', ')} WHERE request_id = $${idx} RETURNING *`;
  values.push(request_id);
  const res = await query(text, values);
  return res.rows[0] || null;
}

/**
 * Delete an access request by id.
 * @param {number} request_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteAccessRequestById(request_id) {
  const text = `DELETE FROM AccessRequest WHERE request_id = $1`;
  const res = await query(text, [request_id]);
  return res.rowCount > 0;
}

export default {
  createAccessRequest,
  getAccessRequestById,
  getRequestsByUserId,
  getRequestsByCourseId,
  getRequestsByStatus,
  getRequestsReviewedBy,
  getPendingRequests,
  updateAccessRequestById,
  deleteAccessRequestById,
};
