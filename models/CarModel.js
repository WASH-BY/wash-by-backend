const mongoose = require("mongoose");

// A Schema to create the user's car details

const CarSchema = new mongoose.Schema(
  {
    carCompanyName: {
      type: "string",
      required: [
        true,
        "Please enter company name of your car(like Maruti,Hyunai,Benz)",
      ],
      minLength: 3,
    },
    carModelName: {
      type: "string",
      required: [true, "Please enter your car model(like Swift,Innova)"],
      lowercase: true,
    },
    carNumber: {
      type: "string",
      required: [true, "Please enter your car number"],
      unique: true,
      lowercase: true,
    },
    carModelYear: {
      type: "string",
      required: [true, "Please enter the year the car was bought"],
    },
    user: { type: mongoose.Types.ObjectId, ref: "Users", required: true },
    carLocation: {
      type: "string",
      required: [true, "Please enter the location where the car is located"],
    },
    carApartmentName: { type: "string" },
    carOwnerFlatorHouseNumber: {
      type: "string",
      required: [true, "Please enter your house number"],
    },
    carOwnerPhoneNumber: {
      type: "number",
      required: [true, "Please enter your phone number"],
    },
    carParkingNumber: { type: "String" },
  },
  { timestamps: Date.now }
);

module.exports = mongoose.model("cars", CarSchema);
