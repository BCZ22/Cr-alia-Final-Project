/**
 * Input Sanitizer
 * Clean and validate user inputs
 */

/**
 * Sanitize text input (remove dangerous characters/scripts)
 */
export function sanitizeText(input: string, maxLength = 2000): string {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string')
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, '')

  // Remove potential XSS patterns
  sanitized = sanitized
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')

  // Trim whitespace
  sanitized = sanitized.trim()

  // Enforce max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }

  return sanitized
}

/**
 * Sanitize message for chat (less aggressive, preserve formatting)
 */
export function sanitizeChatMessage(message: string): string {
  if (typeof message !== 'string') {
    throw new Error('Message must be a string')
  }

  // Remove null bytes
  let sanitized = message.replace(/\0/g, '')

  // Remove only the most dangerous patterns (preserve newlines, emojis, etc.)
  sanitized = sanitized
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')

  // Trim but preserve internal whitespace/newlines
  sanitized = sanitized.trim()

  return sanitized
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 255)
}

export default {
  sanitizeText,
  sanitizeChatMessage,
  isValidEmail,
  sanitizeFilename,
}

