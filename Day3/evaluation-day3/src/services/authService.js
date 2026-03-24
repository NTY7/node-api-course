const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');
const config = require('../config/env');

// 1. register
async function registerUser(nom, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      nom,
      email,
      password: hashedPassword,
      role: 'user'
    }
  });

  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  const token = jwt.sign(
    { userId: user.id },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  return { user: userWithoutPassword, token };
}

// 2. login
async function loginUser(email, password) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }

  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  const token = jwt.sign(
    { userId: user.id },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  return { user: userWithoutPassword, token };
}

// 3. gestion du refresh token
async function handleRefreshToken(refreshToken) {
  if (!refreshToken) {
    throw new Error('Refresh token manquant');
  }

  const existing = await prisma.refreshToken.findUnique({
    where: { token: refreshToken }
  });

  if (!existing || existing.expiresAt < new Date()) {
    throw new Error('Refresh token invalide ou expiré');
  }

  const user = await prisma.user.findUnique({ where: { id: existing.userId } });
  if (!user) {
    throw new Error('Utilisateur introuvable');
  }

  const newToken = jwt.sign(
    { userId: user.id },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN }
  );

  return newToken;
}

// 4. suppression du refresh token (logout)
async function deleteRefreshToken(refreshToken) {
  if (!refreshToken) {
    return;
  }

  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken }
  });
}

module.exports = {
  registerUser,
  loginUser,
  handleRefreshToken,
  deleteRefreshToken
};
