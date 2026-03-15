import {
	assignCourseToRole,
	removeCourseFromRole,
	getCoursesByRoleId,
	getRolesByCourseId,
	getAllRoleCourseAssignments,
	checkRoleCourseAccess,
	assignMultipleCoursesToRole,
	removeMultipleCoursesFromRole
} from '../models/roleCourseModel.js';

/**
 * Admin controller: assign a course to a role
 */
export async function assignCourseToRoleController(req, res) {
	try {
		const { role_id, course_id } = req.body || {};

		if (!role_id || !course_id) {
			return res.status(400).json({
				success: false,
				message: 'role_id and course_id are required'
			});
		}

		// Validate role_id and course_id are numbers
		if (!Number.isInteger(Number(role_id)) || !Number.isInteger(Number(course_id))) {
			return res.status(400).json({
				success: false,
				message: 'role_id and course_id must be valid integers'
			});
		}

		// Check if assignment already exists
		const existingAssignment = await checkRoleCourseAccess(Number(role_id), Number(course_id));
		if (existingAssignment) {
			return res.status(409).json({
				success: false,
				message: 'Course is already assigned to this role'
			});
		}

		const assignment = await assignCourseToRole({
			role_id: Number(role_id),
			course_id: Number(course_id)
		});

		return res.status(201).json({
			success: true,
			message: 'Course assigned to role successfully',
			assignment
		});
	} catch (err) {
		console.error('assignCourseToRoleController error:', err);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: err.message
		});
	}
}

/**
 * Admin controller: remove a course from a role
 */
export async function removeCourseFromRoleController(req, res) {
	try {
		const { role_id, course_id } = req.body || {};

		if (!role_id || !course_id) {
			return res.status(400).json({
				success: false,
				message: 'role_id and course_id are required'
			});
		}

		// Validate role_id and course_id are numbers
		if (!Number.isInteger(Number(role_id)) || !Number.isInteger(Number(course_id))) {
			return res.status(400).json({
				success: false,
				message: 'role_id and course_id must be valid integers'
			});
		}

		const removed = await removeCourseFromRole(Number(role_id), Number(course_id));
		if (!removed) {
			return res.status(404).json({
				success: false,
				message: 'Assignment not found'
			});
		}

		return res.json({
			success: true,
			message: 'Course removed from role successfully'
		});
	} catch (err) {
		console.error('removeCourseFromRoleController error:', err);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: err.message
		});
	}
}

/**
 * Admin controller: get all courses assigned to a role
 */
export async function getCoursesByRoleIdController(req, res) {
	try {
		const role_id = req.params.role_id;

		if (!role_id) {
			return res.status(400).json({
				success: false,
				message: 'role_id is required'
			});
		}

		if (!Number.isInteger(Number(role_id))) {
			return res.status(400).json({
				success: false,
				message: 'role_id must be a valid integer'
			});
		}

		const courses = await getCoursesByRoleId(Number(role_id));

		return res.json({
			success: true,
			courses
		});
	} catch (err) {
		console.error('getCoursesByRoleIdController error:', err);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: err.message
		});
	}
}

/**
 * Admin controller: get all roles assigned to a course
 */
export async function getRolesByCourseIdController(req, res) {
	try {
		const course_id = req.params.course_id;

		if (!course_id) {
			return res.status(400).json({
				success: false,
				message: 'course_id is required'
			});
		}

		if (!Number.isInteger(Number(course_id))) {
			return res.status(400).json({
				success: false,
				message: 'course_id must be a valid integer'
			});
		}

		const roles = await getRolesByCourseId(Number(course_id));

		return res.json({
			success: true,
			roles
		});
	} catch (err) {
		console.error('getRolesByCourseIdController error:', err);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: err.message
		});
	}
}

/**
 * Admin controller: get all role-course assignments
 */
export async function getAllRoleCourseAssignmentsController(req, res) {
	try {
		const assignments = await getAllRoleCourseAssignments();

		return res.json({
			success: true,
			assignments
		});
	} catch (err) {
		console.error('getAllRoleCourseAssignmentsController error:', err);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: err.message
		});
	}
}

/**
 * Admin controller: assign multiple courses to a role
 */
export async function assignMultipleCoursesToRoleController(req, res) {
	try {
		const { role_id, course_ids } = req.body || {};

		if (!role_id || !course_ids) {
			return res.status(400).json({
				success: false,
				message: 'role_id and course_ids are required'
			});
		}

		if (!Number.isInteger(Number(role_id))) {
			return res.status(400).json({
				success: false,
				message: 'role_id must be a valid integer'
			});
		}

		if (!Array.isArray(course_ids) || course_ids.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'course_ids must be a non-empty array'
			});
		}

		// Validate all course_ids are numbers
		const invalidIds = course_ids.filter(id => !Number.isInteger(Number(id)));
		if (invalidIds.length > 0) {
			return res.status(400).json({
				success: false,
				message: 'All course_ids must be valid integers'
			});
		}

		const assignments = await assignMultipleCoursesToRole(
			Number(role_id),
			course_ids.map(id => Number(id))
		);

		return res.status(201).json({
			success: true,
			message: `${assignments.length} courses assigned to role successfully`,
			assignments
		});
	} catch (err) {
		console.error('assignMultipleCoursesToRoleController error:', err);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: err.message
		});
	}
}

/**
 * Admin controller: remove multiple courses from a role
 */
export async function removeMultipleCoursesFromRoleController(req, res) {
	try {
		const { role_id, course_ids } = req.body || {};

		if (!role_id || !course_ids) {
			return res.status(400).json({
				success: false,
				message: 'role_id and course_ids are required'
			});
		}

		if (!Number.isInteger(Number(role_id))) {
			return res.status(400).json({
				success: false,
				message: 'role_id must be a valid integer'
			});
		}

		if (!Array.isArray(course_ids) || course_ids.length === 0) {
			return res.status(400).json({
				success: false,
				message: 'course_ids must be a non-empty array'
			});
		}

		// Validate all course_ids are numbers
		const invalidIds = course_ids.filter(id => !Number.isInteger(Number(id)));
		if (invalidIds.length > 0) {
			return res.status(400).json({
				success: false,
				message: 'All course_ids must be valid integers'
			});
		}

		const removedCount = await removeMultipleCoursesFromRole(
			Number(role_id),
			course_ids.map(id => Number(id))
		);

		return res.json({
			success: true,
			message: `${removedCount} courses removed from role successfully`,
			removed_count: removedCount
		});
	} catch (err) {
		console.error('removeMultipleCoursesFromRoleController error:', err);
		return res.status(500).json({
			success: false,
			message: 'Internal server error',
			error: err.message
		});
	}
}

export default {
	assignCourseToRoleController,
	removeCourseFromRoleController,
	getCoursesByRoleIdController,
	getRolesByCourseIdController,
	getAllRoleCourseAssignmentsController,
	assignMultipleCoursesToRoleController,
	removeMultipleCoursesFromRoleController
};