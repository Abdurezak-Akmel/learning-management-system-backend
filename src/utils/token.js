import crypto from 'crypto';

/**
 * Generate a secure verification token and expiry timestamp.
 * @param {number} hoursValid - How many hours the token should be valid for (default 24).
 * @returns {{token:string, expiry:Date}}
 */
export function generateVerificationToken(hoursValid = 1) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + hoursValid * 60 * 60 * 1000);
  return { token, expiry };
}

/**
 * Check if a token expiry date is in the past.
 * @param {Date|string|number} expiryDate
 * @returns {boolean}
 */
export function isTokenExpired(expiryDate) {
  return new Date() > new Date(expiryDate);
}

export default { generateVerificationToken, isTokenExpired };
