const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    carts: [
      {
        prodId: {
          type: mongoose.Types.ObjectId,
          ref: "product",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        quantity: {
          type: String,
          enum: ["full", "half"],
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 1,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixid"],
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    discountCoupon: {
      type: String,
    },
    totalAfterDiscount: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("cart", cartSchema);
