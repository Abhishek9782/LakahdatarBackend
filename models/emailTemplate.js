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
