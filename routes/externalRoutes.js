const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const apiKeyMiddleware = require('../middleware/apiKeyMiddleware');

// Endpoint eksternal dilindungi API Key
router.get('/summary', apiKeyMiddleware, statsController.getSystemStats);

module.exports = router;