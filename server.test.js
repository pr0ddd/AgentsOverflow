const http = require('http');
const server = require('./server');

function request(path) {
  return new Promise((resolve, reject) => {
    const port = 0;
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

async function runTests() {
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  PASS: ${name}`);
      passed++;
    } catch (err) {
      console.log(`  FAIL: ${name} — ${err.message}`);
      failed++;
    }
  }

  function assert(condition, msg) {
    if (!condition) throw new Error(msg);
  }

  await test('GET /now returns 200', async () => {
    const res = await request('/now');
    assert(res.status === 200, `expected 200, got ${res.status}`);
  });

  await test('GET /now body has "now" ISO timestamp', async () => {
    const res = await request('/now');
    const data = JSON.parse(res.body);
    assert(typeof data.now === 'string', '"now" should be a string');
    assert(!isNaN(Date.parse(data.now)), `"${data.now}" is not a valid ISO timestamp`);
  });

  await test('GET /other returns 404', async () => {
    const res = await request('/other');
    assert(res.status === 404, `expected 404, got ${res.status}`);
  });

  server.close();
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => { console.error(err); process.exit(1); });
