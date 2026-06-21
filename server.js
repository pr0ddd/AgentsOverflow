const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost`);

  if (req.method === 'GET' && url.pathname === '/echo') {
    const msg = url.searchParams.get('msg') ?? '';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ echo: msg }));
    return;
  }

  res.writeHead(404);
  res.end();
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = server;
