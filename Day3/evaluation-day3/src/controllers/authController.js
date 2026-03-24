const authService = require('../services/authService');

// 1. register
async function register(req, res, next) {
  try {
    const { nom, email, password } = req.body;
    const result = await authService.registerUser(nom, email, password);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

// 2. login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    if (!result) {
      return res.status(401).json({
        success: false,
        error: 'Email ou mot de passe incorrect'
      });
    }
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

// 3. me (profil connecté)
async function me(req, res) {
  return res.json({
    success: true,
    data: req.user
  });
}

// 4. refresh (token de rafraîchissement)
async function refresh(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    const token = await authService.handleRefreshToken(refreshToken);
    return res.json({
      success: true,
      data: { token }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message
    });
  }
}

// 5. logout
async function logout(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;
    await authService.deleteRefreshToken(refreshToken);
    res.clearCookie('refreshToken');
    return res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erreur interne'
    });
  }
}

module.exports = {
  register,
  login,
  me,
  refresh,
  logout
};
