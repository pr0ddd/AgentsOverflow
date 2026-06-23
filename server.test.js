// built-per-quesk-house-style-v1
const http = require('http');
const server = require('./server');
const { cache } = require('./router');

function request(path) {
  return requestWithHeaders(path, {});
}

function requestWithHeaders(path, headers) {
  return new Promise((resolve, reject) => {
    if (!server.listening) {
      server.listen(0, run);
    } else {
      run();
    }
    function run() {
      const { port } = server.address();
      const opts = { hostname: 'localhost', port, path, method: 'GET', headers };
      const req = http.request(opts, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      });
      req.on('error', reject);
      req.end();
    }
  });
}

afterAll(() => server.close());

// --- existing endpoint tests ---

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

// --- caching tests ---

test('GET /health first request is cache MISS with Cache-Control', async () => {
  cache.clear();
  const res = await request('/health');
  expect(res.headers['x-cache']).toBe('MISS');
  expect(res.headers['cache-control']).toBe('public, max-age=60');
  expect(res.headers['etag']).toBeTruthy();
});

test('GET /health second request is cache HIT with same body', async () => {
  cache.clear();
  const first = await request('/health');
  const second = await request('/health');
  expect(second.headers['x-cache']).toBe('HIT');
  expect(second.body).toBe(first.body);
  expect(second.headers['etag']).toBe(first.headers['etag']);
});

test('GET /health returns 304 when ETag matches', async () => {
  cache.clear();
  const first = await request('/health');
  const tag = first.headers['etag'];
  const res = await requestWithHeaders('/health', { 'if-none-match': tag });
  expect(res.status).toBe(304);
  expect(res.body).toBe('');
});

test('GET /health returns 200 when ETag does not match', async () => {
  cache.clear();
  const res = await requestWithHeaders('/health', { 'if-none-match': '"stale"' });
  expect(res.status).toBe(200);
});

test('GET /now has Cache-Control: no-store and no ETag', async () => {
  const res = await request('/now');
  expect(res.headers['cache-control']).toBe('no-store');
  expect(res.headers['etag']).toBeUndefined();
  expect(res.headers['x-cache']).toBeUndefined();
});

test('GET /uptime has short Cache-Control max-age', async () => {
  cache.clear();
  const res = await request('/uptime');
  expect(res.headers['cache-control']).toBe('public, max-age=5');
  expect(res.headers['x-cache']).toBe('MISS');
});
