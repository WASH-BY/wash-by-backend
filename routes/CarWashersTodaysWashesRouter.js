const express = require("express");
const auth = require("../middleware/auth");
const carWashersTodaysWashes = require("../controllers/carWashersTodaysWashesController");
const carWashersTodaysWashesRouter = express.Router();

carWashersTodaysWashesRouter
  .route("/todayscarWashes")
  .get(auth, carWashersTodaysWashes.getMyCarWashesForToday);

  carWashersTodaysWashesRouter
  .route("/createcarWashes")
  .post(auth, carWashersTodaysWashes.createMyCarwashesToday);

module.exports = carWashersTodaysWashesRouter;
