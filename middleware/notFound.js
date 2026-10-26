const notFound = (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Route ${req.originalUrl} tidak ditemukan`,
  });
};

module.exports = notFound;