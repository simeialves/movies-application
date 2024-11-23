const { db } = require("../config/db");
const {
  ERROR_CREATE_MOVIE_PRODUCER,
  ERROR_FETCH_MOVIES_PRODUCERS,
  ERROR_FETCH_MOVIE_PRODUCER,
  ERROR_UPDATE_MOVIE_PRODUCER,
  ERROR_DELETE_MOVIE_PRODUCER,
} = require("../includes/Messages");

class MoviesProducersService {
  static create = async (movie_id, producer_id) => {
    try {
      const result = await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO movies_producers (movie_id, producer_id) VALUES (?, ?)`,
          [movie_id, producer_id],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve(this.lastID);
            }
          }
        );
      });
      return result;
    } catch (err) {
      throw new Error(`${ERROR_CREATE_MOVIE_PRODUCER}: ${err.message}`);
    }
  };

  static getAll = async () => {
    try {
      const rows = await new Promise((resolve, reject) => {
        db.all("SELECT * FROM movies_producers", [], (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      });
      return rows;
    } catch (err) {
      throw new Error(`${ERROR_FETCH_MOVIES_PRODUCERS}: ${err.message}`);
    }
  };

  static getById = async (id) => {
    try {
      const row = await new Promise((resolve, reject) => {
        db.get(
          "SELECT * FROM movies_producers WHERE id = ?",
          [id],
          (err, row) => {
            if (err) {
              reject(err);
            }
            resolve(row);
          }
        );
      });
      return row;
    } catch (err) {
      throw new Error(`${ERROR_FETCH_MOVIE_PRODUCER}: ${err.message}`);
    }
  };

  static update = async (id, movie_id, producer_id) => {
    try {
      const movieProducer = await MoviesProducersService.getById(id);
      if (!movieProducer) {
        throw new Error("MovieProducer not found");
      }

      const movie = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM movies WHERE id = ?", [movie_id], (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        });
      });

      if (!movie) {
        throw new Error("Movie not found");
      }

      const producer = await new Promise((resolve, reject) => {
        db.get(
          "SELECT * FROM producers WHERE id = ?",
          [producer_id],
          (err, row) => {
            if (err) {
              reject(err);
            }
            resolve(row);
          }
        );
      });

      if (!producer) {
        throw new Error("Producer not found");
      }

      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE movies_producers SET movie_id = ?, producer_id = ? WHERE id = ?`,
          [movie_id, producer_id, id],
          function (err) {
            if (err) {
              reject(err);
            }
            resolve();
          }
        );
      });

      return { id };
    } catch (err) {
      throw new Error(`${ERROR_UPDATE_MOVIE_PRODUCER}: ${err.message}`);
    }
  };

  static delete = async (id) => {
    try {
      const movieProducer = await MoviesProducersService.getById(id);
      if (!movieProducer) {
        throw new Error("MovieProducer not found");
      }

      await new Promise((resolve, reject) => {
        db.run(
          `DELETE FROM movies_producers WHERE id = ?`,
          [id],
          function (err) {
            if (err) {
              reject(err);
            }
            resolve();
          }
        );
      });

      return { id };
    } catch (err) {
      throw new Error(`${ERROR_DELETE_MOVIE_PRODUCER}: ${err.message}`);
    }
  };
}

module.exports = MoviesProducersService;
