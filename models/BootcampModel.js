const mongoose = require("mongoose");

const bootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide a name"],
  },
  desc: {
    type: String,
    required: [true, "Please Provide a Desc"],
  },
  rating: {
    type: Number,
    required: [true, "Please Provide a rating"],
  },

  price: {
    type: Number,
    required: [true, "Please Provide a Price"],
  },
});

const Bootcamp = mongoose.model("bootcampSchema", bootcampSchema);

module.exports = Bootcamp;
