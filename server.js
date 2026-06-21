const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/now') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ now: new Date().toISOString() }));
    return;
  }
  res.writeHead(404);
  res.end();
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = server;
