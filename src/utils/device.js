/**
 * Device detection utilities for device-based authentication
 */

/**
 * Extract specific device model information from User-Agent string
 * @param {string} userAgent - User-Agent header string
 * @returns {string} Specific device model identifier
 */
export function extractDeviceInfo(userAgent) {
  if (!userAgent) return 'Unknown Device';
  
  // Extract device-specific identifiers for better security
  let deviceModel = '';
  
  // iPhone models
  if (userAgent.includes('iPhone')) {
    const iphoneMatch = userAgent.match(/iPhone(.*?)[);]/);
    if (iphoneMatch) {
      const model = iphoneMatch[1].trim();
      deviceModel = `iPhone${model}`;
    } else {
      deviceModel = 'iPhone';
    }
  }
  // iPad models
  else if (userAgent.includes('iPad')) {
    const ipadMatch = userAgent.match(/iPad(.*?)[);]/);
    if (ipadMatch) {
      const model = ipadMatch[1].trim();
      deviceModel = `iPad${model}`;
    } else {
      deviceModel = 'iPad';
    }
  }
  // Android devices - extract manufacturer and model
  else if (userAgent.includes('Android')) {
    // Try to extract manufacturer and model
    const androidMatch = userAgent.match(/; ([^)]+)\)/);
    if (androidMatch) {
      const deviceInfo = androidMatch[1].trim();
      deviceModel = `Android ${deviceInfo}`;
    } else {
      // Fallback to generic Android detection
      deviceModel = 'Android Device';
    }
  }
  // Windows devices - try to detect specific hardware
  else if (userAgent.includes('Windows')) {
    const windowsMatch = userAgent.match(/Windows NT ([0-9.]+)/);
    if (windowsMatch) {
      deviceModel = `Windows ${windowsMatch[1]}`;
    } else {
      deviceModel = 'Windows';
    }
  }
  // macOS devices
  else if (userAgent.includes('Macintosh')) {
    const macMatch = userAgent.match(/Mac OS X ([0-9_]+)/);
    if (macMatch) {
      const version = macMatch[1].replace(/_/g, '.');
      deviceModel = `macOS ${version}`;
    } else {
      deviceModel = 'macOS';
    }
  }
  // Linux devices
  else if (userAgent.includes('Linux')) {
    deviceModel = 'Linux';
  }
  // Default fallback
  else {
    // Extract any identifiable information from user agent
    const fallbackMatch = userAgent.match(/([^\/\s]+)[\/\s]/);
    if (fallbackMatch) {
      deviceModel = fallbackMatch[1];
    } else {
      deviceModel = 'Unknown Device';
    }
  }
  
  // Add a unique identifier from the user agent for additional security
  const uniqueIdentifier = generateDeviceFingerprint(userAgent);
  
  return `${deviceModel} [${uniqueIdentifier}]`;
}

/**
 * Generate a device fingerprint from User-Agent for additional security
 * @param {string} userAgent - User-Agent header string
 * @returns {string} Device fingerprint hash
 */
function generateDeviceFingerprint(userAgent) {
  // Extract key characteristics that make this device unique
  const characteristics = [];
  
  // Browser engine
  if (userAgent.includes('WebKit')) characteristics.push('WebKit');
  if (userAgent.includes('Gecko')) characteristics.push('Gecko');
  if (userAgent.includes('Presto')) characteristics.push('Presto');
  if (userAgent.includes('Trident')) characteristics.push('Trident');
  
  // Platform architecture
  if (userAgent.includes('WOW64') || userAgent.includes('Win64')) characteristics.push('x64');
  if (userAgent.includes('i686') || userAgent.includes('x86')) characteristics.push('x86');
  if (userAgent.includes('ARM')) characteristics.push('ARM');
  
  // Mobile indicators
  if (userAgent.includes('Mobile')) characteristics.push('Mobile');
  if (userAgent.includes('Tablet')) characteristics.push('Tablet');
  
  // Create a simple hash from characteristics
  const fingerprint = characteristics.join('-') + userAgent.length;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16).substring(0, 8);
}

/**
 * Compare two device strings for exact match (strict comparison for security)
 * @param {string} device1 - First device string
 * @param {string} device2 - Second device string
 * @returns {boolean} True if devices match exactly
 */
export function isSameDevice(device1, device2) {
  if (!device1 || !device2) return false;
  
  // For security, require exact match including fingerprint
  return device1.trim() === device2.trim();
}

/**
 * Extract basic device type for display purposes
 * @param {string} userAgent - User-Agent header string
 * @returns {string} Device type (mobile, tablet, desktop)
 */
export function getDeviceType(userAgent) {
  if (!userAgent) return 'unknown';
  
  if (userAgent.includes('Mobile') && !userAgent.includes('iPad')) {
    return 'mobile';
  } else if (userAgent.includes('iPad') || userAgent.includes('Tablet')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

export default {
  extractDeviceInfo,
  isSameDevice,
  getDeviceType
};
