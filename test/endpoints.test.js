const { test } = require('node:test');
const assert = require('node:assert');
const http = require('http');
const server = require('../server');

function request(port, path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}${path}`, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    }).on('error', reject);
  });
}

test('GET /health returns 200 with {status:"ok"}', async (t) => {
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  try {
    const { status, body } = await request(port, '/health');
    assert.strictEqual(status, 200);
    assert.deepStrictEqual(body, { status: 'ok' });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('GET /version returns 200 with version from package.json', async (t) => {
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const { version } = require('../package.json');
  try {
    const { status, body } = await request(port, '/version');
    assert.strictEqual(status, 200);
    assert.deepStrictEqual(body, { version });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
