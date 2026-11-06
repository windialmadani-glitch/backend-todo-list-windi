const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server';

  // ID tidak valid (contoh: ada spasi atau panjangnya salah)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Format ${err.path} tidak valid`;
  }

  // Validasi schema gagal (contoh: status di luar enum)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
  });
};

module.exports = errorHandler;