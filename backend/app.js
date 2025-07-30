const express = require('express');
require('dotenv').config();

const movieRoutes = require('./routes/movies');
const app = express();

app.use(express.json());
app.use('/movies', movieRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
