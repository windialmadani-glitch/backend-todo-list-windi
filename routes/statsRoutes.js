const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');

// Endpoint statistik dilindungi API Key (machine-to-machine)
router.get('/', apiKeyMiddleware, statsController.getSystemStats);

module.exports = router;