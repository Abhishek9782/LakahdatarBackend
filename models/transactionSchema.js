const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    payment: {
      type: mongoose.Types.ObjectId,
      ref: "Payment", // Reference to payment details
    },
    status: {
      type: String,
      enum: ["completed", "failed", "pending"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Transaction", transactionSchema);
