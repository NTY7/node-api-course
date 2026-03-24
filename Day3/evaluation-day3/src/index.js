require('dotenv').config();
const app = require('./app');

const config = require('./config/env');

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
