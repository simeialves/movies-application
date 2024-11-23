const { db } = require("../config/db");

class ProducersService {
  static create = ({ name }) => {
    return new Promise((resolve, reject) => {
      db.run(`INSERT INTO producers (name) VALUES (?)`, [name], function (err) {
        if (err) return reject(err);
        resolve(this.lastID);
      });
    });
  };

  static getAll = () => {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM producers", [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  };

  static getById = (id) => {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM producers WHERE id = ?", [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  };

  static getByName = (name, excludeId = null) => {
    const query = excludeId
      ? "SELECT * FROM producers WHERE name = ? AND id <> ?"
      : "SELECT * FROM producers WHERE name = ?";
    const params = excludeId ? [name, excludeId] : [name];

    return new Promise((resolve, reject) => {
      db.get(query, params, (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  };

  static getIntervals = () => {
    const query = `
      WITH producer_wins AS (
          SELECT 
              p.name AS producer,
              m.year AS winYear
          FROM movies m
          INNER JOIN movies_producers mp ON m.id = mp.movie_id
          INNER JOIN producers p ON mp.producer_id = p.id
          WHERE m.winner = 1
      ),
      intervals AS (
          SELECT 
              producer,
              winYear AS previousWin,
              LEAD(winYear) OVER (PARTITION BY producer ORDER BY winYear) AS followingWin,
              LEAD(winYear) OVER (PARTITION BY producer ORDER BY winYear) - winYear AS interval
          FROM producer_wins
      )
      SELECT 
          producer,
          interval,
          previousWin,
          followingWin
      FROM intervals
      WHERE interval IS NOT NULL
      ORDER BY interval;
    `;

    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  };

  static update = (id, { name }) => {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE producers SET name = ? WHERE id = ?`,
        [name, id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  };

  static delete = (id) => {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM producers WHERE id = ?`, [id], function (err) {
        if (err) return reject(err);
        resolve(this.changes > 0);
      });
    });
  };
}

module.exports = ProducersService;
