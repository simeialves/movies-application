const express = require("express");
const cors = require("cors");
const appRoutes = express.Router();
const bodyParser = require("body-parser");
const MoviesProducersController = require("../controllers/MoviesProducersController");

appRoutes.use(cors("*"));
appRoutes.use(bodyParser.json());

//#region CREATE
appRoutes.post("/", MoviesProducersController.create);
//#endregion

//#region READ
appRoutes.get("/", MoviesProducersController.getAll);
appRoutes.get("/:id", MoviesProducersController.getById);
//#endregion

//#region UPDATE
appRoutes.put("/:id", MoviesProducersController.update);
//#endregion

//#region DELETE
appRoutes.delete("/:id", MoviesProducersController.delete);
//#endregion

module.exports = appRoutes;
