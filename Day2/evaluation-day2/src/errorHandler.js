function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Erreur interne'
  });
}

module.exports = errorHandler;
