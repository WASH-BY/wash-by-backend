const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const SalarySheetSchema = new Schema({
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
    required: true,
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },

  salary: {
    type: Number,
    required: true,
  },
  salaryDate: {
    type: Date,
    required: true,
  },
  salaryMonth: {
    type: String,
    required: true,
  },
  salaryYear: {
    type: String,
    required: true,
  },
  salaryStatus: {
    type: String,
    enum: ["Paid", "Unpaid", "Processing", "Cancelled", "Pending", "Rejected"],
    default: "Unpaid",
  },
  salaryPaid: {
    type: Number,
    required: true,
  },
  salaryPaidDate: {
    type: Date,
    default: Date.now,
  },
  salaryPaidMonth: {
    type: String,
    required: true,
  },
  salaryPaidYear: {
    type: String,
    required: true,
  },
  salaryPaidBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = Mongoose.model("SalarySheet", SalarySheetSchema);
