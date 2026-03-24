const prisma = require('../db/prisma');

async function getAllLivres() {
  return await prisma.livre.findMany();
}

async function getLivreById(id) {
  return await prisma.livre.findUnique({ where: { id } });
}

async function createLivre(data) {
  return await prisma.livre.create({ data });
}

async function updateLivre(id, data) {
  return await prisma.livre.update({
    where: { id },
    data
  });
}

async function deleteLivre(id) {
  return await prisma.livre.delete({ where: { id } });
}

async function emprunterLivre(livreId, userId) {
  const emprunt = await prisma.$transaction(async (prisma) => {
    const livre = await prisma.livre.findUnique({ where: { id: livreId } });
    if (!livre) {
      throw new Error('Livre introuvable');
    }
    if (!livre.disponible) {
      throw new Error('Livre non disponible');
    }

    await prisma.livre.update({
      where: { id: livreId },
      data: { disponible: false }
    });

    return await prisma.emprunt.create({
      data: {
        livreId,
        userId,
        dateEmprunt: new Date()
      }
    });
  });

  return emprunt;
}

async function retournerLivre(livreId, userId) {
  const emprunt = await prisma.$transaction(async (prisma) => {
    const openEmprunt = await prisma.emprunt.findFirst({
      where: {
        livreId,
        userId,
        dateRetour: null
      }
    });
    if (!openEmprunt) {
      throw new Error('Aucun emprunt en cours');
    }

    await prisma.emprunt.update({
      where: { id: openEmprunt.id },
      data: { dateRetour: new Date() }
    });

    await prisma.livre.update({
      where: { id: livreId },
      data: { disponible: true }
    });

    return openEmprunt;
  });

  return emprunt;
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
