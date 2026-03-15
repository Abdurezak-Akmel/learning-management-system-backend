/**
 * Device detection utilities
 */

/**
 * Extract device information from User-Agent string
 * @param {string} userAgent - User-Agent header string
 * @returns {string} Simplified device description
 */
export function extractDeviceInfo(userAgent) {
  if (!userAgent) return 'Unknown Device';
  
  // Detect common browsers and platforms
  let deviceInfo = userAgent;
  
  // Extract browser name
  if (userAgent.includes('Chrome')) {
    deviceInfo = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    deviceInfo = 'Firefox';
  } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
    deviceInfo = 'Safari';
  } else if (userAgent.includes('Edge')) {
    deviceInfo = 'Edge';
  } else if (userAgent.includes('Opera')) {
    deviceInfo = 'Opera';
  }
  
  // Detect operating system
  if (userAgent.includes('Windows')) {
    deviceInfo += ' on Windows';
  } else if (userAgent.includes('Mac')) {
    deviceInfo += ' on macOS';
  } else if (userAgent.includes('Linux')) {
    deviceInfo += ' on Linux';
  } else if (userAgent.includes('Android')) {
    deviceInfo = 'Android ' + deviceInfo;
  } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    deviceInfo = userAgent.includes('iPhone') ? 'iPhone ' + deviceInfo : 'iPad ' + deviceInfo;
  }
  
  return deviceInfo;
}

/**
 * Compare two device strings for similarity
 * @param {string} device1 - First device string
 * @param {string} device2 - Second device string
 * @returns {boolean} True if devices match closely
 */
export function isSameDevice(device1, device2) {
  if (!device1 || !device2) return false;
  
  // Normalize device strings for comparison
  const normalize = (device) => {
    return device.toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[0-9.]/g, '') // Remove version numbers
      .trim();
  };
  
  return normalize(device1) === normalize(device2);
}

export default {
  extractDeviceInfo,
  isSameDevice
};
