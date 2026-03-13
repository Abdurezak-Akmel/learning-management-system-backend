//Auth Routes

import express from 'express';
import { register, verifyEmail, forgetPassword, validateResetToken, resetPassword, login, logout } from '../controllers/authControllers.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Registration and verification endpoints
router.post('/register', register);
router.post('/verify-email', verifyEmail);

// Password reset endpoints
router.post('/forgot-password', forgetPassword);
router.post('/validate-reset-token', validateResetToken);
router.post('/reset-password', resetPassword);

// Login/logout endpoints
router.post('/login', login);
router.post('/logout', authenticate, logout);

export default router;
