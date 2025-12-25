const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      // who receives the notification
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      // short title for UI (optional but recommended)
      type: String,
      required: true,
    },

    message: {
      // long message
      type: String,
      required: true,
    },

    type: {
      // better enum design
      type: String,
      enum: [
        "order", // order placed, cancelled, etc.
        "system", // system alerts
        "promotion", // offers, marketing
        "payment", // payment success/failed
        "delivery", // delivery boy updates
      ],
      required: true,
    },

    data: {
      // extra data (VERY IMPORTANT)
      type: Object, // orderId, amount, customerName, etc.
      default: {},
    },

    role: {
      // vendor | customer | admin | delivery
      type: String,
      enum: ["vendor", "customer", "admin", "delivery"],
      required: true,
    },

    read: {
      // mark as read/unread
      type: Boolean,
      default: false,
    },

    deleted: {
      // soft delete (optional)
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Notification", notificationSchema);
