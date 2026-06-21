const http = require('http');

function createServer() {
  return http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok' }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });
}

if (require.main === module) {
  const server = createServer();
  server.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
}

module.exports = { createServer };
