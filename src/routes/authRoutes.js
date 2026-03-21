//Auth Routes

import express from 'express';
import { register, verifyEmail, forgetPassword, validateResetToken, resetPassword, login, logout, refreshToken, changePassword, getCurrentUser, updateProfile } from '../controllers/authControllers.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

//Register a new user account
router.post('/register', register);
//Tested and working

//Verify user email with token
router.post('/verify-email', verifyEmail);
//Tested and working

//Request password reset email
router.post('/forget-password', forgetPassword);
//Tested and working

//Validate password reset token
router.post('/validate-reset-token', validateResetToken);
//Tested and working

//Reset password with valid token
router.post('/reset-password', resetPassword);
//Tested and working

//Authenticate user and return JWT token
router.post('/login', login);
//Tested and working

//Logout user (requires authentication)
router.post('/logout', authenticate, logout);
//Tested and working

//Refresh JWT access token
router.post('/refresh-token', refreshToken);

//Get current user profile (requires authentication)
router.get('/profile', authenticate, getCurrentUser);

//Update user profile information (requires authentication)
router.put('/profile', authenticate, updateProfile);

//Change user password (requires authentication)
router.put('/change-password', authenticate, changePassword);
//Tested and working

export default router;
