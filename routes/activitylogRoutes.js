const express = require('express');
const activityLogController = require('../controllers/activitylogController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware.protect);

router.get('/', activityLogController.getMyActivityLogs);

module.exports = router;