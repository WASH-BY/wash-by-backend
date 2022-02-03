const carSubscriptionModel = require("../models/CarSubscriptionDetails");
const Users = require("../models/UserModel");
const APIFeatures = require("../utils/APIFeatures");
const Cars = require("../models/CarModel");
const Daterange = require("../middleware/DateRange");

//TODO:image upload to be done

const carSubscriptionController = {
  createSubscription: async (req, res) => {
    try {
      let planChosen = req.body.subscriptionChosen;
      let step;

      if (planChosen === "premium") {
        step = 1;
      } else if (planChosen === "recommended") {
        step = 2;
      } else {
        step = 3;
      }

      if (
        new Date(req.body.subscriptionStartDate) >
        new Date(req.body.subscriptionEndDate)
      )
        return res.status(500).json({
          success: false,
          message: "Start date cannot be greater than end date",
        });

      //To get the list of dates between the provided range
      const dates = Daterange(
        req.body.subscriptionStartDate,
        req.body.subscriptionEndDate,
        step
      );

      const doesUserAlreadyHaveSubscription = await Users.find({
        _id: req.user.id,
      }).select("-password -createdAt -updatedAt -__v");

      let subscriptionExists;

      /*Check for Subscription details only if the user has subscription object
      ,i.e ususally the user will have a subscription object 
      only after a subscription has been created */

      let carArray = [];
      if (doesUserAlreadyHaveSubscription[0].subscriptionDetails) {
        doesUserAlreadyHaveSubscription[0].subscriptionDetails.map(
          async (data) => {
            subscriptionExists = await carSubscriptionModel
              .findById({
                _id: data,
              })
              .populate("carDetails");

            carArray.push(subscriptionExists.carDetails[0]);
          }
        );
      }

      if (subscriptionExists) {
        if (
          new Date(req.body.subscriptionStartDate) <
          new Date(subscriptionExists.subscriptionEndDate)
        )
          return res.status(500).json({
            success: false,
            message: `A new subscription cannot be created as your new subscription's start date is in range between your previous subscriptions start and end date`,
          });
      }

      const {
        subscriptionChosen,
        subscriptionStartDate,
        subscriptionEndDate,
        numberOfMonthsChosen,
        isSubscriptionActive,
        carId,
      } = req.body;

      //will not allow the user to create a new subscription if he has not passed the carId parameter

      if (!carId)
        return res.status(500).json({
          success: false,
          message:
            "Subscription cannot be created as you have not passed the carId",
        });

      // Create subscription when the above middleware is satisfied
      //!Make sure you have the wasing dates before creating a wash
      const createSubscription = await carSubscriptionModel.create({
        subscriptionChosen,
        subscriptionStartDate,
        subscriptionEndDate,
        numberOfMonthsChosen,
        isSubscriptionActive,
        washingDates: dates,
      });

      /*here I update the subscription for the car ,
      to which the user is purchasing the subscription model */

      const CarDetails = await Cars.find({ _id: req.body.carId });
      let updatedSubscription;

      /* In the below API call ,We update the Car Details field,
      by the value which is passed by the user i.e car Id and
      which will be updated accordingly to the subscription model

*/

      if (CarDetails) {
        updatedSubscription = await carSubscriptionModel.findByIdAndUpdate(
          createSubscription._id,
          {
            totalWashes: dates.length,
            totalWashesDone: 0,
            totalWashesLeft: dates.length,
            carOwnerDetails: req.user.id,
            carDetails: CarDetails,
          },
          { new: true, runValidators: true }
        );
      } else {
        updatedSubscription = await carSubscriptionModel.findByIdAndUpdate(
          createSubscription._id,
          {
            totalWashes: dates.length,
            totalWashesDone: 0,
            totalWashesLeft: dates.length,
            carOwnerDetails: req.user.id,
          },
          { new: true, runValidators: true }
        );
      }

      const existingSubscriptionsId =
        doesUserAlreadyHaveSubscription[0].subscriptionDetails;
      existingSubscriptionsId.push(updatedSubscription);

      const uniqueSubscription = [...new Set(existingSubscriptionsId)];

      await Users.findByIdAndUpdate(
        req.user.id,
        { subscriptionDetails: uniqueSubscription },
        { new: true, runValidators: true }
      );

      res.status(201).json({ success: true, data: updatedSubscription });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  getSubscription: async (req, res) => {
    try {
      /* Here we fetch the subscription and then
      populate the car details with the subscription data
      */

      const subscription = new APIFeatures(
        carSubscriptionModel
          .find()
          .select("-updatedAt -__v -createdAt")
          .populate(
            "carDetails carOwnerDetails",
            `carCompanyName carModelName carNumber
             carModelYear carLocation carApartmentName 
             carOwnerFlatorHouseNumber carOwnerPhoneNumber
             name email`
          ),
        req.query
      )
        .paginating()
        .filtering()
        .sorting()
        .searching();

      const result = await Promise.allSettled([
        subscription.query,
        carSubscriptionModel.countDocuments(), //count number of subscription
      ]);

      const SubscriptionData =
        result[0].status === "fulfilled" ? result[0].value : [];

      const count = result[1].status === "fulfilled" ? result[1].value : [];

      res.status(200).json({
        success: true,
        data: { SubscriptionData: SubscriptionData, count },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  updateSubscription: async (req, res) => {
    try {
      const subscriptionExists = await carSubscriptionModel.findById(
        req.params.id
      );
      if (!subscriptionExists)
        return res
          .status(404)
          .json({ success: false, message: "Subscription does not exist" });

      const updateRecipe = await carSubscriptionModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      res.status(200).json({ success: true, data: updateRecipe });
    } catch (err) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  deleteSubscription: async (req, res) => {
    try {
      const subscriptionExists = await carSubscriptionModel.findById(
        req.params.id
      );
      if (!subscriptionExists)
        return res.status(404).json({
          success: false,
          message: "Subscription does not exist to delete",
        });
      await carSubscriptionModel.findByIdAndDelete(req.params.id);

      res.status(200).json({ success: true, data: [] });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = carSubscriptionController;
