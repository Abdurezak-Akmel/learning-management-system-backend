/**
 * Generates a device identifier from User-Agent string.
 * This is currently a simple pass-through but can be enhanced to normalize or hash the UA.
 * @param {string} userAgent - The User-Agent header from the request.
 * @returns {string} The device identifier.
 */
export function generateDevice(userAgent) {
  return userAgent || 'Unknown Device';
}



/**
 * Verifies if the current login device matches the one used during registration.
 * @param {string} currentDevice - The device identifier from the current request.
 * @param {string} storedDevice - The device identifier stored in the user record.
 * @returns {boolean} True if they match, false otherwise.
 */
export function verifyDevice(currentDevice, storedDevice) {
  if (!storedDevice) return true; // If no device was stored at registration (legacy or admin), allow.
  return currentDevice === storedDevice;
}
