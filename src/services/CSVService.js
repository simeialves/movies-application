const fs = require("fs");
const csv = require("csv-parser");
const { db } = require("../config/db");

const processCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const moviesData = [];
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ";" }))
      .on("data", (row) => {
        const { year, title, studios, producers, winner } = row;
        moviesData.push({
          year: parseInt(year, 10),
          title,
          studios,
          producers: producers.split(/, and |,| and /).map((p) => p.trim()),
          winner: winner === "yes",
        });
      })
      .on("end", () => resolve(moviesData))
      .on("error", (error) => reject(error));
  });
};

const populateDatabase = async (movies) => {
  for (const movie of movies) {
    const { year, title, studios, producers, winner } = movie;

    const movieId = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO movies (year, title, studios, winner) VALUES (?, ?, ?, ?)`,
        [year, title, studios, winner],
        function (err) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });

    for (const producerName of producers) {
      const producerId = await new Promise((resolve, reject) => {
        db.run(
          `INSERT OR IGNORE INTO producers (name) VALUES (?)`,
          [producerName],
          function (err) {
            if (err) reject(err);

            db.get(
              `SELECT id FROM producers WHERE name = ?`,
              [producerName],
              (err, row) => {
                if (err) reject(err);
                resolve(row.id);
              }
            );
          }
        );
      });

      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO movies_producers (movie_id, producer_id) VALUES (?, ?)`,
          [movieId, producerId],
          (err) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    }
  }
};

module.exports = { processCSV, populateDatabase };
