const os = require("os");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { AMBIENTE, PORT } = require("./src/includes/Constants");
const { processCSV, populateDatabase } = require("./src/services/CSVService");

const app = express();
app.use(bodyParser.json({ limit: "2048mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "2048mb" }));

app.use(cors("*"));

(async () => {
  if (require.main === module) {
    try {
      console.log("Populando banco de dados...");
      const moviesData = await processCSV("./src/data/movielist.csv");
      await populateDatabase(moviesData);
      console.log("Banco de dados populado com sucesso!");
    } catch (error) {
      console.error("Erro ao processar o CSV:", error);
    }
  }
})();

//#region routes
//Movies
const moviesRoutes = require("./src/routes/moviesRoutes");
app.use("/api/movies", moviesRoutes);

//Producers
const producersRoutes = require("./src/routes/producersRoutes");
app.use("/api/producers", producersRoutes);

//MoviesProducers
const moviesProducersRoutes = require("./src/routes/moviesProducersRoutes");
app.use("/api/movies-producers", moviesProducersRoutes);

//#endregion

//#region Inicialização do Servidor
let ambiente = AMBIENTE;
app.get("/", (req, res) => {
  const hostname = os.hostname();
  return res
    .status(200)
    .json(
      `Página Inicial - Ambiente de '${ambiente}' (${hostname}) - Version 1.00`
    );
});

if (require.main === module) {
  let port = PORT || 3000;
  app.listen(port, function () {
    console.log(`Servidor rodando na porta ${port}`);
  });
}
//#endregion

module.exports = app;
