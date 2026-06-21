// built-per-quesk-house-style-v1
const { Router } = require('express');

const router = Router();

router.get('/health', (req, res) => {
  res.set('X-Quesk-Skill', 'applied').json({ status: 'ok' });
});

module.exports = router;
