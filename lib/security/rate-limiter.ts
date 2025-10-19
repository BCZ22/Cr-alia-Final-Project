/**
 * Rate Limiter
 * Prevent abuse and DDoS attacks
 */

import { logger } from '@/lib/monitoring/logger'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

class RateLimiter {
  private store = new Map<string, RateLimitEntry>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Cleanup expired entries every 60 seconds
    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 60000)
  }

  /**
   * Check if request is allowed
   */
  check(key: string, config: RateLimitConfig): boolean {
    const now = Date.now()
    const entry = this.store.get(key)

    // No entry or expired
    if (!entry || now > entry.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      })
      return true
    }

    // Increment count
    entry.count++

    // Check if limit exceeded
    if (entry.count > config.maxRequests) {
      logger.warn('Rate limit exceeded', {
        key,
        count: entry.count,
        maxRequests: config.maxRequests,
      })
      return false
    }

    return true
  }

  /**
   * Get remaining requests
   */
  getRemaining(key: string, config: RateLimitConfig): number {
    const entry = this.store.get(key)
    if (!entry) return config.maxRequests

    const remaining = config.maxRequests - entry.count
    return Math.max(0, remaining)
  }

  /**
   * Get reset time
   */
  getResetTime(key: string): number | null {
    const entry = this.store.get(key)
    return entry ? entry.resetTime : null
  }

  /**
   * Cleanup expired entries
   */
  private cleanup() {
    const now = Date.now()
    let cleaned = 0

    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key)
        cleaned++
      }
    }

    if (cleaned > 0) {
      logger.debug('Rate limiter cleanup', { cleaned })
    }
  }

  /**
   * Clear all entries
   */
  clear() {
    this.store.clear()
  }

  /**
   * Cleanup on shutdown
   */
  destroy() {
    clearInterval(this.cleanupInterval)
    this.clear()
  }
}

// Export singleton
export const rateLimiter = new RateLimiter()

/**
 * Rate limit configurations
 */
export const RateLimitConfigs = {
  API_GENERAL: { maxRequests: 100, windowMs: 60000 }, // 100 req/min
  API_AI: { maxRequests: 10, windowMs: 60000 }, // 10 req/min
  API_UPLOAD: { maxRequests: 20, windowMs: 60000 }, // 20 req/min
  AUTH_LOGIN: { maxRequests: 5, windowMs: 900000 }, // 5 attempts/15min
  AUTH_SIGNUP: { maxRequests: 3, windowMs: 3600000 }, // 3 signups/hour
}

export default rateLimiter

