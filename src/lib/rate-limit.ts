// ═══════════════════════════════════════════════════════════
// strQ — In-memory Rate Limiter
// Simple IP-based rate limiting for API routes.
// Resets on cold start (Vercel serverless), which is fine —
// persistent rate limiting would need Redis/Upstash.
// ═══════════════════════════════════════════════════════════

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

/**
 * Check if a request should be rate-limited.
 *
 * @param key - Unique identifier (usually IP address)
 * @param maxRequests - Max requests per window (default: 5)
 * @param windowMs - Time window in ms (default: 60s)
 * @returns { limited: boolean, remaining: number, resetAt: number }
 */
export function rateLimit(
  key: string,
  maxRequests = 5,
  windowMs = 60_000
): { limited: boolean; remaining: number; resetAt: number } {
  cleanup();

  const now = Date.now();
  const entry = store.get(key);

  // First request or window expired
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  // Within window
  entry.count++;

  if (entry.count > maxRequests) {
    return { limited: true, remaining: 0, resetAt: entry.resetAt };
  }

  return { limited: false, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}
