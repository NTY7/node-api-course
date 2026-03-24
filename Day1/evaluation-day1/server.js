const http = require('http');
const router = require('./modules/router');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
  const start = Date.now();

  const originalEnd = res.end;
  res.end = function (...args) {
    const statusCode = res.statusCode || 200;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} → ${statusCode}`);
    return originalEnd.apply(this, args);
  };

  await router(req, res);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

