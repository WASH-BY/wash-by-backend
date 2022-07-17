const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const HolidaySchemaBySchool = new Schema({
  school: {
    type: Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  holidayType: {
    type: String,
    enum: ["Public", "Private", "Special", "Other"],
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  holidayDetails: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("HolidaysOfSchool", HolidaySchemaBySchool);
