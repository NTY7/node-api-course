function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err.stack);

  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      success: false,
      error: 'Erreur interne'
    });
  }

  return res.status(500).json({
    success: false,
    error: err.message || 'Erreur interne'
  });
}

module.exports = errorHandler;
