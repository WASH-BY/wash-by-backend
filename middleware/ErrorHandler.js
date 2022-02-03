const ErrorResponse = require("../utils/ErrorResponse");

const ErrorHandler = (err, req, res, next) => {
  console.log(err);

  let error = { ...err };
  console.log(error);

  if (err.name === "CastError") {
    const message = "Resource not found";
    error = new ErrorResponse(message, 404);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");

    error = new ErrorResponse(message, 400);
  }

  if (err.code === 11000) {
    const message = "Dupicate field found";

    error = new ErrorResponse(message, 400);
  }

  res.status(err.statuscode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = ErrorHandler;
