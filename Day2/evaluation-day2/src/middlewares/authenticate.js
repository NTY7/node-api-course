const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const JWT_SECRET = process.env.JWT_SECRET;

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Accès non autorisé'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = await authService.getUserFromToken(token);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur introuvable'
      });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expiré'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Token invalide'
    });
  }
}

module.exports = authenticate;
