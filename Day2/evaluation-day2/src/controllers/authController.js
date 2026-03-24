const { registerUser, loginUser } = require('../services/authService');
const { z } = require('zod');

const registerSchema = z.object({
  nom: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

async function register(req, res, next) {
  try {
    const parsed = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Email déjà utilisé'
      });
    }
    const result = await registerUser(parsed);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const parsed = loginSchema.parse(req.body);
    const result = await loginUser(parsed.email, parsed.password);
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

async function me(req, res) {
  return res.json({
    success: true,
    data: req.user
  });
}

module.exports = {
  register,
  login,
  me
};
