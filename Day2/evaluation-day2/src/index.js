require('dotenv').config();
const express = require('express');
const errorHandler = require('./errorHandler');

const app = express();

app.use(express.json());

// ici plus tard : routes /api/auth, /api/livres, etc.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(errorHandler);
