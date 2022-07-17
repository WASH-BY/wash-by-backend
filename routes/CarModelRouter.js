// CAR CREATION,UPDATION AND DELETION ROUTES

const express = require("express");
const auth = require("../middleware/auth");
const carRouter = express.Router();
const carModelController = require("../controllers/carModelController");

carRouter.route("/create").post(auth, carModelController.createCar);
carRouter.route("/getCars").get(auth, carModelController.getCars);
carRouter.route("/updateCar/:id").put(auth, carModelController.updateCar);
carRouter.route("/deleteCar/:id").delete(auth, carModelController.deleteCar);

module.exports = carRouter;
