const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: { type: Number, required: true },

    platformCommission: { type: Number, default: 0 }, // e.g. 20%

    vendorReceivable: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },

    transactionType: {
      type: String,
      enum: ["order", "refund", "payout"],
      default: "order",
    },

    paymentMethod: {
      type: String,
      enum: ["razorpay", "stripe", "cod", "wallet"],
      required: true,
    },

    transactionId: { type: String }, // Razorpay/Stripe id

    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
