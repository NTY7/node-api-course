const express = require('express');
const livresController = require('../controllers/livresController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = express.Router();

// Publiques
router.get('/', livresController.getAllLivres);
router.get('/:id', livresController.getLivreById);

// Protégées : au moins user
router.post('/', authenticate, livresController.createLivre);
router.put('/:id', authenticate, livresController.updateLivre);
router.post('/:id/emprunter', authenticate, livresController.emprunterLivre);
router.post('/:id/retourner', authenticate, livresController.retournerLivre);

// Admin uniquement
router.delete('/:id', authenticate, authorize(['admin']), livresController.deleteLivre);

module.exports = router;
