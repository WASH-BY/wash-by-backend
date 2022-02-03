const mongoose = require("mongoose");

/* Once the car details have been loaded by user,
We will create a subscription for that car associated to a particular user */

const carSubscriptionDetails = new mongoose.Schema(
  {
    carDetails: [{ type: mongoose.Types.ObjectId, ref: "cars" }],
    carWasherDetails: [{ type: mongoose.Types.ObjectId, ref: "carWash" }],
    carOwnerDetails: { type: mongoose.Types.ObjectId, ref: "Users" },
    subscriptionChosen: {
      type: String,
      required: [
        true,
        "Please select one among Starter,Recommended and Premium",
      ],
      lowercase: true,
    },
    subscriptionStartDate: {
      type: Date,
      required: [true, "Please enter a valid start date"],
    },
    subscriptionEndDate: {
      type: Date,
      required: [true, "Please enter a valid end date"],
    },
    numberOfMonthsChosen: {
      type: String,
      required: [true, "Please enter the number of months"],
    },
    totalWashes: {
      type: Number,
    },
    totalWashesDone: {
      type: Number,
    },
    totalWashesLeft: {
      type: Number,
    },
    isSubscriptionActive: { type: Boolean },
    washingDates: { type: Array },
  },
  { timestamps: Date.now }
);

module.exports = mongoose.model(
  "carSubscriptionDetails",
  carSubscriptionDetails
);
