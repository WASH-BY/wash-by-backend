const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  principal: { type: Schema.Types.ObjectId, ref: "User" },
  superAdmin: { type: Schema.Types.ObjectId, ref: "User" },
  accountants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  teachers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  listOfStandard: [{ type: Schema.Types.ObjectId, ref: "Standard" }],
  listOfSection: [{ type: Schema.Types.ObjectId, ref: "Section" }],
  listOfTeacher: [{ type: Schema.Types.ObjectId, ref: "User" }],
  listOfDriver: [{ type: Schema.Types.ObjectId, ref: "User" }],
  listOfSupportStaff: [{ type: Schema.Types.ObjectId, ref: "User" }],
  listOfStudent: [{ type: Schema.Types.ObjectId, ref: "User" }],
  listOfParent: [{ type: Schema.Types.ObjectId, ref: "User" }],
  schoolEstablished: { type: Date, default: Date.now },
  schoolLogo: {
    type: String,
    default:
      "https://res.cloudinary.com/dzqbzqgjy/image/upload/v1559098981/school_logo_default_qjqjqj.png",
  },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("School", SchoolSchema);
