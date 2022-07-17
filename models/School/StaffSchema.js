const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const StaffSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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
  dob: {
    type: Date,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: [
      "principal",
      "superAdmin",
      "accountant",
      "teacher",
      "driver",
      "supportStaff",
    ],
    required: true,
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: "School",
    required: true,
  },
  joiningDate: {
    type: Date,
    default: Date.now,
  },
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/dzqbzqgjy/image/upload/v1559098981/student_profile_default_qjqjqj.png",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
  password: {
    type: String,
    minLength: 8,
    default: "12345678",
  },
  designation: {
    type: String,
  },
  department: {
    type: String,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
  },
  education: {
    type: String,
    requiered: true,
  },
  standardsTheyTeach: [{ type: Schema.Types.ObjectId, ref: "Standards" }],
  subjectsTheyTeach: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subjects",
    },
  ],

  sectionsTheyTeach: [
    {
      type: Schema.Types.ObjectId,
      ref: "Sections",
    },
  ],
  salarySheet: [
    {
      type: Schema.Types.ObjectId,
      ref: "SalarySheet",
    },
  ],
  vehicleNumber: {
    type: String,
  },
  vehicleType: {
    type: String,
  },
  routesTheyTravel: {
    type: String,
  },
});

module.exports = Mongoose.model("Staff", StaffSchema);
