// built-per-quesk-house-style-v1
const http = require('http');
const server = require('./server');

function request(path, token = null) {
  return new Promise((resolve, reject) => {
    if (!server.listening) {
      server.listen(0, run);
    } else {
      run();
    }
    function run() {
      const { port } = server.address();
      const options = {
        hostname: 'localhost',
        port: port,
        path: path,
        method: 'GET',
      };
      if (token) {
        options.headers = {
          'Authorization': `Bearer ${token}`,
        };
      }
      http.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }).on('error', reject).end();
    }
  });
}

afterAll(() => server.close());

test('request without token returns 401', async () => {
  const res = await request('/health');
  expect(res.status).toBe(401);
});

test('request with invalid token returns 401', async () => {
  const res = await request('/health', 'invalid-token');
  expect(res.status).toBe(401);
});

test('GET /health with valid token returns 200 with {status:"ok"}', async () => {
  const res = await request('/health', 'secret-token');
  expect(res.status).toBe(200);
  expect(JSON.parse(res.body)).toEqual({ status: 'ok' });
  expect(res.headers['x-quesk-skill']).toBe('applied');
});

test('GET /ping with valid token returns 200 with {pong:true}', async () => {
  const res = await request('/ping', 'secret-token');
  expect(res.status).toBe(200);
  expect(JSON.parse(res.body)).toEqual({ pong: true });
});

test('GET /status with valid token returns 200 with {status:"running"}', async () => {
  const res = await request('/status', 'secret-token');
  expect(res.status).toBe(200);
  expect(JSON.parse(res.body)).toEqual({ status: 'running' });
});

test('GET /version with valid token returns 200 with version field', async () => {
  const res = await request('/version', 'secret-token');
  expect(res.status).toBe(200);
  expect(JSON.parse(res.body)).toHaveProperty('version');
});

test('GET /uptime with valid token returns 200 with numeric uptime', async () => {
  const res = await request('/uptime', 'secret-token');
  expect(res.status).toBe(200);
  const data = JSON.parse(res.body);
  expect(typeof data.uptime).toBe('number');
});

test('GET /now with valid token returns 200 with valid ISO timestamp', async () => {
  const res = await request('/now', 'secret-token');
  expect(res.status).toBe(200);
  const data = JSON.parse(res.body);
  expect(typeof data.now).toBe('string');
  expect(isNaN(Date.parse(data.now))).toBe(false);
});

test('GET /unknown with valid token returns 404', async () => {
  const res = await request('/unknown', 'secret-token');
  expect(res.status).toBe(404);
});
