const request = require("supertest");
const app = require("../server");
const { processCSV, populateDatabase } = require("../config/db");

describe("Testes de Integração - Producers", () => {
  beforeAll(async () => {
    const moviesData = await processCSV("./src/data/movielist.csv");
    await populateDatabase(moviesData);
  });

  it("Deverá retornar todos os produtores e verificar se o arquivo JSON está de acordo com o esperado", async () => {
    const response = await request(app).get("/api/producers");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    const producer = response.body[0];

    expect(producer).toHaveProperty("id");
    expect(producer).toHaveProperty("name");
  });

  it("Deverá criar um novo produtor a partir do método POST", async () => {
    const newProducer = {
      name: "Simei Alves",
    };

    const response = await request(app)
      .post("/api/producers")
      .send(newProducer);

    expect(response.status).toBe(201);
  });

  it("Deverá criar um novo produtor e ao criar o segundo com o mesmo nome deverá retornar status 400", async () => {
    const newProducer1 = {
      name: "Simei Alves",
    };

    const response = await request(app)
      .post("/api/producers")
      .send(newProducer1);

    expect(response.status).toBe(201);

    const newProducer2 = {
      name: "Simei Alves",
    };

    const response2 = await request(app)
      .post("/api/producers")
      .send(newProducer2);

    expect(response2.status).toBe(400);
  });

  it("Deverá criar novos filmes, novos produtores, a relação entre eles e verificar se a rota /producers/intervals está funcionando corretamente", async () => {
    //Produtor 01
    const newProducer1 = {
      name: "Paul Bales",
    };

    const responseProducer1 = await request(app)
      .post("/api/producers")
      .send(newProducer1);

    expect(responseProducer1.status).toBe(201);

    //Produtor 02
    const newProducer2 = {
      name: "Lereby Produções",
    };

    const responseProducer2 = await request(app)
      .post("/api/producers")
      .send(newProducer2);

    expect(responseProducer2.status).toBe(201);

    //Produtor 03
    const newProducer3 = {
      name: "Avi Arad",
    };

    const responseProducer3 = await request(app)
      .post("/api/producers")
      .send(newProducer3);

    expect(responseProducer3.status).toBe(201);

    //Produtor 04
    const newProducer4 = {
      name: "Joe Simon",
    };

    const responseProducer4 = await request(app)
      .post("/api/producers")
      .send(newProducer4);

    expect(responseProducer4.status).toBe(201);

    //Filme 01
    const newMovie1 = {
      year: 2012,
      title: "Sharknado",
      studios: "The Asylum",
      winner: true,
    };

    const responseMovie1 = await request(app)
      .post("/api/movies")
      .send(newMovie1);

    expect(responseMovie1.status).toBe(201);

    //Filme 02
    const newMovie2 = {
      year: 2015,
      title: "2010: Moby Dick",
      studios: "Iron Studios",
      winner: true,
    };

    const responseMovie2 = await request(app)
      .post("/api/movies")
      .send(newMovie2);

    expect(responseMovie2.status).toBe(201);

    //Filme 03
    const newMovie3 = {
      year: 2007,
      title: "Os Porralokinhas",
      studios: "Globo Filmes",
      winner: true,
    };

    const responseMovie3 = await request(app)
      .post("/api/movies")
      .send(newMovie3);

    expect(responseMovie3.status).toBe(201);

    //Filme 04
    const newMovie4 = {
      title: "Pobre Príncipe Encantado",
      year: 2000,
      studios: "Globo Filmes",
      winner: true,
    };

    const responseMovie4 = await request(app)
      .post("/api/movies")
      .send(newMovie4);

    expect(responseMovie4.status).toBe(201);

    //Filme 05
    const newMovie5 = {
      title: "Capitão América",
      year: 2009,
      studios: "Marvel Comics",
      winner: false,
    };

    const responseMovie5 = await request(app)
      .post("/api/movies")
      .send(newMovie5);

    expect(responseMovie5.status).toBe(201);

    //Filme 06
    const newMovie6 = {
      title: "Homem de Ferro",
      year: 2008,
      studios: "Marvel Comics",
      winner: false,
    };

    const responseMovie6 = await request(app)
      .post("/api/movies")
      .send(newMovie6);

    expect(responseMovie6.status).toBe(201);

    //Filme 07
    const newMovie7 = {
      title: "Os Bad Boys",
      year: 1995,
      studios: "Sony Pictures",
      winner: false,
    };

    const responseMovie7 = await request(app)
      .post("/api/movies")
      .send(newMovie7);

    expect(responseMovie7.status).toBe(201);

    //Filme 08
    const newMovie8 = {
      title: "Bad Boys 4",
      year: 2024,
      studios: "Sony Pictures",
      winner: false,
    };

    const responseMovie8 = await request(app)
      .post("/api/movies")
      .send(newMovie8);

    expect(responseMovie8.status).toBe(201);

    //Movie-Producer01
    const newMovieProducer1 = {
      movie_id: responseMovie1.body.id,
      producer_id: responseProducer1.body.id,
    };

    const responseMovieProducer1 = await request(app)
      .post("/api/movies-producers")
      .send(newMovieProducer1);

    expect(responseMovieProducer1.status).toBe(201);

    //Movie-Producer02
    const newMovieProducer2 = {
      movie_id: responseMovie2.body.id,
      producer_id: responseProducer1.body.id,
    };

    const responseMovieProducer2 = await request(app)
      .post("/api/movies-producers")
      .send(newMovieProducer2);

    expect(responseMovieProducer2.status).toBe(201);

    //Movie-Producer03
    const newMovieProducer3 = {
      movie_id: responseMovie3.body.id,
      producer_id: responseProducer2.body.id,
    };

    const responseMovieProducer3 = await request(app)
      .post("/api/movies-producers")
      .send(newMovieProducer3);

    expect(responseMovieProducer3.status).toBe(201);

    //Movie-Producer04
    const newMovieProducer4 = {
      movie_id: responseMovie4.body.id,
      producer_id: responseProducer2.body.id,
    };

    const responseMovieProducer4 = await request(app)
      .post("/api/movies-producers")
      .send(newMovieProducer4);

    expect(responseMovieProducer4.status).toBe(201);

    //Movie-Producer05
    const newMovieProducer5 = {
      movie_id: responseMovie5.body.id,
      producer_id: responseProducer3.body.id,
    };

    const responseMovieProducer5 = await request(app)
      .post("/api/movies-producers")
      .send(newMovieProducer5);

    expect(responseMovieProducer5.status).toBe(201);

    //Movie-Producer06
    const newMovieProducer6 = {
      movie_id: responseMovie6.body.id,
      producer_id: responseProducer3.body.id,
    };

    const responseMovieProducer6 = await request(app)
      .post("/api/movies-producers")
      .send(newMovieProducer6);

    expect(responseMovieProducer6.status).toBe(201);

    //Movie-Producer07
    const newMovieProducer7 = {
      movie_id: responseMovie7.body.id,
      producer_id: responseProducer4.body.id,
    };

    const responseMovieProducer7 = await request(app)
      .post("/api/movies-producers")
      .send(newMovieProducer7);

    expect(responseMovieProducer7.status).toBe(201);

    //Movie-Producer08
    const newMovieProducer8 = {
      movie_id: responseMovie8.body.id,
      producer_id: responseProducer4.body.id,
    };

    const responseMovieProducer8 = await request(app)
      .post("/api/movies-producers")
      .send(newMovieProducer8);

    expect(responseMovieProducer8.status).toBe(201);

    //Intervals
    const responseInverval = await request(app).get("/api/producers/intervals");
    expect(responseInverval.status).toBe(200);
    expect(responseInverval.body).toBeInstanceOf(Object);

    const min = responseInverval.body.min;
    const max = responseInverval.body.max;

    const expectedMin = [
      {
        producer: "Paul Bales",
        interval: 3,
        previousWin: 2012,
        followingWin: 2015,
      },
    ];

    const expectedMax = [
      {
        producer: "Lereby Produções",
        interval: 7,
        previousWin: 2000,
        followingWin: 2007,
      },
    ];

    expect(min).toEqual(expectedMin);
    expect(max).toEqual(expectedMax);
  });
});
