// Rate limiter using sliding window with in-memory storage
class RateLimiter {
  constructor(options = {}) {
    this.windowSize = options.windowSize || 60000; // 1 minute in milliseconds
    this.maxRequests = options.maxRequests || 100; // requests per window
    this.store = new Map(); // IP -> array of request timestamps
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  isAllowed(ip) {
    const now = Date.now();
    const windowStart = now - this.windowSize;

    if (!this.store.has(ip)) {
      this.store.set(ip, [now]);
      return { allowed: true, remaining: this.maxRequests - 1, resetTime: now + this.windowSize };
    }

    let timestamps = this.store.get(ip);
    // Remove old timestamps outside the window
    timestamps = timestamps.filter(ts => ts > windowStart);

    if (timestamps.length < this.maxRequests) {
      timestamps.push(now);
      this.store.set(ip, timestamps);
      return {
        allowed: true,
        remaining: this.maxRequests - timestamps.length,
        resetTime: Math.min(...timestamps) + this.windowSize,
      };
    }

    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.min(...timestamps) + this.windowSize,
    };
  }

  cleanup() {
    const now = Date.now();
    const windowStart = now - this.windowSize;
    for (const [ip, timestamps] of this.store.entries()) {
      const active = timestamps.filter(ts => ts > windowStart);
      if (active.length === 0) {
        this.store.delete(ip);
      } else {
        this.store.set(ip, active);
      }
    }
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

module.exports = RateLimiter;
