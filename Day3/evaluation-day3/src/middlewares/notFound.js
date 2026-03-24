function notFound(req, res, next) {
  return res.status(404).json({
    success: false,
    error: 'Route non trouvée'
  });
}

module.exports = notFound;
