import { query } from '../config/db.js';

/**
 * Create a new receipt.
 * @param {{user_id:number,file_path:string,status?:string}} receipt
 * @returns {Promise<object>} inserted receipt row
 */
export async function createReceipt(receipt) {
  const text = `INSERT INTO Receipt (user_id, file_path, status) VALUES ($1,$2,$3) RETURNING *`;
  const values = [receipt.user_id, receipt.file_path, receipt.status || null];
  const res = await query(text, values);
  return res.rows[0];
}

/**
 * Get receipt by id.
 * @param {number} receipt_id
 * @returns {Promise<object|null>}
 */
export async function getReceiptById(receipt_id) {
  const text = `SELECT * FROM Receipt WHERE receipt_id = $1`;
  const res = await query(text, [receipt_id]);
  return res.rows[0] || null;
}

/**
 * Get receipts for a user.
 * @param {number} user_id
 * @returns {Promise<Array>} array of receipts
 */
export async function getReceiptsByUserId(user_id) {
  const text = `SELECT * FROM Receipt WHERE user_id = $1 ORDER BY upload_date DESC`;
  const res = await query(text, [user_id]);
  return res.rows;
}

/**
 * Get receipts by status.
 * @param {string} status
 * @returns {Promise<Array>} array of receipts
 */
export async function getReceiptsByStatus(status) {
  const text = `SELECT * FROM Receipt WHERE status = $1 ORDER BY upload_date DESC`;
  const res = await query(text, [status]);
  return res.rows;
}

/**
 * Get all receipts.
 * @returns {Promise<Array>} array of receipts
 */
export async function getAllReceipts() {
  const text = `SELECT * FROM Receipt ORDER BY upload_date DESC`;
  const res = await query(text);
  return res.rows;
}

/**
 * Update a receipt by id. Only provided fields will be updated.
 */
export async function updateReceiptById(receipt_id, updates) {
  const allowed = ['user_id', 'file_path', 'status', 'upload_date'];
  const set = [];
  const values = [];
  let idx = 1;
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(updates, key)) {
      set.push(`${key} = $${idx++}`);
      values.push(updates[key]);
    }
  }
  if (set.length === 0) return getReceiptById(receipt_id);

  const text = `UPDATE Receipt SET ${set.join(', ')} WHERE receipt_id = $${idx} RETURNING *`;
  values.push(receipt_id);
  const res = await query(text, values);
  return res.rows[0] || null;
}

/**
 * Delete a receipt by id.
 * @param {number} receipt_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteReceiptById(receipt_id) {
  const text = `DELETE FROM Receipt WHERE receipt_id = $1`;
  const res = await query(text, [receipt_id]);
  return res.rowCount > 0;
}

export default {
  createReceipt,
  getReceiptById,
  getReceiptsByUserId,
  getReceiptsByStatus,
  getAllReceipts,
  updateReceiptById,
  deleteReceiptById,
};
