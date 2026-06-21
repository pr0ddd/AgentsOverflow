// built-per-quesk-house-style-v1
const { test } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { createServer } = require('../server');

test('GET /ping returns 200 with {pong:true} and X-Quesk-Skill header', (t, done) => {
  const server = createServer();
  server.listen(0, () => {
    const { port } = server.address();
    http.get(`http://localhost:${port}/ping`, (res) => {
      assert.equal(res.statusCode, 200);
      assert.equal(res.headers['content-type'], 'application/json');
      assert.equal(res.headers['x-quesk-skill'], 'applied');
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const body = JSON.parse(data);
        assert.deepEqual(body, { pong: true });
        server.close(done);
      });
    });
  });
});

test('GET /ping is not found on other paths', (t, done) => {
  const server = createServer();
  server.listen(0, () => {
    const { port } = server.address();
    http.get(`http://localhost:${port}/other`, (res) => {
      assert.equal(res.statusCode, 404);
      server.close(done);
    });
  });
});
