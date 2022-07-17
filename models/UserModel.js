const Mongoose = require("mongoose");
// Schema for User
const UserSchema = new Mongoose.Schema(
  {
    name: {
      type: "string",
      trim: true,
      lowercase: true,
      required: [true, "Please enter you user name"],
    },
    email: {
      type: "string",
      unique: true,
      trim: true,
      required: [true, "Please enter your email address"],
    },
    password: {
      type: "string",
      required: [true, "Please enter you password"],
      minLength: 8,
    },
    isAdmin: {
      type: "boolean",
      default: false,
    },
    followers: [{ type: Mongoose.Types.ObjectId, ref: "Users" }],
    following: [{ type: Mongoose.Types.ObjectId, ref: "Users" }],
    userType: {
      type: "string",
      required: [
        true,
        "Please enter one among the following ,1.Admin,2:Washer(if you wash the car),3:User by default",
      ],
      default: "User",
      lowercase: true,
    },
    subscriptionDetails: [
      {
        type: Mongoose.Types.ObjectId,
        ref: "carSubscriptionDetails",
      },
    ],
    isWasher: { type: Boolean, default: false },
    carDetails: [{ type: Mongoose.Types.ObjectId, ref: "cars" }],
    profileImage: { type: String },
  },
  { timestamps: Date.now }
);

module.exports = Mongoose.model("Users", UserSchema);
