// CAR SUBSCRIPTION ROUTES

const express = require("express");
const carSubscriptionRouter = express.Router();
const auth = require("../middleware/auth");
const carSubscriptionController = require("../controllers/carSubscriptionController");

carSubscriptionRouter
  .route("/createSubscription")
  .post(auth, carSubscriptionController.createSubscription);
carSubscriptionRouter
  .route("/getsubscription")
  .get(auth, carSubscriptionController.getSubscription);
carSubscriptionRouter
  .route("/deleteSubscription/:id")
  .delete(auth, carSubscriptionController.deleteSubscription);
carSubscriptionRouter
  .route("/updateSubscription/:id")
  .put(auth, carSubscriptionController.updateSubscription);

module.exports = carSubscriptionRouter;
