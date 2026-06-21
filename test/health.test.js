const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const server = require('../server');

test('GET /health returns 200 with {status:"ok"}', (t, done) => {
  server.listen(0, () => {
    const { port } = server.address();
    http.get(`http://localhost:${port}/health`, (res) => {
      assert.strictEqual(res.statusCode, 200);
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const json = JSON.parse(body);
        assert.deepStrictEqual(json, { status: 'ok' });
        server.close(done);
      });
    }).on('error', (err) => {
      server.close(() => done(err));
    });
  });
});
