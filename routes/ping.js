// built-per-quesk-house-style-v1
const { Router } = require('express');

const router = Router();

router.get('/ping', (req, res) => {
  res.set('X-Quesk-Skill', 'applied').json({ pong: true });
});

module.exports = router;
