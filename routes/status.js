// built-per-quesk-house-style-v1
const { Router } = require('express');

const router = Router();

router.get('/status', (req, res) => {
  res.set('X-Quesk-Skill', 'applied').json({ status: 'running' });
});

module.exports = router;
