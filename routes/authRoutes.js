const express = require('express');
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Endpoint khusus yang DIPROTEKSI token
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

// Endpoint khusus HANYA UNTUK ADMIN (untuk pengetesan restrictTo)
router.get('/admin-only', protect, restrictTo('admin'), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Selamat datang Admin!',
  });
});

module.exports = router;