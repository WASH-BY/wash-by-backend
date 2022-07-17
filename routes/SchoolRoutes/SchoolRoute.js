const express = require("express");
const auth = require("../../middleware/auth");
const schoolRouter = express.Router();
const schoolController = require("../../controllers/SchoolControllers/schoolController");
schoolRouter.route("/create").post(schoolController.createSchool);
schoolRouter.route("/get").get(schoolController.getSchools);
schoolRouter.route("/get/:id").get(schoolController.getSchool);
schoolRouter.route("/update/:id").put(schoolController.updateSchool);
schoolRouter.route("/delete/:id").delete(schoolController.deleteSchool);

module.exports = schoolRouter;
