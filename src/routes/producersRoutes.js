const express = require("express");
const cors = require("cors");
const appRoutes = express.Router();
const bodyParser = require("body-parser");
const { ProducerController } = require("../controllers/ProducersController");

appRoutes.use(cors("*"));
appRoutes.use(bodyParser.json());

//#region CREATE
appRoutes.post("/", ProducerController.create);
//#endregion

//#region READ
appRoutes.get("/intervals", ProducerController.getIntervals);
appRoutes.get("/:id", ProducerController.getById);
appRoutes.get("/", ProducerController.getAll);
//#endregion

//#region UPDATE
appRoutes.put("/:id", ProducerController.update);
//#endregion

//#region DELETE
appRoutes.delete("/:id", ProducerController.delete);
//#endregion

module.exports = appRoutes;
