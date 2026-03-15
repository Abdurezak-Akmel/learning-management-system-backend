import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import {
	assignCourseToRoleController,
	removeCourseFromRoleController,
	getCoursesByRoleIdController,
	getRolesByCourseIdController,
	getAllRoleCourseAssignmentsController,
	assignMultipleCoursesToRoleController,
	removeMultipleCoursesFromRoleController
} from '../controllers/roleCourseControllers.js';

const router = express.Router();

// Admin: assign a single course to a role
router.post('/assign-course', authenticate, requireAdmin, assignCourseToRoleController);

// Admin: remove a single course from a role
router.delete('/remove-course', authenticate, requireAdmin, removeCourseFromRoleController);

// Admin: assign multiple courses to a role
router.post('/assign-multiple-courses', authenticate, requireAdmin, assignMultipleCoursesToRoleController);

// Admin: remove multiple courses from a role
router.delete('/remove-multiple-courses', authenticate, requireAdmin, removeMultipleCoursesFromRoleController);

// Admin: get all role-course assignments
router.get('/get-all-assignments', authenticate, requireAdmin, getAllRoleCourseAssignmentsController);

// Admin: get all courses assigned to a specific role
router.get('/role/:role_id/courses', authenticate, requireAdmin, getCoursesByRoleIdController);

// Admin: get all roles assigned to a specific course
router.get('/course/:course_id/roles', authenticate, requireAdmin, getRolesByCourseIdController);

export default router;