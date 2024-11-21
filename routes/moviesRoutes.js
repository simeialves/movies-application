const express = require("express");
const cors = require("cors");
const appRoutes = express.Router();
const bodyParser = require("body-parser");
const { MovieController } = require("../controllers/MoviesController");

appRoutes.use(cors("*"));
appRoutes.use(bodyParser.json());

//#region CREATE
appRoutes.post("/", MovieController.create);
//#endregion

//#region READ
appRoutes.get("/", MovieController.getAll);
appRoutes.get("/:id", MovieController.getById);
//#endregion

//#region UPDATE
appRoutes.put("/:id", MovieController.update);
//#endregion

//#region DELETE
appRoutes.delete("/:id", MovieController.delete);
//#endregion

module.exports = appRoutes;
