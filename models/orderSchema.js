const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: String,
      required: true,
      unique: true, // Ensure that the orderId is unique
    },
    products: [
      {
        prodId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        qty: {
          type: Number,
          required: true,
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
    Gst: {
      type: Number,
    },
    deliveryTip: {
      type: Number,
    },
    platformFees: {
      type: Number,
    },

    status: {
      type: String,
      enum: [
        "pending", // Order received but not processed
        "confirmed", // Order confirmed by the restaurant
        "preparing", // Food being prepared
        "out-for-delivery", // Order is on the way
        "delivered", // Food delivered to customer
        "completed", // Order completed (final status)
        "cancelled", // Order cancelled
      ],
      default: "pending", // Default order status
    },
    paymentMethod: {
      type: String,
      enum: [
        "credit-card",
        "cash",
        "online-wallet",
        "other",
        "upi",
        "netbanking",
        "wallet",
      ],
      // required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PAID", "UNPAID", "pending"],
      default: "pending", // Default status is unpaid or pending
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
    },
    discountAmount: {
      type: Number,
      default: 0, // Discount applied to the order
    },
    discountCoupon: {
      type: String, // Coupon code applied (if any)
    },
    deliveryAddress: {
      type: mongoose.Types.ObjectId,
      ref: "Address", // Reference to the user's delivery address
      required: true,
    },
    deliveryDate: {
      type: Date,
      // required: true, // Estimated delivery date/time
    },
    orderReview: {
      type: String, // Customer's feedback
    },
    orderRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    reviewDate: {
      type: Date, // Date when the review was submitted
    },
    orderDate: {
      type: Date,
      default: Date.now, // When the order was placed
    },
    estimatedDeliveryTime: {
      type: Date, // Estimated time for delivery
    },
    actualDeliveryTime: {
      type: Date, // Actual time when the order was delivered
    },
    deliveredBy: {
      type: mongoose.Types.ObjectId,
      ref: "DeliveryPerson", // Reference to the delivery person handling the order
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("order", orderSchema);
