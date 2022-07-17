const express = require("express");
const auth = require("../../middleware/auth");
const staffRouter = express.Router();
const staffController = require("../../controllers/SchoolControllers/staffController");
staffRouter.route("/createPrincipal").post(staffController.createPrincipal);
staffRouter.route("/getPrincipal/:id").get(staffController.getPrincipal);

module.exports = staffRouter;
