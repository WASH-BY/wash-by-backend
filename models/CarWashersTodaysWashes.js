const mongoose = require("mongoose");

const carWashersTodaysWashes = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
    carWashes: { type: Array },
  },
  { timestamps: Date.now }
);

module.exports = mongoose.model("carWashers", carWashersTodaysWashes);
