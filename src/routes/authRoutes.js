//Auth Routes

import express from 'express';
import { register, verifyEmail, forgetPassword, validateResetToken, resetPassword, login, logout, refreshToken, changePassword, getCurrentUser, updateProfile } from '../controllers/authControllers.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Registration and verification endpoints
// POST /register - Register a new user account
router.post('/register', register);

// POST /verify-email - Verify user email with token
router.post('/verify-email', verifyEmail);

// Password reset endpoints
// POST /forgot-password - Request password reset email
router.post('/forgot-password', forgetPassword);

// POST /validate-reset-token - Validate password reset token
router.post('/validate-reset-token', validateResetToken);

// POST /reset-password - Reset password with valid token
router.post('/reset-password', resetPassword);

// Login/logout endpoints
// POST /login - Authenticate user and return JWT token
router.post('/login', login);

// POST /logout - Logout user (requires authentication)
router.post('/logout', authenticate, logout);

// Token management
// POST /refresh-token - Refresh JWT access token
router.post('/refresh-token', refreshToken);

// Profile management (requires authentication)
// GET /profile - Get current user profile (requires authentication)
router.get('/profile', authenticate, getCurrentUser);

// PUT /profile - Update user profile information (requires authentication)
router.put('/profile', authenticate, updateProfile);

// PUT /change-password - Change user password (requires authentication)
router.put('/change-password', authenticate, changePassword);

export default router;
