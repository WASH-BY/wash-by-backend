const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res
        .status(401)
        .json({ success: false, message: "Invalid authorization" });
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err)
        return res
          .status(401)
          .json({ success: false, message: "Invalid authorization" });

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = auth;
