exports.errorhandler = async (err, req, res, next) => {
  // Log the error for debugging purposes (optional)

  // In production, send a generic message without exposing stack trace
  res.set("Content-Type", "application/json");
  return res.status(400).json({
    status: 0,
    message: err.message,
  });
};
