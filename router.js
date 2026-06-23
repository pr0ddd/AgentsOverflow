// built-per-quesk-house-style-v1
const RateLimiter = require('./rate-limiter');

const ROUTES = {
  'GET /health': () => ({ status: 'ok' }),
  'GET /ping': () => ({ pong: true }),
  'GET /status': () => ({ status: 'running' }),
  'GET /version': () => ({ version: '1.0.0' }),
  'GET /uptime': () => ({ uptime: process.uptime() }),
  'GET /now': () => ({ now: new Date().toISOString() }),
};

const rateLimiter = new RateLimiter({
  windowSize: 60000, // 1 minute
  maxRequests: 100, // per IP per minute
});

function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';
}

function handle(req, res) {
  const clientIP = getClientIP(req);
  const { allowed, remaining, resetTime } = rateLimiter.isAllowed(clientIP);

  const headers = {
    'X-Quesk-Skill': 'applied',
    'RateLimit-Limit': '100',
    'RateLimit-Remaining': Math.max(0, remaining).toString(),
    'RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
  };

  if (!allowed) {
    res.writeHead(429, { ...headers, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'rate limit exceeded' }));
    return;
  }

  const key = `${req.method} ${req.url}`;
  const handler = ROUTES[key];
  if (handler) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      ...headers,
    });
    res.end(JSON.stringify(handler()));
  } else {
    res.writeHead(404, headers);
    res.end();
  }
}

function destroy() {
  rateLimiter.destroy();
}

module.exports = { handle, destroy, rateLimiter };
