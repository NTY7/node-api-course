const express = require('express');
const livresController = require('../controllers/livresController');
const authenticate = require('../middlewares/authenticate');
const authorize = require('../middlewares/authorize');

const router = express.Router();

/**
 * @swagger
 * /api/livres:
 *   get:
 *     summary: Récupère la liste de tous les livres
 *     description: Retourne tous les livres disponibles dans la bibliothèque
 *     tags: [Livres]
 *     responses:
 *       200:
 *         description: Liste des livres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Livre'
 */

router.get('/', livresController.getAllLivres);
router.get('/:id', livresController.getLivreById);
/**
 * @swagger
 * /api/livres:
 *   post:
 *     summary: Ajoute un nouveau livre
 *     description: Crée un nouveau livre dans la base
 *     tags: [Livres]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livre'
 *     responses:
 *       201:
 *         description: Livre créé
 *       400:
 *         description: Champs manquants ou invalides
 *       401:
 *         description: Token absent ou invalide
 *       403:
 *         description: Accès interdit
 */

router.post('/', authenticate, livresController.createLivre);
router.put('/:id', authenticate, livresController.updateLivre);
router.post('/:id/emprunter', authenticate, livresController.emprunterLivre);
router.post('/:id/retourner', authenticate, livresController.retournerLivre);

/**
 * @swagger
 * /api/livres/{id}:
 *   delete:
 *     summary: Supprime un livre par son ID
 *     tags: [Livres]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Livre supprimé
 *       401:
 *         description: Accès non autorisé
 *       403:
 *         description: Accès interdit
 *       404:
 *         description: Livre introuvable
 */

router.delete('/:id', authenticate, authorize('admin'), livresController.deleteLivre);

module.exports = router;
