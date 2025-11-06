const mongoose = require("mongoose");
exports.errorhandler = async (err, req, res, next) => {
  res.set("Content-Type", "application/json");

  console.error("Error caught:", err);

  // Validation Error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: messages.join(", "),
    });
  }

  // Cast Error (Invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: `${field} already exists.`,
    });
  }

  // MongoServerError (general)
  if (err.name === "MongoServerError") {
    return res.status(500).json({
      success: false,
      error: "Database error occurred.",
    });
  }

  // Network or connection errors
  if (
    err.message?.includes("ECONNREFUSED") ||
    err.message?.includes("timeout")
  ) {
    return res.status(503).json({
      success: false,
      error: "Database connection timeout. Please try again later.",
    });
  }

  // Default fallback
  return res.status(500).json({
    success: false,
    error: "Something went wrong.",
  });
};
