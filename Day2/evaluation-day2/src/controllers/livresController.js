const livresService = require('../services/livresService');
const { z } = require('zod');

const livreSchema = z.object({
  titre: z.string().min(1),
  auteur: z.string().min(1),
  annee: z.number().optional(),
  genre: z.string().optional()
});

async function getAllLivres(req, res, next) {
  try {
    const data = await livresService.getAllLivres();
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function getLivreById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const data = await livresService.getLivreById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Livre introuvable'
      });
    }
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function createLivre(req, res, next) {
  try {
    const parsed = livreSchema.parse(req.body);
    const data = await livresService.createLivre(parsed);
    return res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function updateLivre(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const parsed = livreSchema.partial().parse(req.body);
    const data = await livresService.updateLivre(id, parsed);
    return res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
}

async function deleteLivre(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    await livresService.deleteLivre(id);
    return res.json({
      success: true,
      message: 'Livre supprimé'
    });
  } catch (error) {
    next(error);
  }
}

async function emprunterLivre(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const emprunt = await livresService.emprunterLivre(id, userId);
    return res.json({
      success: true,
      data: emprunt
    });
  } catch (error) {
    if (error.message === 'Livre introuvable') {
      return res.status(404).json({
        success: false,
        error: 'Livre introuvable'
      });
    }
    if (error.message === 'Livre non disponible') {
      return res.status(409).json({
        success: false,
        error: 'Livre non disponible'
      });
    }
    next(error);
  }
}

async function retournerLivre(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const userId = req.user.id;

    const emprunt = await livresService.retournerLivre(id, userId);
    return res.json({
      success: true,
      data: emprunt
    });
  } catch (error) {
    if (error.message === 'Aucun emprunt en cours') {
      return res.status(404).json({
        success: false,
        error: 'Aucun emprunt en cours'
      });
    }
    next(error);
  }
}

module.exports = {
  getAllLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
  emprunterLivre,
  retournerLivre
};
