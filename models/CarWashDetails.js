const mongoose = require("mongoose");

/*When subscription is bought by the user, 
the next step is creating a car wash and then
i.e when user accepts for a car wash a schema will be generated
Which will have car details scheduled date,start time and end time
 and by default car wash completeed will be false*/

const carWashSchema = new mongoose.Schema(
  {
    carDetails: [{ type: mongoose.Types.ObjectId, ref: "cars" }],
    carWashScheduledDate: { type: Date, required: true },
    carWashStartTime: { type: String },
    carWashEndTime: { type: String },
    carImageBeforeWash: [{ type: String }],
    carImageAfterWash: [{ type: String }],
    carwashedBy: {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
    isCarWashCompleted: { type: Boolean, default: false },
  },
  { timestamps: Date.now }
);

module.exports = mongoose.model("carWash", carWashSchema);
