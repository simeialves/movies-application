const request = require("supertest");
const app = require("../server");

const { processCSV, populateDatabase, db } = require("../config/db");

describe("Testes de Integração - Criar e Popular Banco de Dados a partir do CSV", () => {
  beforeAll(async () => {
    const moviesData = await processCSV("./src/data/movielist.csv");
    await populateDatabase(moviesData);
  });

  it("Deve retornar todos os filmes e verificar se o arquivo JSON está de acordo com o esperado", async () => {
    const response = await request(app).get("/api/movies");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    const movie = response.body[0];
    expect(movie).toHaveProperty("year");
    expect(movie).toHaveProperty("title");
    expect(movie).toHaveProperty("studios");
    expect(movie).toHaveProperty("winner");
  });
});

describe("Testes de Integração - Movies", () => {
  it("Deverá inserir um novo filme via POST e retornar status 201", async () => {
    const newMovie = {
      year: 1985,
      title: "De Volta Para o Futuro",
      studios: "Universal Studios",
      winner: 0,
    };

    const response = await request(app).post("/api/movies").send(newMovie);

    expect(response.status).toBe(201);
  });

  it("Deverá inserir um novo filme via POST retornar status 201 e consultar o filme inserido", async () => {
    const newMovie = {
      year: 1985,
      title: "De Volta Para o Futuro",
      studios: "Universal Studios",
      winner: 0,
    };

    const response = await request(app).post("/api/movies").send(newMovie);

    expect(response.status).toBe(201);

    const movieId = response.body.id;

    const movieResponse = await request(app).get(`/api/movies/${movieId}`);

    expect(movieResponse.body.year).toBe(newMovie.year);
    expect(movieResponse.body.title).toBe(newMovie.title);
    expect(movieResponse.body.studios).toBe(newMovie.studios);
    expect(movieResponse.body.winner).toBe(newMovie.winner);
  });

  it("Deverá tentar atualizar um filme com ID inexistente via PUT e retornar o status 404", async () => {
    const movieId = 9999;

    const updatedMovie = {
      year: 1985,
      title: "De Volta Para o Futuro",
      studios: "Universal Studios",
      winner: 0,
    };

    const response = await request(app)
      .put(`/api/movies/${movieId}`)
      .send(updatedMovie);

    expect(response.status).toBe(404);
  });

  it("Deverá tentar apagar um filme com ID inexistente via DELETE e retornar o status 404", async () => {
    const movieId = 9999;

    const response = await request(app).delete(`/api/movies/${movieId}`);

    expect(response.status).toBe(404);
  });

  it("Deverá inserir um novo filme, retornar o status 201, consultar o filme inserido, atualizar o nome do filme, e consultar se o nome foi atualizado", async () => {
    const newMovie = {
      year: 1985,
      title: "De Volta Para o Futuro",
      studios: "Universal Studios",
      winner: 0,
    };

    const response = await request(app).post("/api/movies").send(newMovie);

    expect(response.status).toBe(201);

    const movieId = response.body.id;

    const movieResponse = await request(app).get(`/api/movies/${movieId}`);

    expect(movieResponse.body.year).toBe(newMovie.year);
    expect(movieResponse.body.title).toBe(newMovie.title);
    expect(movieResponse.body.studios).toBe(newMovie.studios);
    expect(movieResponse.body.winner).toBe(newMovie.winner);

    const updatedMovie = {
      year: 1985,
      title: "De Volta Para o Futuro 2",
      studios: "Universal Studios",
      winner: 0,
    };

    const updatedResponse = await request(app)
      .put(`/api/movies/${movieId}`)
      .send(updatedMovie);

    expect(updatedResponse.status).toBe(200);

    const updatedMovieResponse = await request(app).get(
      `/api/movies/${movieId}`
    );

    expect(updatedMovieResponse.body.year).toBe(updatedMovie.year);
    expect(updatedMovieResponse.body.title).toBe(updatedMovie.title);
    expect(updatedMovieResponse.body.studios).toBe(updatedMovie.studios);
    expect(updatedMovieResponse.body.winner).toBe(updatedMovie.winner);
  });

  it("Deverá inserir um novo filme, retornar o status 201, consultar o filme inserido, apagar o filme criado e receber o status 200, e consultar o filme apagado pelo id e retornar o status 404", async () => {
    const newMovie = {
      year: 1985,
      title: "De Volta Para o Futuro",
      studios: "Universal Studios",
      winner: 0,
    };

    const response = await request(app).post("/api/movies").send(newMovie);

    expect(response.status).toBe(201);

    const movieId = response.body.id;

    const movieResponse = await request(app).get(`/api/movies/${movieId}`);

    expect(movieResponse.body.year).toBe(newMovie.year);
    expect(movieResponse.body.title).toBe(newMovie.title);
    expect(movieResponse.body.studios).toBe(newMovie.studios);
    expect(movieResponse.body.winner).toBe(newMovie.winner);

    const deletedResponse = await request(app).delete(`/api/movies/${movieId}`);

    expect(deletedResponse.status).toBe(200);

    const deletedMovieResponse = await request(app).get(
      `/api/movies/${movieId}`
    );

    expect(deletedMovieResponse.status).toBe(404);
  });
});
