const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const SubjectSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  standard: {
    type: Schema.Types.ObjectId,
    ref: "Standard",
    required: true,
  },
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
    },
  ],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
  ],
  section: {
    type: Schema.Types.ObjectId,
    ref: "Section",
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = Mongoose.model("Subject", SubjectSchema);
