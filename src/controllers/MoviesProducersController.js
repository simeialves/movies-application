const MoviesProducersService = require("../services/MoviesProducersService");
const {
  messageFieldsRequired,
  messageNotFound,
  ERROR_CREATE_MOVIE_PRODUCER,
  ERROR_FETCH_MOVIES_PRODUCERS,
  ERROR_FETCH_MOVIE_PRODUCER,
  ERROR_UPDATE_MOVIE_PRODUCER,
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
      const id = await MoviesProducersService.create(movie_id, producer_id);
      res.status(201).json({ id });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: ERROR_CREATE_MOVIE_PRODUCER, message: err.message });
    }
  };
  //#endregion

  //#region READ
  static getAll = async (req, res) => {
    try {
      const rows = await MoviesProducersService.getAll();
      res.status(200).json(rows);
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
      const movieProducer = await MoviesProducersService.getById(id);
      if (!movieProducer) {
        return res.status(404).json({
          message: messageNotFound("MovieProducer", id),
        });
      }
      res.status(200).json(movieProducer);
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
      const updated = await MoviesProducersService.update(
        id,
        movie_id,
        producer_id
      );

      if (!updated) {
        return res.status(404).json({
          message: messageNotFound("MovieProducer", id),
        });
      }

      res.status(200).json({ id });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: ERROR_UPDATE_MOVIE_PRODUCER, message: err.message });
    }
  };
  //#endregion

  //#region DELETE
  static delete = async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await MoviesProducersService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          message: messageNotFound("MovieProducer", id),
        });
      }

      res.status(200).json({ id });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };
  //#endregion
}

module.exports = MoviesProducersController;
