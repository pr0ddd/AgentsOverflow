// built-per-quesk-house-style-v1
const { Router } = require('express');

const health = require('./health');
const status = require('./status');
const version = require('./version');
const ping = require('./ping');
const uptime = require('./uptime');

const router = Router();

router.use(health);
router.use(status);
router.use(version);
router.use(ping);
router.use(uptime);

module.exports = router;
