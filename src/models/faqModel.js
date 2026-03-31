import { query } from '../config/db.js';

/**
 * Create a new FAQ.
 * @param {{question:string, answer:string}} faq
 * @returns {Promise<object>} inserted faq row
 */
export async function createFAQ(faq) {
    const text = `INSERT INTO faqs (question, answer) VALUES ($1, $2) RETURNING *`;
    const values = [faq.question, faq.answer];
    const res = await query(text, values);
    return res.rows[0];
}

/**
 * Get an FAQ by id.
 * @param {number} faqs_id
 * @returns {Promise<object|null>}
 */
export async function getFAQById(faqs_id) {
    const text = `SELECT * FROM faqs WHERE faqs_id = $1`;
    const res = await query(text, [faqs_id]);
    return res.rows[0] || null;
}

/**
 * Get all FAQs.
 * @returns {Promise<Array>} array of faqs
 */
export async function getAllFAQs() {
    const text = `SELECT * FROM faqs ORDER BY faqs_id`;
    const res = await query(text);
    return res.rows;
}

/**
 * Update an FAQ by id. Only fields present in `updates` are changed.
 * @param {number} faqs_id
 * @param {object} updates
 * @returns {Promise<object|null>} updated row or null
 */
export async function updateFAQById(faqs_id, updates) {
    const set = [];
    const values = [];
    let idx = 1;
    const allowed = ['question', 'answer'];

    for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(updates, key)) {
            set.push(`${key} = $${idx++}`);
            values.push(updates[key]);
        }
    }

    if (set.length === 0) return getFAQById(faqs_id);

    const text = `UPDATE faqs SET ${set.join(', ')} WHERE faqs_id = $${idx} RETURNING *`;
    values.push(faqs_id);
    const res = await query(text, values);
    return res.rows[0] || null;
}

/**
 * Delete an FAQ by id.
 * @param {number} faqs_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteFAQById(faqs_id) {
    const text = `DELETE FROM faqs WHERE faqs_id = $1`;
    const res = await query(text, [faqs_id]);
    return res.rowCount > 0;
}

export default {
    createFAQ,
    getFAQById,
    getAllFAQs,
    updateFAQById,
    deleteFAQById,
};
