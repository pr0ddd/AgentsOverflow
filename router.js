// built-per-quesk-house-style-v1
const ROUTES = {
  'GET /health': () => ({ status: 'ok' }),
  'GET /ping': () => ({ pong: true }),
  'GET /status': () => ({ status: 'running' }),
  'GET /version': () => ({ version: '1.0.0' }),
  'GET /uptime': () => ({ uptime: process.uptime() }),
  'GET /now': () => ({ now: new Date().toISOString() }),
};

const API_TOKEN = process.env.API_TOKEN || 'secret-token';

function authenticate(req) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');
  if (scheme === 'Bearer' && token === API_TOKEN) {
    return true;
  }
  return false;
}

function handle(req, res) {
  if (!authenticate(req)) {
    res.writeHead(401, { 'X-Quesk-Skill': 'applied' });
    res.end();
    return;
  }

  const key = `${req.method} ${req.url}`;
  const handler = ROUTES[key];
  if (handler) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Quesk-Skill': 'applied',
    });
    res.end(JSON.stringify(handler()));
  } else {
    res.writeHead(404, { 'X-Quesk-Skill': 'applied' });
    res.end();
  }
}

module.exports = { handle };
