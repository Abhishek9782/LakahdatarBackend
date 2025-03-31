const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true, // Ensure each coupon code is unique
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // Whether the coupon is active or not
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Coupon", couponSchema);
