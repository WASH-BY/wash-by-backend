let mongoose = require("mongoose");
let Schema = mongoose.Schema;

const StudentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
  },
  lastName: {
    type: String,
    required: true,
    minLength: 1,
  },
  roleNumber: {
    type: Number,
    min: 1,
    max: 10,
  },

  email: {
    type: String,
    required: true,
    minLength: 8,
    unique: true,
  },

  role: {
    type: string,
    enum: [
      "principal",
      "superAdmin",
      "accountant",
      "teacher",
      "driver",
      "supportStaff",
      "student",
      "parent",
    ],
    default: "student",
  },
  school: { type: Schema.Types.ObjectId, ref: "School" },
  standard: { type: Schema.Types.ObjectId, ref: "Standard" },
  section: { type: Schema.Types.ObjectId, ref: "Section" },

  deletedAt: { type: Date },
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  joiningDate: { type: Date, default: Date.now },
  password: { type: String, minLength: 8, default: "12345678" },
  gender: { type: String, enum: ["Male", "Female", "Others"], required: true },
  mobileNumber: { type: Number },
  bloodGroup: { type: String, required: true },
  address: { type: String, required: true, minLength: 20 },
  dob: { type: Date, required: true },

  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/dzqbzqgjy/image/upload/v1559098981/student_profile_default_qjqjqj.png",
  },
  fathersName: { type: String },
  mothersName: { type: String },
  fathersOccupation: { type: String },
  mothersOccupation: { type: String },
  fathersMobileNumber: { type: Number },
  mothersMobileNumber: { type: Number },
  fathersEmail: { type: String },
  mothersEmail: { type: String },
  fathersAddress: { type: String },
  guardiansName: { type: String },
  guardiansOccupation: { type: String },
  guardiansMobileNumber: { type: Number },
  guardiansEmail: { type: String },
  guardiansAddress: { type: String },
  attendance: { type: Schema.Types.ObjectId, ref: "Attendance" },
  fees: { type: Schema.Types.ObjectId, ref: "Fees" },
});

module.exports = mongoose.model("Student", StudentSchema);
