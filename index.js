
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models/db'); 
const moviesRoutes = require('./routes/movies');
const userRoutes = require('./routes/users');
const logoutRoutes = require('./routes/logout');
const authenticateToken = require('./authMiddleware');

const app = express();
const port = 3000;

require('dotenv').config();

app.use(bodyParser.json());


app.use('/users', userRoutes);
app.use('/movies', authenticateToken, moviesRoutes);
app.use('/logout', authenticateToken, logoutRoutes);

app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
});
