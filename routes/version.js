// built-per-quesk-house-style-v1
const { Router } = require('express');
const { version } = require('../package.json');

const router = Router();

router.get('/version', (req, res) => {
  res.set('X-Quesk-Skill', 'applied').json({ version });
});

module.exports = router;
