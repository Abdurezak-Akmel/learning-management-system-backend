import bcrypt from 'bcrypt';
import { createUser, getUserByEmail, getUserByVerificationToken, updateUserById } from '../models/userModel.js';
import { getAllRoles } from '../models/roleModel.js';
import { createToken, getValidTokenByResetToken, markTokenUsed, deleteTokensByUserId } from '../models/prtModel.js';
import { generateVerificationToken, isTokenExpired } from '../utils/token.js';
import { sendVerificationEmail, sendEmail } from '../utils/email.js';
import { generateToken, verifyToken } from '../utils/jwt.js';
import { extractDeviceInfo } from '../utils/device.js';

/**
 * Register a new user.
 * Flow:
 * - Validate input
 * - Check if email exists
 * - Hash password (bcrypt)
 * - Insert user into DB
 * - Return success response
 */
export async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Extract device information from request headers
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const registration_device = extractDeviceInfo(userAgent);

    // Check if email already exists
    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Generate verification token and expiry
    const { token: verification_token, expiry: verification_token_expiry } = generateVerificationToken(24);

    // Insert user with verification fields
    const newUser = await createUser({
      name,
      email,
      password_hash,
      email_verified: false,
      verification_token,
      verification_token_expiry,
      registration_device,
    });

    // Send verification email (don't fail registration if email fails)
    try {
      await sendVerificationEmail(email, verification_token);
    } catch (mailErr) {
      // eslint-disable-next-line no-console
      console.error('Failed to send verification email:', mailErr);
    }

    // Return success (omit password_hash and verification token)
    const { password_hash: _ph, verification_token: _vt, verification_token_expiry: _ve, ...userSafe } = newUser;
    return res.status(201).json({ success: true, message: 'Registration successful. Check your email to verify account.', user: userSafe });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Verify email using token passed as query param or in body.
 * - Finds user by verification token
 * - Enforces token expiry
 * - Sets `email_verified = true`, clears token fields, and assigns `role_id = 1` if none
 */
export async function verifyEmail(req, res) {
  try {
    const token = (req.query && req.query.token) || (req.body && req.body.token);
    if (!token) return res.status(400).json({ success: false, message: 'Verification token required' });

    const user = await getUserByVerificationToken(token);
    if (!user) return res.status(404).json({ success: false, message: 'Invalid verification token' });

    if (user.verification_token_expiry && isTokenExpired(user.verification_token_expiry)) {
      return res.status(400).json({ success: false, message: 'Verification token has expired' });
    }

    const updates = {
      email_verified: true,
      verification_token: null,
      verification_token_expiry: null,
      status: 'active',
    };

    // Assign the first role_id from Role table if the user has none
    try {
      const roles = await getAllRoles();
      if (roles && roles.length) {
        const firstRoleId = roles[0].role_id;
        if (!user.role_id) updates.role_id = firstRoleId;
      }
    } catch (roleErr) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch roles for assignment:', roleErr);
    }

    const updated = await updateUserById(user.user_id, updates);
    const { password_hash, ...userSafe } = updated || {};
    return res.json({ success: true, message: 'Email verified successfully. Now you can log in to your account.', user: userSafe });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('verifyEmail error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Initiate password reset: generate token, store it, email the user.
 */
export async function forgetPassword(req, res) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await getUserByEmail(email);

    // Always return a generic response to avoid account enumeration
    const genericResponse = { success: true, message: 'If that email exists, a reset token has been sent.' };
    if (!user) return res.json(genericResponse);

    // Create reset token (2 hours validity)
    const { token, expiry } = generateVerificationToken(1);
    await createToken({ user_id: user.user_id, reset_token: token, expires_at: expiry, used: false });

    // Send reset token by email (don't fail request if mail fails)
    try {
      const subject = 'Password reset request';
      const text = `Use this token to reset your password: ${token}`;
      await sendEmail({ to: email, subject, text });
    } catch (mailErr) {
      // eslint-disable-next-line no-console
      console.error('Failed to send password reset email:', mailErr);
    }

    return res.json(genericResponse);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('forgetPassword error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Validate a reset token submitted by the user (frontend will redirect to new-password page).
 */
export async function validateResetToken(req, res) {
  try {
    const token = (req.query && req.query.token) || (req.body && req.body.token);
    if (!token) return res.status(400).json({ success: false, message: 'Reset token required' });

    const record = await getValidTokenByResetToken(token);
    if (!record) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    return res.json({ success: true, message: 'Token valid' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('validateResetToken error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Reset password using a valid token and new password provided by the user.
 */
export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body || {};
    if (!token || !newPassword) return res.status(400).json({ success: false, message: 'Token and new password are required' });
    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const record = await getValidTokenByResetToken(token);
    if (!record) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    await updateUserById(record.user_id, { password_hash });

    // Mark token used and remove other tokens for this user
    try {
      await markTokenUsed(record.id);
      await deleteTokensByUserId(record.user_id);
    } catch (cleanupErr) {
      // eslint-disable-next-line no-console
      console.error('Failed to clean up reset tokens:', cleanupErr);
    }

    return res.json({ success: true, message: 'Password has been updated' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('resetPassword error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Log in a user and return a JWT.
 * Device-based authentication: Non-admin users can only login from their registered device.
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    if (user.email_verified === false) {
      return res.status(403).json({ success: false, message: 'Email not verified' });
    }

    // Device-based authentication for non-admin users
    if (user.role_id !== 1) { // Assuming role_id 1 is admin
      const currentDevice = extractDeviceInfo(req.headers['user-agent'] || 'Unknown Device');
      
      if (user.registration_device && user.registration_device !== currentDevice) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied. You can only login from your registered device for security reasons.' 
        });
      }
    }

    const payload = { user_id: user.user_id, role_id: user.role_id };
    const token = generateToken(payload, '2h');

    const { password_hash, verification_token, verification_token_expiry, ...userSafe } = user || {};
    return res.json({ success: true, token, user: userSafe });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

/**
 * Logout endpoint. With stateless JWTs the server cannot fully revoke tokens
 * without a token store; this endpoint returns success and lets the client
 * remove the token. If a token is provided it is optionally verified.
 */
export async function logout(req, res) {
  try {
    const auth = req.headers && req.headers.authorization;
    const token = auth && auth.startsWith('Bearer ') ? auth.split(' ')[1] : null;

    if (token) {
      try {
        // verify token to provide more accurate feedback (not required)
        verifyToken(token);
      } catch (verErr) {
        // token invalid or expired — still return success so client clears it
      }
    }

    return res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('logout error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export default { register, verifyEmail, forgetPassword, validateResetToken, resetPassword, login, logout };
