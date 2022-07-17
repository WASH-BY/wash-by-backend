const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

// Create a schema where each students exam results are stored. Each student has a list of exams and each exam has a list of results. Each result has a score and a comment. Each result has a date. Each result has a student and an exam. Each result has a teacher. Each result has a school. Each result has a section. Each result has a subject. Each result has a standard. Each result has a term. Each result has a year.

const ExamSchema = new Schema({
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
  section: {
    type: Schema.Types.ObjectId,
    ref: "Section",
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  term: {
    type: String,
    enum: ["term1", "term2", "term3", "Midterm", "Final", "Pre-Final"],
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  results: [
    {
      type: Schema.Types.ObjectId,
      ref: "Result",
    },
  ],
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: "Student",
    },
  ],
});

module.exports = Mongoose.model("Exam", ExamSchema);
