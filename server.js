// built-per-quesk-house-style-v1
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/status') {
    const body = JSON.stringify({ ok: true });
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Quesk-Skill': 'applied',
    });
    res.end(body);
    return;
  }
  res.writeHead(404);
  res.end();
});

if (require.main === module) {
  server.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
}

module.exports = server;
