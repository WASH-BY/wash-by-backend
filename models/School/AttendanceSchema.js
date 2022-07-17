const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const AttendanceSchema = new Schema({
  school: {
    type: Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  standard: {
    type: Schema.Types.ObjectId,
    ref: "Standard",
    required: true,
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: "Section",
  },
  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  attendanceDate: {
    type: Date,
    required: true,
  },
  description: {
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

module.exports = Mongoose.model("Attendance", AttendanceSchema);
