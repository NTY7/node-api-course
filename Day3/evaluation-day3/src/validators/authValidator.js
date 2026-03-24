const { z } = require('zod');

const registerSchema = z.object({
  nom: z.string().min(1, "Le nom est requis"),
  email: z.string().email("L'email doit être valide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères")
});

const loginSchema = z.object({
  email: z.string().email("L'email doit être valide"),
  password: z.string().min(1, "Le mot de passe est requis")
});

module.exports = {
  registerSchema,
  loginSchema
};
