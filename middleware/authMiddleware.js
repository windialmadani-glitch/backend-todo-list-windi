const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  // 1. Cek apakah header authorization ada dan diawali dengan kata 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Jika token tidak ditemukan
  if (!token) {
    return next(
      new AppError('Anda belum login! Silakan login untuk mendapatkan akses.', 401)
    );
  }

  // 2. Verifikasi token menggunakan JWT_SECRET
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Cek apakah user pemilik token tersebut masih ada di database
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('User yang memiliki token ini sudah tidak ada lagi.', 401)
    );
  }

  // 4. Masukkan data user ke objek request (req.user) agar bisa dipakai di tahap selanjutnya
  req.user = currentUser;
  next();
});

// Middleware untuk membatasi hak akses berdasarkan role (admin/user)
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user didapat dari middleware protect sebelumnya
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Anda tidak memiliki izin untuk melakukan tindakan ini!', 403)
      );
    }
    next();
  };
};