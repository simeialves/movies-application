const request = require("supertest");
const app = require("../server");
const { processCSV, populateDatabase } = require("../src/services/CSVService");

describe("Testes de Integração - MoviesProducers", () => {
  beforeAll(async () => {
    const moviesData = await processCSV("./src/data/movielist.csv");
    await populateDatabase(moviesData);
  });

  it("Deverá retornar toda a relaçao entre filmes e produtores e verificar se o arquivo JSON está de acordo com o esperado", async () => {
    const response = await request(app).get("/api/movies-producers");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    const movie = response.body[0];
    expect(movie).toHaveProperty("id");
    expect(movie).toHaveProperty("movie_id");
    expect(movie).toHaveProperty("producer_id");
  });
});
