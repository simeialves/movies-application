const { db } = require("../config/db");
const {
  ERROR_CREATE_MOVIE,
  ERROR_FETCH_MOVIES,
  ERROR_FETCH_MOVIE,
  ERROR_UPDATE_MOVIE,
  ERROR_DELETE_MOVIE,
  messageNotFound,
  messageFieldsRequired,
} = require("../includes/Messages");

class MovieController {
  //#region CREATE
  static create = async (req, res) => {
    const { year, title, studios, winner } = req.body;

    if (!year || !title || !studios || winner === undefined) {
      const fields = [];
      if (!year) fields.push("year");
      if (!title) fields.push("title");
      if (!studios) fields.push("studios");
      if (winner === undefined) fields.push("winner");

      return res.status(400).json({
        message: messageFieldsRequired(fields),
      });
    }

    try {
      db.run(
        `INSERT INTO movies (year, title, studios, winner) VALUES (?, ?, ?, ?)`,
        [year, title, studios, winner],
        function (err) {
          if (err) {
            console.error(err);
            res
              .status(500)
              .json({ error: ERROR_CREATE_MOVIE, message: err.message });
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
      db.all("SELECT * FROM movies", [], (err, rows) => {
        if (err) {
          res.status(500).json({
            message: ERROR_FETCH_MOVIES,
            error: err.message,
          });
        } else {
          res.status(200).json(rows);
        }
      });
    } catch (err) {
      res.status(500).json({
        error: ERROR_FETCH_MOVIES,
        message: err.message,
      });
    }
  };

  static getById = async (req, res) => {
    const { id } = req.params;
    try {
      db.get("SELECT * FROM movies WHERE id = ?", [id], (err, row) => {
        if (err) {
          res.status(500).json({
            message: ERROR_FETCH_MOVIE,
            error: err.message,
          });
        } else if (!row) {
          res.status(404).json({
            message: messageNotFound("Movie", id),
          });
        } else {
          res.status(200).json(row);
        }
      });
    } catch (error) {
      res.status(500).json({
        message: `${ERROR_FETCH_MOVIES} - ${error.message}`,
      });
    }
  };

  //#endregion

  //#region UPDATE
  static update = async (req, res) => {
    const { id } = req.params;
    const { year, title, studios, winner } = req.body;

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
          message: messageNotFound("Movie", id),
        });
      }

      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE movies SET year = ?, title = ?, studios = ?, winner = ? WHERE id = ?`,
          [year, title, studios, winner, id],
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
        message: `${ERROR_UPDATE_MOVIE} - ${err.message}`,
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
          message: messageNotFound("Movie", id),
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
        message: `${ERROR_DELETE_MOVIE} - ${error.message}`,
      });
    }
  };
  //#endregion
}

module.exports = {
  MovieController,
};
