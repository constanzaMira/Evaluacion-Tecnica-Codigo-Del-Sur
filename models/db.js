const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('movie_database.db', (err) => {
  if (err) {
    console.error('Error al abrir la base de datos', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite');
    // Crea las tablas necesarias al inicio si no existen
    createTables();
  }
});

function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        password TEXT NOT NULL
        )
  `);
    db.run(`
        CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        release_date TEXT NOT NULL,
        genre_ids TEXT NOT NULL,
        vote_average REAL NOT NULL,
        addedAt TEXT NOT NULL,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);
}

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error al cerrar la conexión de la base de datos', err.message);
    } else {
      console.log('Conexión de la base de datos cerrada');
    }
    process.exit(0);
  });
});

module.exports = db;
