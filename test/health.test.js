const { test } = require('node:test');
const assert = require('node:assert');
const { createServer } = require('../server');

test('GET /health returns 200 with {"status":"ok"}', async () => {
  const server = createServer();

  await new Promise((resolve) => server.listen(0, resolve));

  const { port } = server.address();

  try {
    const response = await fetch(`http://localhost:${port}/health`);
    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.deepStrictEqual(body, { status: 'ok' });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
