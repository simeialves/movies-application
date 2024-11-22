const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(":memory:", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    if (require.main === module) {
      console.log("Conectado ao banco de dados SQLite em memória.");
    }
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER,
      title TEXT,
      studios TEXT,
      winner BOOLEAN
    )
  `);

  db.run(`
    CREATE TABLE producers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE movies_producers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      movie_id INTEGER,
      producer_id INTEGER,
      FOREIGN KEY (movie_id) REFERENCES movies(id),
      FOREIGN KEY (producer_id) REFERENCES producers(id)
    )
  `);
});

module.exports = { db };
