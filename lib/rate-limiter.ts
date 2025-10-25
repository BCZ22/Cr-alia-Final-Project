import { LRUCache } from 'lru-cache';
import { NextRequest } from 'next/server';

type RateLimiterOptions = {
  uniqueTokenPerInterval: number;
  interval: number;
};

export default function rateLimiter(options: RateLimiterOptions) {
  const tokenCache = new LRUCache<string, number>({
    max: 500, // Max number of tokens to store
    ttl: options.interval,
  });

  return {
    check: (req: NextRequest, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) || 0) + 1;
        tokenCache.set(token, tokenCount);

        if (tokenCount > limit) {
          return reject();
        }

        return resolve();
      }),
  };
}

// A simple in-memory rate limiter.
// For production, a more robust solution like Upstash Rate Limiter with Redis is recommended.

const rateLimitStore = new Map<string, { count: number; expiry: number }>();

/**
 * Applies a rate limit for a given key (e.g., an IP address).
 * @param key The identifier for the client (e.g., IP address).
 * @param limit The maximum number of requests allowed.
 * @param windowMs The time window in milliseconds.
 * @returns True if the request is allowed, false otherwise.
 */
export const applyRateLimiter = (key: string, limit: number, windowMs: number): boolean => {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = rateLimitStore.get(key);

  if (record && record.expiry > now) {
    if (record.count >= limit) {
      return false; // Limit exceeded
    }
    // Increment count
    rateLimitStore.set(key, { ...record, count: record.count + 1 });
  } else {
    // Start a new window
    rateLimitStore.set(key, { count: 1, expiry: now + windowMs });
  }
  
  // Clean up expired entries occasionally
  if (Math.random() < 0.1) {
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.expiry <= now) {
        rateLimitStore.delete(key);
      }
    }
  }

  return true;
};
