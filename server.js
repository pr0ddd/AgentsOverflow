// built-per-quesk-house-style-v1
const express = require('express');
const routes = require('./routes');

const app = express();

app.use(routes);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
