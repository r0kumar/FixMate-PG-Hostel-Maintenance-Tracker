// In-memory sliding-window rate limiter for FixMate Demo & Auth protection
// Operates without external binary or npm dependencies, clean memory cleanup

class MemoryRateLimiter {
  constructor(options = {}) {
    this.windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
    this.max = options.max || 100; // max requests per window
    this.message = options.message || 'Too many requests, please try again later.';
    this.hits = new Map();

    // Periodically clean expired entries to prevent memory leak
    const cleanupInterval = Math.max(this.windowMs / 2, 60000);
    this.timer = setInterval(() => this.cleanup(), cleanupInterval);
    if (this.timer.unref) {
      this.timer.unref(); // Don't hold Node process open in tests
    }
  }

  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.hits.entries()) {
      if (now > record.resetTime) {
        this.hits.delete(key);
      }
    }
  }

  middleware() {
    return (req, res, next) => {
      // Resolve client IP (supporting reverse proxies like Render/Vercel)
      const forwarded = req.headers['x-forwarded-for'];
      const clientIp = forwarded
        ? forwarded.split(',')[0].trim()
        : req.socket?.remoteAddress || req.ip || 'unknown-client';

      const now = Date.now();
      let record = this.hits.get(clientIp);

      if (!record || now > record.resetTime) {
        record = {
          count: 1,
          resetTime: now + this.windowMs,
        };
        this.hits.set(clientIp, record);
      } else {
        record.count += 1;
      }

      const remaining = Math.max(0, this.max - record.count);
      const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

      // Set standard RateLimit HTTP headers
      res.setHeader('X-RateLimit-Limit', this.max);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', resetSeconds);

      if (record.count > this.max) {
        return res.status(429).json({
          message: this.message,
          retryAfterSeconds: resetSeconds,
        });
      }

      next();
    };
  }
}

// 1. Auth limiter for demo login (max 20 demo logins per 15 mins per IP)
export const demoAuthLimiter = new MemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many demo login attempts. Please wait a few minutes before trying again.',
}).middleware();

// 2. Demo reset limiter (max 6 resets per 15 mins per IP to protect Atlas)
export const demoResetLimiter = new MemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 6,
  message: 'Demo database reset limit reached. Please wait before resetting again.',
}).middleware();

// 3. Demo general API limiter (max 200 operations per 15 mins per IP)
export const demoApiLimiter = new MemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Demo API request rate limit exceeded. Please slow down.',
}).middleware();

