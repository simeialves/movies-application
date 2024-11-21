const { db } = require("../config/db");
const {
  ERROR_CREATE_MOVIE_PRODUCER,
  ERROR_FETCH_MOVIES_PRODUCERS,
  ERROR_FETCH_MOVIE_PRODUCER,
  ERROR_UPDATE_MOVIE_PRODUCER,
  ERROR_DELETE_MOVIE_PRODUCER,
  messageFieldsRequired,
  messageNotFound,
} = require("../includes/Messages");

class MoviesProducersController {
  //#region CREATE
  static create = async (req, res) => {
    const { movie_id, producer_id } = req.body;

    if (!movie_id || !producer_id) {
      const fields = [];
      if (!movie_id) fields.push("movie_id");
      if (!producer_id) fields.push("producer_id");

      return res.status(400).json({
        message: messageFieldsRequired(fields),
      });
    }

    try {
      db.run(
        `INSERT INTO movies_producers (movie_id, producer_id) VALUES (?, ?)`,
        [movie_id, producer_id],
        function (err) {
          if (err) {
            console.error(err);
            res.status(500).json({
              error: ERROR_CREATE_MOVIE_PRODUCER,
              message: err.message,
            });
          } else {
            res.status(201).json({ id: this.lastID });
          }
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: ERROR_CREATE_MOVIE, message: err.message });
    }
  };
  //#endregion

  //#region READ
  static getAll = async (req, res) => {
    try {
      db.all("SELECT * FROM movies_producers", [], (err, rows) => {
        if (err) {
          res.status(500).json({
            message: ERROR_FETCH_MOVIES_PRODUCERS,
            error: err.message,
          });
        } else {
          res.status(200).json(rows);
        }
      });
    } catch (err) {
      res.status(500).json({
        error: ERROR_FETCH_MOVIES_PRODUCERS,
        message: err.message,
      });
    }
  };

  static getById = async (req, res) => {
    const { id } = req.params;
    try {
      db.get(
        "SELECT * FROM movies_producers WHERE id = ?",
        [id],
        (err, row) => {
          if (err) {
            res.status(500).json({
              message: ERROR_FETCH_MOVIE_PRODUCER,
              error: err.message,
            });
          } else if (!row) {
            res.status(404).json({
              message: messageNotFound("MovieProducer", id),
            });
          } else {
            res.status(200).json(row);
          }
        }
      );
    } catch (err) {
      res.status(500).json({
        error: ERROR_FETCH_MOVIE_PRODUCER,
        message: err.message,
      });
    }
  };

  //#endregion

  //#region UPDATE
  static update = async (req, res) => {
    const { id } = req.params;
    const { movie_id, producer_id } = req.body;

    try {
      const movieProducer = await new Promise((resolve, reject) => {
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

      if (!movieProducer) {
        return res.status(404).json({
          message: messageNotFound("MovieProducer", id),
        });
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
        return res.status(404).json({
          message: messageNotFound("Movie", id),
        });
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
        return res.status(404).json({
          message: messageNotFound("Producer", id),
        });
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

      res.json({ id });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: `${ERROR_UPDATE_MOVIE_PRODUCER} - ${err.message}`,
      });
    }
  };
  //#endregion

  //#region DELETE
  static delete = async (req, res) => {
    const { id } = req.params;

    try {
      const movie = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        });
      });

      if (!movie) {
        return res.status(404).json({
          message: messageNotFound("MovieProducer", id),
        });
      }

      await new Promise((resolve, reject) => {
        db.run(`DELETE FROM movies WHERE id = ?`, [id], function (err) {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });

      res.json({ id });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: `${ERROR_DELETE_MOVIE_PRODUCER} - ${error.message}`,
      });
    }
  };
  //#endregion
}

module.exports = {
  MoviesProducersController,
};
