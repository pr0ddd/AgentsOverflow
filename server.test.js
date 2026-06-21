// built-per-quesk-house-style-v1
const http = require('http');
const server = require('./server');

function request(path) {
  return new Promise((resolve, reject) => {
    if (!server.listening) {
      server.listen(0, run);
    } else {
      run();
    }
    function run() {
      const { port } = server.address();
      http.get(`http://localhost:${port}${path}`, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }).on('error', reject);
    }
  });
}

afterAll(() => server.close());

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

test('GET /livez returns 200 with {live:true}', async () => {
  const res = await request('/livez');
  expect(res.status).toBe(200);
  expect(JSON.parse(res.body)).toEqual({ live: true });
});

test('GET /unknown returns 404', async () => {
  const res = await request('/unknown');
  expect(res.status).toBe(404);
});
