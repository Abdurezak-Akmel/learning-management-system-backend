/**
 * Generates a stable device identifier by normalizing the User-Agent.
 * Removes volatile version numbers to prevent lockouts after browser updates.
 */
export function generateDevice(userAgent) {
  if (!userAgent) return 'Unknown Device';

  // 1. Identify the OS
  let os = "Unknown OS";
  if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Macintosh")) os = "MacOS";
  else if (userAgent.includes("Linux")) os = "Linux";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";

  // 2. Identify the Browser (Order matters for Chromium-based browsers)
  let browser = "Unknown Browser";
  if (userAgent.includes("Edg/")) browser = "Edge";
  else if (userAgent.includes("Chrome/")) browser = "Chrome";
  else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome")) browser = "Safari";
  else if (userAgent.includes("Firefox/")) browser = "Firefox";

  // 3. Create a stable identity string
  const stableId = `${os}-${browser}`;

  // Optional: Return a hash for privacy and consistent storage length
  // return crypto.createHash('sha256').update(stableId).digest('hex');

  return stableId;
}

/**
 * Verification remains the same, but now it compares stable identifiers.
 */
export function verifyDevice(currentDevice, storedDevice) {
  if (!storedDevice) return true;

  // Clean both strings just in case
  return currentDevice.trim() === storedDevice.trim();
}