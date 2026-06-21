// built-per-quesk-house-style-v1
const http = require('http');
const { handle } = require('./router');

const server = http.createServer(handle);
const PORT = process.env.PORT || 3000;

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = server;
