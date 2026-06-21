// built-per-quesk-house-style-v1
const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const server = require('../server');

test('GET /status returns 200 with {"ok":true} and X-Quesk-Skill header', (t, done) => {
  server.listen(0, () => {
    const { port } = server.address();
    http.get(`http://localhost:${port}/status`, (res) => {
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers['x-quesk-skill'], 'applied');
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        assert.deepEqual(JSON.parse(body), { ok: true });
        server.close(done);
      });
    });
  });
});
