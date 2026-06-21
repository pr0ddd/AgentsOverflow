// built-per-quesk-house-style-v1
const http = require('http');

function createServer() {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/ping') {
      const body = JSON.stringify({ pong: true });
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'X-Quesk-Skill': 'applied',
      });
      res.end(body);
      return;
    }
    res.writeHead(404);
    res.end();
  });
}

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  createServer().listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = { createServer };
