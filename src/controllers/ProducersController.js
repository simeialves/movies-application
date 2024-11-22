const { db } = require("../config/db");
const {
  ERROR_CREATE_PRODUCER,
  ERROR_FETCH_PRODUCERS,
  ERROR_FETCH_PRODUCER,
  ERROR_FETCH_PRODUCER_INTERVALS,
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
      const fields = [];
      if (!name) fields.push("name");

      return res.status(400).json({
        message: messageFieldsRequired(fields),
      });
    }

    const producer = await new Promise((resolve, reject) => {
      db.get("SELECT * FROM producers WHERE name = ?", [name], (err, row) => {
        if (err) {
          reject(err);
        }
        resolve(row);
      });
    });

    if (producer) {
      return res.status(400).json({
        message: messageRegisterAlreadyExists("Producer", name),
      });
    }

    try {
      db.run(`INSERT INTO producers (name) VALUES (?)`, [name], function (err) {
        if (err) {
          console.error(err);
          res
            .status(500)
            .json({ error: ERROR_CREATE_PRODUCER, message: err.message });
        } else {
          res.status(201).json({ id: this.lastID });
        }
      });
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
      db.all("SELECT * FROM producers", [], (err, rows) => {
        if (err) {
          res.status(500).json({
            message: ERROR_FETCH_PRODUCERS,
            error: err.message,
          });
        } else {
          res.status(200).json(rows);
        }
      });
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
      db.get("SELECT * FROM producers WHERE id = ?", [id], (err, row) => {
        if (err) {
          res.status(500).json({
            message: ERROR_FETCH_PRODUCER,
            error: err.message,
          });
        } else if (!row) {
          res.status(404).json({
            message: messageNotFound("Producer", id),
          });
        } else {
          res.status(200).json(row);
        }
      });
    } catch (err) {
      res.status(500).json({
        error: ERROR_FETCH_PRODUCERS,
        message: err.message,
      });
    }
  };

  static getIntervals = async (req, res) => {
    try {
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

      db.all(query, [], (err, rows) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .json({ error: ERROR_FETCH_PRODUCER_INTERVALS });
        }

        if (rows.length === 0) {
          return res.json({ min: [], max: [] });
        }

        const minInterval = rows[0].interval;
        const maxInterval = rows[rows.length - 1].interval;

        const min = rows.filter((row) => row.interval === minInterval);
        const max = rows.filter((row) => row.interval === maxInterval);

        res.json({ min, max });
      });
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
      const producer = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM producers WHERE id = ?", [id], (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        });
      });

      if (!producer) {
        return res.status(404).json({
          message: messageNotFound("Producer", id),
        });
      }

      const nameProducer = await new Promise((resolve, reject) => {
        db.get(
          "SELECT * FROM producers WHERE name = ? and id <> ?",
          [name, id],
          (err, row) => {
            if (err) {
              reject(err);
            }
            resolve(row);
          }
        );
      });

      if (nameProducer) {
        return res.status(400).json({
          message: messageRegisterAlreadyExists("Producer", name),
        });
      }

      await new Promise((resolve, reject) => {
        db.run(
          `UPDATE producers SET name = ? WHERE id = ?`,
          [name, id],
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
      const producer = await new Promise((resolve, reject) => {
        db.get("SELECT * FROM producers WHERE id = ?", [id], (err, row) => {
          if (err) {
            reject(err);
          }
          resolve(row);
        });
      });

      if (!producer) {
        return res.status(404).json({
          message: messageNotFound("Producer", id),
        });
      }

      await new Promise((resolve, reject) => {
        db.run(`DELETE FROM producers WHERE id = ?`, [id], function (err) {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });

      res.json({ id });
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
