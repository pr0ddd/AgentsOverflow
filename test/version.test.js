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
        res.on('end', () => resolve({ status: res.statusCode, body }));
      }).on('error', reject);
    }
  });
}

afterAll(() => server.close());

test('GET /version returns 200 with version field', async () => {
  const res = await request('/version');
  expect(res.status).toBe(200);
  const data = JSON.parse(res.body);
  expect(data).toHaveProperty('version');
});
