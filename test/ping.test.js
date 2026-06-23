// built-per-quesk-house-style-v1
const http = require('http');
const server = require('../server');

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

test('GET /ping returns 200 with {pong:true}', async () => {
  const res = await request('/ping');
  expect(res.status).toBe(200);
  expect(JSON.parse(res.body)).toEqual({ pong: true });
  expect(res.headers['x-quesk-skill']).toBe('applied');
});
