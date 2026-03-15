import { query } from '../config/db.js';

/**
 * Assign a course to a role.
 * @param {{role_id: number, course_id: number}} assignment
 * @returns {Promise<object>} inserted assignment row
 */
export async function assignCourseToRole(assignment) {
	const text = `INSERT INTO role_course (role_id, course_id) VALUES ($1, $2) RETURNING *`;
	const values = [assignment.role_id, assignment.course_id];
	const res = await query(text, values);
	return res.rows[0];
}

/**
 * Remove a course from a role.
 * @param {number} role_id
 * @param {number} course_id
 * @returns {Promise<boolean>} true if deleted
 */
export async function removeCourseFromRole(role_id, course_id) {
	const text = `DELETE FROM role_course WHERE role_id = $1 AND course_id = $2`;
	const res = await query(text, [role_id, course_id]);
	return res.rowCount > 0;
}

/**
 * Get all courses assigned to a specific role.
 * @param {number} role_id
 * @returns {Promise<Array>} array of course objects
 */
export async function getCoursesByRoleId(role_id) {
	const text = `
		SELECT c.* 
		FROM Course c 
		INNER JOIN role_course rc ON c.course_id = rc.course_id 
		WHERE rc.role_id = $1 
		ORDER BY c.title
	`;
	const res = await query(text, [role_id]);
	return res.rows;
}

/**
 * Get all roles assigned to a specific course.
 * @param {number} course_id
 * @returns {Promise<Array>} array of role objects
 */
export async function getRolesByCourseId(course_id) {
	const text = `
		SELECT r.* 
		FROM Role r 
		INNER JOIN role_course rc ON r.role_id = rc.role_id 
		WHERE rc.course_id = $1 
		ORDER BY r.role_name
	`;
	const res = await query(text, [course_id]);
	return res.rows;
}

/**
 * Get all role-course assignments.
 * @returns {Promise<Array>} array of assignment objects with role and course details
 */
export async function getAllRoleCourseAssignments() {
	const text = `
		SELECT 
			rc.role_id,
			rc.course_id,
			rc.assigned_at,
			r.role_name,
			c.title as course_title,
			c.category as course_category
		FROM role_course rc
		INNER JOIN Role r ON rc.role_id = r.role_id
		INNER JOIN Course c ON rc.course_id = c.course_id
		ORDER BY r.role_name, c.title
	`;
	const res = await query(text);
	return res.rows;
}

/**
 * Check if a role has access to a specific course.
 * @param {number} role_id
 * @param {number} course_id
 * @returns {Promise<boolean>} true if assignment exists
 */
export async function checkRoleCourseAccess(role_id, course_id) {
	const text = `SELECT 1 FROM role_course WHERE role_id = $1 AND course_id = $2`;
	const res = await query(text, [role_id, course_id]);
	return res.rows.length > 0;
}

/**
 * Assign multiple courses to a role in a single transaction.
 * @param {number} role_id
 * @param {number[]} course_ids
 * @returns {Promise<Array>} array of assignment objects
 */
export async function assignMultipleCoursesToRole(role_id, course_ids) {
	const assignments = [];
	for (const course_id of course_ids) {
		try {
			const assignment = await assignCourseToRole({ role_id, course_id });
			assignments.push(assignment);
		} catch (err) {
			// Skip duplicates and continue
			if (!err.message.includes('duplicate key')) {
				throw err;
			}
		}
	}
	return assignments;
}

/**
 * Remove multiple courses from a role.
 * @param {number} role_id
 * @param {number[]} course_ids
 * @returns {Promise<number>} number of assignments removed
 */
export async function removeMultipleCoursesFromRole(role_id, course_ids) {
	const placeholders = course_ids.map((_, index) => `$${index + 2}`).join(',');
	const text = `DELETE FROM role_course WHERE role_id = $1 AND course_id IN (${placeholders})`;
	const values = [role_id, ...course_ids];
	const res = await query(text, values);
	return res.rowCount;
}

export default {
	assignCourseToRole,
	removeCourseFromRole,
	getCoursesByRoleId,
	getRolesByCourseId,
	getAllRoleCourseAssignments,
	checkRoleCourseAccess,
	assignMultipleCoursesToRole,
	removeMultipleCoursesFromRole,
};