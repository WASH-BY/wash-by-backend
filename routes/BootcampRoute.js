const BootcampRoute = require("../controllers/bootcampController");

const express = require("express");

const router = express.Router();

router
  .route("/")
  .get(BootcampRoute.getAllBootcamps)
  .post(BootcampRoute.createBootcamp);

router
  .route("/:id")
  .put(BootcampRoute.updateBootcamp)
  .delete(BootcampRoute.deleteBootcamp);

module.exports = router;
