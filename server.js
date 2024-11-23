const app = require("./src/app");
const { PORT } = require("./src/includes/Constants");
const { processCSV, populateDatabase } = require("./src/services/CSVService");

if (require.main === module) {
  (async () => {
    try {
      console.log("Populando banco de dados...");
      const moviesData = await processCSV("./src/data/movielist.csv");
      await populateDatabase(moviesData);
      console.log("Banco de dados populado com sucesso!");
    } catch (error) {
      console.error("Erro ao processar o CSV:", error);
    }
  })();

  const port = PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}
