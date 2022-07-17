const Users = require("../models/UserModel");
const byrcpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIFeatures = require("../utils/APIFeatures");

const userController = {
  register: async (req, res, _next) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password)
        return res
          .status(400)
          .json({ message: "Please fill in all the details" });
      if (!validateEmail(email))
        return res.status(400).json({ message: "Invalid email address" });
      const EmailExist = await Users.findOne({ email });
      if (EmailExist)
        return res.status(400).json({ message: "Email already exists" });
      if (password.length < 7)
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
      const passwordHash = await byrcpt.hash(password, 10);
      const newUser = { name, email, password: passwordHash };
      await Users.create(newUser);
      res.status(201).json({
        success: true,
        data: newUser,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        data: error,
      });
    }
  },

  login: async (req, res, _next) => {
    try {
      const { email, password } = req.body;
      const EmailExist = await Users.findOne({ email });
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
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({ success: true, data: { accessToken } });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  //login API call
  refreshToken: async (req, res, _next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) return res.status(401).json({ message: "No token" });
      const verified = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await Users.findById(verified.id);
      if (!user) return res.status(400).json({ message: "Invalid token" });
      const accessToken = createAccessToken({ id: user._id });
      return res.status(200).json({ success: true, data: { accessToken } });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  logOut: async (_req, res, _next) => {
    try {
      res.clearCookie("refreshToken", { path: "/user/refresh_token" });
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

  getAllUsers: async (req, res, _next) => {
    try {
      const users = new APIFeatures(
        Users.find()
          .select("-password -updatedAt -__v -createdAt")
          .populate(
            "subscriptionDetails carDetails",
            `subscriptionStartDate subscriptionEndDate subscriptionChosen
             carDetails carWasherDetails 
             totalWashesDone totalWashesLeft totalWashes 
             carCompanyName carModelName carNumber carModelYear 
            carLocation carApartmentName carOwnerFlatorHouseNumber carOwnerPhoneNumber`
          ),
        req.query
      )
        .paginating()
        .sorting()
        .searching()
        .filtering();
      const result = await Promise.allSettled([
        users.query,
        Users.countDocuments(),
      ]);
      const allUsers = result[0].status === "fulfilled" ? result[0].value : [];
      const count = result[1].status === "fulfilled" ? result[1].value : [];

      return res.status(200).json({ success: true, data: allUsers, count });
    } catch (error) {
      return res.status(500).json({ message: "Something went wrong !" });
    }
  },

  getUserById: async (req, res, _next) => {
    try {
      const userExist = await Users.findById({ _id: req.params.id })
        .select("-password -updatedAt -__v -createdAt")
        .populate(
          "subscriptionDetails",
          "subscriptionStartDate subscriptionEndDate subscriptionChosen carDetails carWasherDetails totalWashesDone totalWashesLeft totalWashes"
        );
      if (!userExist) {
        return res.status(400).json({ message: "User does not exist" });
      }
      res.status(200).json({ success: true, data: { user: userExist } });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      let user = await Users.findById({ _id: req.params.id });
      if (!user)
        return res.status(404).json({ success: false, msg: "User not found" });
      const update = await Users.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      }).select("-password -updatedAt -__v");
      res.status(200).json({ success: true, data: update });
    } catch (error) {
      return res.status(404).json({ success: false, msg: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      let user = await Users.findById({ _id: req.params.id });
      if (!user)
        return res.status(404).json({ success: false, msg: "User not found" });
      await Users.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, data: [] });
    } catch (error) {
      return res.status(404).json({ success: false, msg: error.message });
    }
  },

  follow: async (req, res) => {
    try {
      const user = await Users.find({
        _id: req.params.id,
        followers: req.user.id,
      });
      console.log(user);
      if (user.length > 0)
        return res.status(500).json({ message: "you are following this user" });

      const newUser = await Users.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { followers: req.user.id } }
      );

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        { $push: { following: req.params.id } },
        { new: true, runValidators: true }
      );
      res.status(201).json({ newUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  unfollow: async (req, res) => {
    try {
      const notFollowing = await Users.findOne({
        _id: req.user.id,
        following: req.params.id,
      });
      if (notFollowing)
        return res
          .status(500)
          .json({ message: "You are not following this user to unfollow" });

      const existingFollowers = await Users.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { followers: req.user.id } }
      );

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        { $pull: { following: req.params.id } }
      );
      res
        .status(201)
        .json({ success: true, existingFollowers: existingFollowers });
    } catch (error) {
      res.status(500).json({ error: error.message });
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

module.exports = userController;
