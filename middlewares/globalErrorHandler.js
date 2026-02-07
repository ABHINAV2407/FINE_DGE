const ApiError = require("../util/apiError");
const ValidationError = require("../util/validationError");

const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.message);

  if (err instanceof ApiError || err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Mongoose validation error example
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  // Unknown error

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;
