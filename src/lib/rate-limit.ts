/**
 * A small in-memory rate limiter, shared by the desk lock and the comment box.
 *
 * It is per-instance and it forgets everything on a cold start, which is the
 * honest limit of anything that does not talk to a shared store: on a
 * serverless deployment several instances each keep their own count, so the
 * real ceiling is the configured limit times the number of live instances.
 * That still turns "unlimited password guesses" into a rate an attacker cannot
 * usefully search a decent password with, which is the point. If the paper
 * ever grows a shared Redis, this is the one file that has to change.
 */

export interface RateLimitResult {
  ok: boolean;
  /** Seconds until the caller may try again; 0 when `ok`. */
  retryAfter: number;
}

interface Bucket {
  count: number;
  windowStart: number;
  blockedUntil: number;
}

export interface RateLimiterOptions {
  /** Attempts allowed inside one window. */
  limit: number;
  windowMs: number;
  /** How long a key is locked out once it exceeds the limit. */
  blockMs: number;
  /** Stop tracking new keys past this many, so a flood cannot exhaust memory. */
  maxKeys?: number;
}

export function createRateLimiter({
  limit,
  windowMs,
  blockMs,
  maxKeys = 10_000,
}: RateLimiterOptions) {
  const buckets = new Map<string, Bucket>();

  function sweep(now: number) {
    for (const [key, bucket] of buckets) {
      const idle = now - bucket.windowStart > windowMs && now > bucket.blockedUntil;
      if (idle) buckets.delete(key);
    }
  }

  return {
    /** Counts one attempt against `key` and says whether it is allowed. */
    hit(key: string): RateLimitResult {
      const now = Date.now();
      if (buckets.size > maxKeys) sweep(now);

      const bucket = buckets.get(key);

      if (bucket && now < bucket.blockedUntil) {
        return { ok: false, retryAfter: Math.ceil((bucket.blockedUntil - now) / 1000) };
      }

      if (!bucket || now - bucket.windowStart > windowMs) {
        // A flood of unique keys must not be able to grow this map forever.
        // Past the cap we stop admitting new keys rather than start evicting
        // the ones already being punished.
        if (!bucket && buckets.size >= maxKeys) {
          return { ok: false, retryAfter: Math.ceil(windowMs / 1000) };
        }
        buckets.set(key, { count: 1, windowStart: now, blockedUntil: 0 });
        return { ok: true, retryAfter: 0 };
      }

      bucket.count += 1;
      if (bucket.count > limit) {
        bucket.blockedUntil = now + blockMs;
        return { ok: false, retryAfter: Math.ceil(blockMs / 1000) };
      }

      return { ok: true, retryAfter: 0 };
    },

    /** Forget a key — called after a success, so one good login clears the slate. */
    reset(key: string) {
      buckets.delete(key);
    },
  };
}
