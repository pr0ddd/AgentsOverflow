const http = require('http');
const assert = require('assert');
const server = require('./server');

const PORT = 0; // OS assigns a free port

server.listen(PORT, () => {
  const { port } = server.address();

  const cases = [
    { query: '?msg=hello', expected: { echo: 'hello' } },
    { query: '?msg=', expected: { echo: '' } },
    { query: '', expected: { echo: '' } },
  ];

  let pending = cases.length;

  cases.forEach(({ query, expected }) => {
    http.get(`http://localhost:${port}/echo${query}`, (res) => {
      assert.strictEqual(res.statusCode, 200);
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        const data = JSON.parse(body);
        assert.deepStrictEqual(data, expected);
        console.log(`PASS /echo${query} => ${body}`);
        if (--pending === 0) {
          server.close(() => {
            console.log('All tests passed.');
          });
        }
      });
    }).on('error', (err) => {
      console.error('FAIL', err.message);
      process.exit(1);
    });
  });
});
