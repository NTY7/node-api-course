const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma'); // importe Prisma pour vérifier le token

const config = require('../config/env');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  // 1. Vérifie qu'il y a bien une authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Accès non autorisé'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Vérifie le JWT
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur introuvable'
      });
    }

    // 3. Attache l'utilisateur à req.user
    req.user = user;
    next();
  } catch (error) {
    // 4. Token expiré
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expiré'
      });
    }

    // 5. Token invalide
    return res.status(401).json({
      success: false,
      error: 'Token invalide'
    });
  }
}

module.exports = authenticate;
