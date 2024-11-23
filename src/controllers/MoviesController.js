const {
  ERROR_CREATE_MOVIE,
  ERROR_FETCH_MOVIES,
  ERROR_FETCH_MOVIE,
  ERROR_UPDATE_MOVIE,
  ERROR_DELETE_MOVIE,
  messageNotFound,
  messageFieldsRequired,
} = require("../includes/Messages");
const MoviesService = require("../services/MoviesService");

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
      const id = await MoviesService.create({
        year,
        title,
        studios,
        winner,
      });
      res.status(201).json({ id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: ERROR_CREATE_MOVIE, message: err.message });
    }
  };
  //#endregion

  //#region READ
  static getAll = async (req, res) => {
    try {
      const movies = await MoviesService.getAll();
      res.status(200).json(movies);
    } catch (err) {
      res.status(500).json({
        message: ERROR_FETCH_MOVIES,
        error: err.message,
      });
    }
  };

  static getById = async (req, res) => {
    const { id } = req.params;

    try {
      const movie = await MoviesService.getById(id);

      if (!movie) {
        return res.status(404).json({
          message: messageNotFound("Movie", id),
        });
      }

      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json({
        error: ERROR_FETCH_MOVIE,
        message: err.message,
      });
    }
  };
  //#endregion

  //#region UPDATE
  static update = async (req, res) => {
    const { id } = req.params;
    const { year, title, studios, winner } = req.body;

    try {
      const updated = await MoviesService.update(id, {
        year,
        title,
        studios,
        winner,
      });

      if (!updated) {
        return res.status(404).json({
          message: messageNotFound("Movie", id),
        });
      }

      res.status(200).json({ id });
    } catch (err) {
      res.status(500).json({
        message: ERROR_UPDATE_MOVIE,
        error: err.message,
      });
    }
  };
  //#endregion

  //#region DELETE
  static delete = async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await MoviesService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          message: messageNotFound("Movie", id),
        });
      }

      res.status(200).json({ id });
    } catch (err) {
      res.status(500).json({
        message: ERROR_DELETE_MOVIE,
        error: err.message,
      });
    }
  };
  //#endregion
}

module.exports = MovieController;
