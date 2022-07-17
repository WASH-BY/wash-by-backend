const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const SectionSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: "School",
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
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  ],
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  standard: {
    type: Schema.Types.ObjectId,
    ref: "Standard",
    required: true,
  },
  subjects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
  ],
  attendance: [
    {
      type: Schema.Types.ObjectId,
      ref: "Attendance",
      required: true,
    },
  ],
});
