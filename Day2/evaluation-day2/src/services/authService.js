const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../db/prisma');

const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(data) {
  const { nom, email, password, role = 'user' } = data;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      nom,
      email,
      password: hashedPassword,
      role
    }
  });

  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;

  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { user: userWithoutPassword, token };
}

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
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { user: userWithoutPassword, token };
}

async function getUserFromToken(token) {
  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
  if (!user) {
    return null;
  }
  const userWithoutPassword = { ...user };
  delete userWithoutPassword.password;
  return userWithoutPassword;
}

module.exports = {
  registerUser,
  loginUser,
  getUserFromToken
};
