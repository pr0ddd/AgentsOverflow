// built-per-quesk-house-style-v1
const { createCache } = require('./cache');

// ttl: 0 means no-store; otherwise milliseconds to cache server-side and max-age in seconds
const ROUTES = {
  'GET /health':  { fn: () => ({ status: 'ok' }),                 ttl: 60_000 },
  'GET /ping':    { fn: () => ({ pong: true }),                    ttl: 60_000 },
  'GET /status':  { fn: () => ({ status: 'running' }),             ttl: 60_000 },
  'GET /version': { fn: () => ({ version: '1.0.0' }),              ttl: 60_000 },
  'GET /uptime':  { fn: () => ({ uptime: process.uptime() }),      ttl:  5_000 },
  'GET /now':     { fn: () => ({ now: new Date().toISOString() }), ttl:      0 },
};

const cache = createCache();

// djb2 hash → quoted hex string suitable for use as a weak ETag
function etag(body) {
  let h = 5381;
  for (let i = 0; i < body.length; i++) {
    h = (((h << 5) + h) + body.charCodeAt(i)) >>> 0;
  }
  return `"${h.toString(16)}"`;
}

function handle(req, res) {
  const key = `${req.method} ${req.url}`;
  const route = ROUTES[key];

  if (!route) {
    res.writeHead(404, { 'X-Quesk-Skill': 'applied' });
    return res.end();
  }

  const { fn, ttl } = route;
  const headers = { 'Content-Type': 'application/json', 'X-Quesk-Skill': 'applied' };

  if (ttl === 0) {
    headers['Cache-Control'] = 'no-store';
    res.writeHead(200, headers);
    return res.end(JSON.stringify(fn()));
  }

  headers['Cache-Control'] = `public, max-age=${Math.floor(ttl / 1000)}`;

  const cached = cache.get(key);
  const body = cached ?? JSON.stringify(fn());
  if (!cached) cache.set(key, body, ttl);

  const tag = etag(body);
  headers['ETag'] = tag;
  headers['X-Cache'] = cached ? 'HIT' : 'MISS';

  if (req.headers['if-none-match'] === tag) {
    res.writeHead(304, headers);
    return res.end();
  }

  res.writeHead(200, headers);
  res.end(body);
}

module.exports = { handle, cache };
