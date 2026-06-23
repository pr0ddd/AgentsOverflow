// built-per-quesk-house-style-v1
const http = require('http');
const server = require('./server');
const { rateLimiter } = require('./router');

function request(path, headers = {}) {
  return new Promise((resolve, reject) => {
    if (!server.listening) {
      server.listen(0, run);
    } else {
      run();
    }
    function run() {
      const { port } = server.address();
      const req = http.get(`http://localhost:${port}${path}`, { headers }, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }).on('error', reject);
    }
  });
}

afterAll(() => {
  rateLimiter.destroy();
  server.close();
});

test('GET /health returns 200 with {status:"ok"}', async () => {
  const res = await request('/health');
  expect(res.status).toBe(200);
  expect(JSON.parse(res.body)).toEqual({ status: 'ok' });
  expect(res.headers['x-quesk-skill']).toBe('applied');
});

test('GET /ping returns 200 with {pong:true}', async () => {
  const res = await request('/ping');
  expect(res.status).toBe(200);
  expect(JSON.parse(res.body)).toEqual({ pong: true });
});

test('GET /status returns 200 with {status:"running"}', async () => {
  const res = await request('/status');
  expect(res.status).toBe(200);
  expect(JSON.parse(res.body)).toEqual({ status: 'running' });
});

test('GET /version returns 200 with version field', async () => {
  const res = await request('/version');
  expect(res.status).toBe(200);
  expect(JSON.parse(res.body)).toHaveProperty('version');
});

test('GET /uptime returns 200 with numeric uptime', async () => {
  const res = await request('/uptime');
  expect(res.status).toBe(200);
  const data = JSON.parse(res.body);
  expect(typeof data.uptime).toBe('number');
});

test('GET /now returns 200 with valid ISO timestamp', async () => {
  const res = await request('/now');
  expect(res.status).toBe(200);
  const data = JSON.parse(res.body);
  expect(typeof data.now).toBe('string');
  expect(isNaN(Date.parse(data.now))).toBe(false);
});

test('GET /unknown returns 404', async () => {
  const res = await request('/unknown');
  expect(res.status).toBe(404);
});

test('responses include rate limit headers', async () => {
  const res = await request('/health');
  expect(res.headers['ratelimit-limit']).toBe('100');
  expect(res.headers['ratelimit-remaining']).toBeDefined();
  expect(res.headers['ratelimit-reset']).toBeDefined();
});

test('rate limit headers decrement on successive requests', async () => {
  rateLimiter.store.clear(); // Reset for this test
  const res1 = await request('/health');
  const remaining1 = parseInt(res1.headers['ratelimit-remaining']);
  const res2 = await request('/health');
  const remaining2 = parseInt(res2.headers['ratelimit-remaining']);
  expect(remaining2).toBe(remaining1 - 1);
});

test('returns 429 when rate limit is exceeded', async () => {
  rateLimiter.store.clear(); // Reset for this test
  rateLimiter.maxRequests = 2; // Set low limit temporarily
  const res1 = await request('/health');
  expect(res1.status).toBe(200);
  const res2 = await request('/health');
  expect(res2.status).toBe(200);
  const res3 = await request('/health');
  expect(res3.status).toBe(429);
  expect(JSON.parse(res3.body)).toEqual({ error: 'rate limit exceeded' });
  rateLimiter.maxRequests = 100; // Reset
});
