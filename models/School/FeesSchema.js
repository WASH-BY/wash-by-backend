const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const FeesSchema = new Schema({
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

  student: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  totalFees: {
    type: Number,
    required: true,
  },
  paid: {
    type: Number,
    required: true,
  },
  due: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  paymentMode: {
    type: String,
    enum: ["Cash", "Cheque", "Online"],
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["Paid", "Unpaid", "Partially Paid"],
    default: "Unpaid",
  },
  paymentDetails: {
    type: String,
    required: true,
  },
  paymentBy: {
    type: String,
    enum: ["Student", "Father", "Mother", "Guardian", "Other"],
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  },
});

module.exports = Mongoose.model("Fees", FeesSchema);
