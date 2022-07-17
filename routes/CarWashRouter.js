//CAR WASH ROUTES

const express = require("express");
const carWashRouter = express.Router();
const carWashController = require("../controllers/carWashController");
const auth = require("../middleware/auth");
const { upload } = require("../utils/Multer");

carWashRouter.route("/createWash").post(auth, carWashController.createCarWash);
carWashRouter
  .route("/updateWashByWasher/:id")
  .put(auth, upload.array("images"), carWashController.updateCarWashByWasher);
carWashRouter
  .route("/endCarWash/:id")
  .put(
    auth,
    upload.array("images"),
    carWashController.upDateCarWashingOnCompletion
  );
carWashRouter
  .route("/deleteCarWash/:id")
  .delete(auth, carWashController.deleteCarWash);
carWashRouter.route("/getCarWashes").get(auth, carWashController.getCarWashes);
carWashRouter
  .route("/createCarWashesManually")
  .get(auth, carWashController.createCarWashManually);

carWashRouter
  .route("/endWashByUser")
  .post(auth, carWashController.completeCarWashByUser);

module.exports = carWashRouter;
