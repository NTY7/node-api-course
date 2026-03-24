const { readDB, writeDB } = require('./db');

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

async function router(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    if (req.method === 'GET' && pathname === '/books') {
      const db = await readDB();
      const books = db.books;

      return sendJson(res, 200, {
        success: true,
        count: books.length,
        data: books
      });
    }

    if (req.method === 'GET' && pathname.startsWith('/books/')) {
      const id = Number(pathname.split('/')[2]);
      const db = await readDB();
      const book = db.books.find(b => b.id === id);

      if (!book) {
        return sendJson(res, 404, {
          success: false,
          error: 'Livre introuvable'
        });
      }

      return sendJson(res, 200, {
        success: true,
        data: book
      });
    }

    if (req.method === 'POST' && pathname === '/books') {
      let body = '';

      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', async () => {
        try {
          const { title, author, year } = JSON.parse(body);

          if (!title || !author || !year) {
            return sendJson(res, 400, {
              success: false,
              error: 'Les champs title, author et year sont requis'
            });
          }

          const db = await readDB();
          const maxId = db.books.length > 0 ? Math.max(...db.books.map(b => b.id)) : 0;

          const newBook = {
            id: maxId + 1,
            title,
            author,
            year,
            available: true
          };

          db.books.push(newBook);
          await writeDB(db);

          return sendJson(res, 201, {
            success: true,
            data: newBook
          });
        } catch (error) {
          return sendJson(res, 500, {
            success: false,
            error: 'Erreur interne'
          });
        }
      });

      return;
    }

    if (req.method === 'DELETE' && pathname.startsWith('/books/')) {
      const id = Number(pathname.split('/')[2]);
      const db = await readDB();
      const index = db.books.findIndex(b => b.id === id);

      if (index === -1) {
        return sendJson(res, 404, {
          success: false,
          error: 'Livre introuvable'
        });
      }

      const deleted = db.books.splice(index, 1)[0];
      await writeDB(db);

      return sendJson(res, 200, {
        success: true,
        data: deleted
      });
    }

    return sendJson(res, 404, {
      success: false,
      error: 'Route non trouvée'
    });
  } catch (error) {
    return sendJson(res, 500, {
      success: false,
      error: 'Erreur interne'
    });
  }
}

module.exports = router;

