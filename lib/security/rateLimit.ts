/**
 * In-Memory Sliding Window Rate Limiter
 * Protects against brute-force, credential stuffing, and Denial of Service (DoS).
 */

interface RateLimitRecord {
  timestamps: number[];
  lockoutUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (record.lockoutUntil && record.lockoutUntil > now) {
        continue;
      }
      const validTimestamps = record.timestamps.filter((ts) => now - ts < 15 * 60 * 1000);
      if (validTimestamps.length === 0) {
        rateLimitStore.delete(key);
      } else {
        record.timestamps = validTimestamps;
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
  lockedOut?: boolean;
}

/**
 * Checks and updates rate limit for a given key (e.g. IP, email, action).
 * @param key Identifier for rate limiting
 * @param maxHits Max requests allowed within windowMs
 * @param windowMs Time window in milliseconds (default 15 minutes)
 * @param lockoutMs Lockout duration when maxHits is exceeded (default 5 minutes)
 */
export function checkRateLimit(
  key: string,
  maxHits: number = 5,
  windowMs: number = 15 * 60 * 1000,
  lockoutMs: number = 5 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  let record = rateLimitStore.get(key);

  if (!record) {
    record = { timestamps: [] };
    rateLimitStore.set(key, record);
  }

  // Check if key is currently locked out
  if (record.lockoutUntil && record.lockoutUntil > now) {
    return {
      allowed: false,
      remaining: 0,
      resetMs: record.lockoutUntil - now,
      lockedOut: true,
    };
  }

  // Filter timestamps within window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxHits) {
    record.lockoutUntil = now + lockoutMs;
    return {
      allowed: false,
      remaining: 0,
      resetMs: lockoutMs,
      lockedOut: true,
    };
  }

  record.timestamps.push(now);
  const remaining = Math.max(0, maxHits - record.timestamps.length);

  return {
    allowed: true,
    remaining,
    resetMs: windowMs,
    lockedOut: false,
  };
}

/**
 * Clears rate limit record on successful authentication or action completion.
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key);
}
