const { db } = require("../config/db");

async function createMovie({ year, title, studios, winner }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO movies (year, title, studios, winner) VALUES (?, ?, ?, ?)`,
      [year, title, studios, winner],
      function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      }
    );
  });
}

async function getAllMovies() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM movies", [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function getMovieById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function updateMovie(id, { year, title, studios, winner }) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE movies SET year = ?, title = ?, studios = ?, winner = ? WHERE id = ?`,
      [year, title, studios, winner, id],
      function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      }
    );
  });
}

async function deleteMovie(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM movies WHERE id = ?`, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes > 0);
    });
  });
}

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
