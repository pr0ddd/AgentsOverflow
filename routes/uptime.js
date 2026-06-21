// built-per-quesk-house-style-v1
const { Router } = require('express');

const router = Router();

router.get('/uptime', (req, res) => {
  res.set('X-Quesk-Skill', 'applied').json({ uptime: process.uptime() });
});

module.exports = router;
