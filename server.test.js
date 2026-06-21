const http = require('http');
const server = require('./server');

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port: 0, path }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
  });
}

async function run() {
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  PASS  ${name}`);
      passed++;
    } catch (err) {
      console.error(`  FAIL  ${name}: ${err.message}`);
      failed++;
    }
  }

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  const get = (path) => new Promise((resolve, reject) => {
    const req = http.get({ host: '127.0.0.1', port, path }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(body) }));
    });
    req.on('error', reject);
  });

  await test('GET /uptime returns 200', async () => {
    const { status } = await get('/uptime');
    assert(status === 200, `Expected 200, got ${status}`);
  });

  await test('GET /uptime body has uptimeSeconds as a number', async () => {
    const { body } = await get('/uptime');
    assert(typeof body.uptimeSeconds === 'number', `uptimeSeconds is not a number: ${body.uptimeSeconds}`);
    assert(body.uptimeSeconds >= 0, `uptimeSeconds should be >= 0`);
  });

  await test('GET /unknown returns 404', async () => {
    const { status } = await get('/unknown');
    assert(status === 404, `Expected 404, got ${status}`);
  });

  server.close();
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => { console.error(err); process.exit(1); });
