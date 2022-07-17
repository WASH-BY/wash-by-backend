const Staff = require("../../models/School/StaffSchema");
const School = require("../../models/School/SchoolSchema");
const byrcpt = require("bcrypt");
const jwt = require("jsonwebtoken");

const staffController = {
  //login API call
  login: async (req, res, _next) => {
    try {
      const { email, password } = req.body;
      const EmailExist = await Staff.findOne({ email });
      if (!EmailExist)
        return res.status(400).json({ message: "Email does not match" });
      const isPasswordMatching = await byrcpt.compare(
        password,
        EmailExist.password
      );
      if (!isPasswordMatching) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const accessToken = createAccessToken({ id: EmailExist._id });
      const refreshToken = createRefreshToken({ id: EmailExist._id });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        path: "/staff/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ success: true, data: { accessToken } });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  refreshToken: async (req, res, _next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json({ message: "No token" });
      const verified = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await Staff.findById(verified.id);
      if (!user) return res.status(400).json({ message: "Invalid token" });
      const accessToken = createAccessToken({ id: user._id });
      return res.status(200).json({ success: true, data: { accessToken } });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  logOut: async (_req, res, _next) => {
    try {
      res.clearCookie("refreshToken", { path: "/staff/refresh_token" });
      res.status(200).json({ message: "SuccessFully Logged Out" });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  getAcessToken: async (req, res) => {
    try {
      const cookies = req.cookies;
      if (!cookies.refreshToken) {
        return res.status(400).json({ message: "Please login first." });
      }
      const refreshToken = cookies.refreshToken;
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) {
          return res.status(400).json({ message: "Please login now." });
        }
        const accessToken = createAccessToken({ id: user._id });
        res.status(200).json({ success: true, data: { accessToken } });
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
  createPrincipal: async (req, res, _next) => {
    try {
      const {
        firstName,
        lastName,
        address,
        email,
        city,
        password,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      } = req.body;
      if (
        !firstName ||
        !lastName ||
        !address ||
        !email ||
        !city ||
        !password ||
        !dob ||
        !phone ||
        !role ||
        !joiningDate ||
        !bloodGroup ||
        !gender ||
        !education
      )
        return res
          .status(400)
          .json({ message: "Please fill in all the details" });
      if (!validateEmail(email))
        return res.status(400).json({ message: "Invalid email address" });
      const EmailExist = await Staff.findOne({ email });
      if (EmailExist)
        return res.status(400).json({ message: "Email already exists" });
      const passwordHash = await byrcpt.hash(password, 10);
      const doesSchoolExist = await School.findById({ _id: school });
      if (!doesSchoolExist)
        return res.status(400).json({ message: "School does not exist" });
      const newPrincipal = {
        firstName,
        lastName,
        address,
        email,
        city,
        password: passwordHash,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      };
      await Staff.create(newPrincipal);
      res.status(201).json({ success: true, data: newPrincipal });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
  getPrincipal: async (req, res, _next) => {
    try {
      const principal = await Staff.findById(req.params.id).populate(
        "school",
        "-_id "
      );
      res.status(200).json({
        success: true,
        data: principal,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
  updatePrincipal: async (req, res, _next) => {
    try {
      const {
        firstName,
        lastName,
        address,
        email,
        city,
        password,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      } = req.body;
      const updatePrincipal = await Staff.findByIdAndUpdate(
        req.params.id,
        {
          firstName,
          lastName,
          address,
          email,
          city,
          password,
          school,
          dob,
          phone,
          role,
          joiningDate,
          profilePicture,
          designation,
          department,
          bloodGroup,
          gender,
          education,
        },
        { new: true, runValidators: true }
      );
      res.status(200).json({
        success: true,
        data: updatePrincipal,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
  deletePrincipal: async (req, res, _next) => {
    try {
      const principal = await Staff.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true, runValidators: true }
      );
      res.status(200).json({
        success: true,
        data: principal,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
  createSuperAdmin: async (req, res, _next) => {
    try {
      const {
        firstName,
        lastName,
        address,
        email,
        city,
        password,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      } = req.body;
      if (
        !firstName ||
        !lastName ||
        !address ||
        !email ||
        !city ||
        !password ||
        !dob ||
        !phone ||
        !role ||
        !joiningDate ||
        !bloodGroup ||
        !gender ||
        !education
      )
        return res
          .status(400)
          .json({ message: "Please fill in all the details" });
      if (!validateEmail(email))
        return res.status(400).json({ message: "Invalid email address" });
      const EmailExist = await Staff.findOne({ email });
      if (EmailExist)
        return res.status(400).json({ message: "Email already exists" });
      const newSuperAdmin = {
        firstName,
        lastName,
        address,
        email,
        city,
        password,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      };
      await Staff.create(newSuperAdmin);
      res.status(201).json({
        success: true,
        data: newSuperAdmin,
      });
    } catch (error) {
      return res.status(401).json({ success: false, data: error });
    }
  },
  getSuperAdmins: async (_req, res, _next) => {
    try {
      const superAdmins = await Staff.find({ role: "superAdmin" });
      res.status(200).json({
        success: true,
        data: superAdmins,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
  getSuperAdmin: async (req, res, _next) => {
    try {
      const superAdmin = await Staff.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: superAdmin,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
  updateSuperAdmin: async (req, res, _next) => {
    try {
      const {
        firstName,
        lastName,
        address,
        email,
        city,
        password,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      } = req.body;

      const superAdmin = await Staff.findByIdAndUpdate(
        req.params.id,
        {
          firstName,
          lastName,
          address,
          email,
          city,
          password,
          school,
          dob,
          phone,
          role,
          joiningDate,
          profilePicture,
          designation,
          department,
          bloodGroup,
          gender,
          education,
        },
        { new: true, runValidators: true }
      );
      res.status(200).json({ success: true, data: superAdmin });
    } catch (error) {
      return res.status(401).json({ success: false, data: error });
    }
  },
  deleteSuperAdmin: async (req, res, _next) => {
    try {
      const superAdmin = await Staff.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true, runValidators: true }
      );
      res.status(200).json({ success: true, data: superAdmin });
    } catch (error) {
      return res.status(401).json({ success: false, data: error });
    }
  },
  createAdmin: async (req, res, _next) => {
    try {
      const {
        firstName,
        lastName,
        address,
        email,
        city,
        password,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      } = req.body;
      if (
        !firstName ||
        !lastName ||
        !address ||
        !email ||
        !school ||
        !city ||
        !password ||
        !dob ||
        !phone ||
        !role ||
        !joiningDate ||
        !bloodGroup ||
        !gender ||
        !education
      )
        return res
          .status(400)
          .json({ message: "Please fill in all the details" });
      const EmailExist = await Staff.findOne({ email });

      if (EmailExist)
        return res.status(400).json({ message: "Email already exists" });
      const newAdmin = {
        firstName,
        lastName,
        address,
        email,
        city,
        password,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      };
      await Staff.create(newAdmin);
      return res.status(201).json({ success: true, data: newAdmin });
    } catch (error) {
      res.status(401).json({
        success: false,

        data: error,
      });
    }
  },
  getAdmins: async (_req, res, _next) => {
    try {
      const admins = await Staff.find({ role: "admin" });
      res.status(200).json({
        success: true,
        data: admins,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
  getAdmin: async (req, res, _next) => {
    try {
      const admin = await Staff.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: admin,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
  updateAdmin: async (req, res, _next) => {
    try {
      const {
        firstName,
        lastName,
        address,
        email,
        city,
        password,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      } = req.body;
      const updateAdmin = await Staff.findByIdAndUpdate(
        req.params.id,
        {
          firstName,
          lastName,
          address,
          email,
          city,
          password,
          school,
          dob,
          phone,
          role,
          joiningDate,
          profilePicture,
          designation,
          department,
          bloodGroup,
          gender,
          education,
        },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ success: true, data: updateAdmin });
    } catch (error) {
      return res.status(401).json({ success: false, data: error });
    }
  },
  deleteAdmin: async (req, res, _next) => {
    try {
      const admin = await Staff.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true, runValidators: true }
      );
      res.status(200).json({ success: true, data: admin });
    } catch (error) {
      return res.status(401).json({ success: false, data: error });
    }
  },
  createTeacher: async (req, res, _next) => {
    try {
      const {
        firstName,
        lastName,
        address,
        email,
        city,
        password,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      } = req.body;
      if (
        !firstName ||
        !lastName ||
        !address ||
        !email ||
        !school ||
        !city ||
        !password ||
        !dob ||
        !phone ||
        !role ||
        !joiningDate ||
        !bloodGroup ||
        !gender ||
        !education
      )
        return res
          .status(400)
          .json({ message: "Please fill in all the details" });
      const EmailExist = await Staff.findOne({ email });

      if (EmailExist)
        return res.status(400).json({ message: "Email already exists" });
      const newAdmin = {
        firstName,
        lastName,
        address,
        email,
        city,
        password,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      };
      await Staff.create(newAdmin);
      return res.status(201).json({ success: true, data: newAdmin });
    } catch (error) {
      res.status(401).json({
        success: false,

        data: error,
      });
    }
  },
  getTeachers: async (_req, res, _next) => {
    try {
      const teachers = await Staff.find({ role: "teacher" });
      res.status(200).json({
        success: true,
        data: teachers,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
  getTeacher: async (req, res, _next) => {
    try {
      const teacher = await Staff.findById(req.params.id);
      res.status(200).json({
        success: true,
        data: teacher,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },
  updateTeacher: async (req, res, _next) => {
    try {
      const {
        firstName,
        lastName,
        address,
        email,
        city,
        password,
        school,
        dob,
        phone,
        role,
        joiningDate,
        profilePicture,
        designation,
        department,
        bloodGroup,
        gender,
        education,
      } = req.body;

      const EmailExist = await Staff.findOne({ email });
      if (!EmailExist)
        return res.status(400).json({ message: "Email already exists" });

      const updateTeacher = await Staff.findByIdAndUpdate(
        req.params.id,
        {
          firstName,
          lastName,
          address,
          email,
          city,
          password,
          school,
          dob,
          phone,
          role,
          joiningDate,
          profilePicture,
          designation,
          department,
          bloodGroup,
          gender,
          education,
        },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ success: true, data: updateTeacher });
    } catch (error) {
      return res.status(401).json({ success: false, data: error });
    }
  },
  deleteTeacher: async (req, res, _next) => {
    try {
      const teacher = await Staff.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true, runValidators: true }
      );
      res.status(200).json({ success: true, data: teacher });
    } catch (error) {
      return res.status(401).json({ success: false, data: error });
    }
  },
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: "7D" });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "30D" });
};

module.exports = staffController;
