require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const morgan = require('morgan');

const config = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');

const authRoutes = require('./routes/auth');
const livresRoutes = require('./routes/livres');

const app = express();

// 1. Sécurité HTTP (helmet)
app.use(helmet());

// 2. Format de logs : morgan
if (config.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// 3. Limitation de la taille du JSON
app.use(express.json({ limit: '10kb' }));

// 4. CORS (permissif en dev, whitelist en prod)
if (config.NODE_ENV === 'production') {
  app.use(cors({ origin: config.ALLOWED_ORIGINS }));
} else {
  app.use(cors());
}

// 5. Rate limiting global (100 req / 15 min par IP)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    error: 'Limite de requêtes dépassée, veuillez réessayer plus tard.'
  }
});
app.use(globalLimiter);

// 6. Rate limiting strict sur /api/auth/login et /api/auth/register
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    error: 'Trop de tentatives, veuillez réessayer plus tard.'
  }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 7. Routes principales
app.use('/api/auth', authRoutes);
app.use('/api/livres', livresRoutes);

// 8. Route 404 pour les endpoints inconnus
app.use(notFound);

// 9. Middleware global d'erreurs
app.use(errorHandler);
const setupSwagger = require('./docs/swagger');
setupSwagger(app);

module.exports = app;
