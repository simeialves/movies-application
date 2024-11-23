const ProducersService = require("../services/ProducersService");
const {
  ERROR_CREATE_PRODUCER,
  ERROR_FETCH_PRODUCERS,
  ERROR_FETCH_PRODUCER,
  ERROR_UPDATE_PRODUCER,
  ERROR_DELETE_PRODUCER,
  ERROR_INTERNAL_SERVER,
  messageFieldsRequired,
  messageRegisterAlreadyExists,
  messageNotFound,
} = require("../includes/Messages");

class ProducerController {
  //#region CREATE
  static create = async (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: messageFieldsRequired(["name"]),
      });
    }

    try {
      const existingProducer = await ProducersService.getByName(name);

      if (existingProducer) {
        return res.status(400).json({
          message: messageRegisterAlreadyExists("Producer", name),
        });
      }

      const id = await ProducersService.create({ name });
      res.status(201).json({ id });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: ERROR_CREATE_PRODUCER, message: err.message });
    }
  };
  //#endregion

  //#region READ
  static getAll = async (req, res) => {
    try {
      const producers = await ProducersService.getAll();
      res.status(200).json(producers);
    } catch (err) {
      res.status(500).json({
        error: ERROR_FETCH_PRODUCERS,
        message: err.message,
      });
    }
  };

  static getById = async (req, res) => {
    const { id } = req.params;
    try {
      const producer = await ProducersService.getById(id);

      if (!producer) {
        return res.status(404).json({
          message: messageNotFound("Producer", id),
        });
      }

      res.status(200).json(producer);
    } catch (err) {
      res.status(500).json({
        error: ERROR_FETCH_PRODUCER,
        message: err.message,
      });
    }
  };

  static getIntervals = async (req, res) => {
    try {
      const intervals = await ProducersService.getIntervals();

      if (intervals.length === 0) {
        return res.json({ min: [], max: [] });
      }

      const minInterval = intervals[0].interval;
      const maxInterval = intervals[intervals.length - 1].interval;

      const min = intervals.filter((row) => row.interval === minInterval);
      const max = intervals.filter((row) => row.interval === maxInterval);

      res.status(200).json({ min, max });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: ERROR_INTERNAL_SERVER });
    }
  };
  //#endregion

  //#region UPDATE
  static update = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const producer = await ProducersService.getById(id);

      if (!producer) {
        return res.status(404).json({
          message: messageNotFound("Producer", id),
        });
      }

      const nameConflict = await ProducersService.getByName(name, id);

      if (nameConflict) {
        return res.status(400).json({
          message: messageRegisterAlreadyExists("Producer", name),
        });
      }

      const success = await ProducersService.update(id, { name });
      res.status(200).json({ success });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: ERROR_UPDATE_PRODUCER, message: err.message });
    }
  };
  //#endregion

  //#region DELETE
  static delete = async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await ProducersService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          message: messageNotFound("Producer", id),
        });
      }

      res.status(200).json({ id });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: ERROR_DELETE_PRODUCER, message: err.message });
    }
  };
  //#endregion
}

module.exports = {
  ProducerController,
};
