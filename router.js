// built-per-quesk-house-style-v1
const ROUTES = {
  'GET /health': () => ({ status: 'ok' }),
  'GET /ping': () => ({ pong: true }),
  'GET /status': () => ({ status: 'running' }),
  'GET /version': () => ({ version: '1.0.0' }),
  'GET /uptime': () => ({ uptime: process.uptime() }),
  'GET /now': () => ({ now: new Date().toISOString() }),
};

function handle(req, res) {
  const key = `${req.method} ${req.url}`;
  const startTime = Date.now();

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  const handler = ROUTES[key];
  if (handler) {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Quesk-Skill': 'applied',
    });
    res.end(JSON.stringify(handler()));
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} 200 ${Date.now() - startTime}ms`);
  } else {
    res.writeHead(404, { 'X-Quesk-Skill': 'applied' });
    res.end();
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} 404 ${Date.now() - startTime}ms`);
  }
}

module.exports = { handle };
