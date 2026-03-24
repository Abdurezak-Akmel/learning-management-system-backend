import { query } from '../config/db.js';

/**
 * Create a new course.
 * @param {{title:string,description?:string,category?:string,level?:string}} course
 * @returns {Promise<object>} inserted course row
 */
export async function createCourse(course) {
	const text = `INSERT INTO Course (title, description, category, level) VALUES ($1,$2,$3,$4) RETURNING *`;
	const values = [course.title, course.description || null, course.category || null, course.level || null];
	const res = await query(text, values);
	return res.rows[0];
}

/**
 * Get a course by id.
 * @param {number} course_id
 * @returns {Promise<object|null>}
 */
export async function getCourseById(course_id) {
	const text = `SELECT * FROM Course WHERE course_id = $1`;
	const res = await query(text, [course_id]);
	return res.rows[0] || null;
}

/**
 * Get courses by exact title.
 * @param {string} title
 * @returns {Promise<Array>} array of courses
 */
export async function getCoursesByTitle(title) {
	const text = `SELECT * FROM Course WHERE title = $1 ORDER BY course_id`;
	const res = await query(text, [title]);
	return res.rows;
}

/**
 * Get courses by category.
 * @param {string} category
 * @returns {Promise<Array>} array of courses
 */
export async function getCoursesByCategory(category) {
	const text = `SELECT * FROM Course WHERE category = $1 ORDER BY course_id`;
	const res = await query(text, [category]);
	return res.rows;
}

/**
 * Get courses by level.
 * @param {string} level
 * @returns {Promise<Array>} array of courses
 */
export async function getCoursesByLevel(level) {
	const text = `SELECT * FROM Course WHERE level = $1 ORDER BY course_id`;
	const res = await query(text, [level]);
	return res.rows;
}

/**
 * Get courses created by a specific user.
 * @param {number} user_id
 * @returns {Promise<Array>} array of courses
 */
export async function getCoursesByCreator(user_id) {
	const text = `SELECT * FROM Course WHERE created_by = $1 ORDER BY course_id`;
	const res = await query(text, [user_id]);
	return res.rows;
}

/**
 * Get all courses.
 * @returns {Promise<Array>} array of courses
 */
export async function getAllCourses() {
	const text = `SELECT * FROM Course ORDER BY course_id`;
	const res = await query(text);
	return res.rows;
}

/**
 * Update a course by id. Only fields present in `updates` are changed.
 * @param {number} course_id
 * @param {object} updates
 * @returns {Promise<object|null>} updated row or null
 */
export async function updateCourseById(course_id, updates) {
	const set = [];
	const values = [];
	let idx = 1;
	const allowed = ['title', 'description', 'category', 'level', 'created_by'];
	for (const key of allowed) {
		if (Object.prototype.hasOwnProperty.call(updates, key)) {
			set.push(`${key} = $${idx++}`);
			values.push(updates[key]);
		}
	}

	if (set.length === 0) return getCourseById(course_id);

	const text = `UPDATE Course SET ${set.join(', ')} WHERE course_id = $${idx} RETURNING *`;
	values.push(course_id);
	const res = await query(text, values);
	return res.rows[0] || null;
}

/**
 * Delete a course by id.
 * @param {number} course_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function deleteCourseById(course_id) {
	const text = `DELETE FROM Course WHERE course_id = $1`;
	const res = await query(text, [course_id]);
	return res.rowCount > 0;
}

export default {
	createCourse,
	getCourseById,
	getCoursesByTitle,
	getCoursesByCategory,
	getCoursesByLevel,
	getCoursesByCreator,
	getAllCourses,
	updateCourseById,
	deleteCourseById,
};

