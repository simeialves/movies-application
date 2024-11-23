const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const os = require("os");

const { AMBIENTE } = require("./includes/Constants");

const app = express();

app.use(bodyParser.json({ limit: "2048mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "2048mb" }));
app.use(cors("*"));

app.get("/", (req, res) => {
  const hostname = os.hostname();
  return res
    .status(200)
    .json(
      `Página Inicial - Ambiente de '${AMBIENTE}' (${hostname}) - Version 1.00`
    );
});

// Rotas
const moviesRoutes = require("./routes/moviesRoutes");
const producersRoutes = require("./routes/producersRoutes");
const moviesProducersRoutes = require("./routes/moviesProducersRoutes");

app.use("/api/movies", moviesRoutes);
app.use("/api/producers", producersRoutes);
app.use("/api/movies-producers", moviesProducersRoutes);

module.exports = app;
