const School = require("../../models/School/SchoolSchema");

const schoolController = {
  createSchool: async (req, res, _next) => {
    try {
      const { name, address, city, state, zip, phone, email } = req.body;
      if (!name || !address || !city || !state || !zip || !phone || !email)
        return res
          .status(400)
          .json({ message: "Please fill in all the details" });
      if (!validateEmail(email))
        return res.status(400).json({ message: "Invalid email address" });
      const EmailExist = await School.findOne({ email });
      if (EmailExist)
        return res.status(400).json({ message: "Email already exists" });
      const newSchool = { name, address, city, state, zip, phone, email };
      await School.create(newSchool);
      res.status(201).json({
        success: true,
        data: newSchool,
      });
    } catch (error) {
      res.status(401).json({
        success: false,

        data: error,
      });
    }
  },
  getSchools: async (_req, res, _next) => {
    try {
      const schools = await School.find();
      res.status(200).json({
        success: true,
        data: schools,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },

  getSchool: async (req, res, _next) => {
    try {
      const school = await School.findById({ _id: req.params.id }).select(
        " -updatedAt -__v -createdAt"
      );
      console.log(school);
      if (!school) return res.status(404).json({ message: "School not found" });
      res.status(200).json({
        success: true,
        data: school,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: { ...error, reason: "School not found" },
      });
    }
  },
  updateSchool: async (req, res, _next) => {
    try {
      const { name, address, city, state, zip, phone, email } = req.body;
      const school = await School.findByIdAndUpdate(
        req.params.id,
        {
          name,
          address,
          city,
          state,
          zip,
          phone,
          email,
        },
        { new: true, runValidators: true }
      );
      res.status(200).json({
        success: true,
        data: school,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
  deleteSchool: async (req, res, _next) => {
    // find the school by id and mark the key value pair "isDeleted" to true
    try {
      const school = await School.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true, runValidators: true }
      );
      res.status(200).json({
        success: true,
        data: school,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = schoolController;
