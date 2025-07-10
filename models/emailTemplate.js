const mongoose = require("mongoose");

const emailTemplate = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
    },
    subject: {
      type: String,
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 1,
    },
    content: {
      type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("emailTemplates", emailTemplate);
