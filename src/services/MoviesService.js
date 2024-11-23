const { db } = require("../config/db");

class MoviesService {
  static create = ({ year, title, studios, winner }) => {
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
  };

  static getAll = () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  };

  static getById = (id) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  };

  static update = (id, { year, title, studios, winner }) => {
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
  };

  static delete = (id) => {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM movies WHERE id = ?`, [id], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  };
}

module.exports = MoviesService;
