const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Vendor or restaurant admin
      required: true,
    },

    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    // Approval flow: Admin can approve/reject restaurant
    approveStatus: {
      type: String,
      enum: ["pending", "approved", "suspended", "rejected"],
      default: "pending",
    },
    is_veg: {
      type: Boolean,
      default: false,
    },

    // Ratings info
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },

    // License & certificates (optional but important)
    gstNumber: {
      type: String,
      trim: true,
    },
    fssaiNumber: {
      type: String,
      trim: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // Restaurant operational details
    openTime: {
      type: String,
      default: "09:00 AM",
    },
    closeTime: {
      type: String,
      default: "10:00 PM",
    },

    restaurantStatus: {
      type: String,
      enum: ["open", "closed", "closing soon", "opening soon"],
      default: "open",
    },

    // Overall restaurant status (system control)
    status: {
      type: Number,
      enum: [0, 1, 2], // 0: inactive, 1: active, 2: banned
      default: 1,
    },

    // Location info
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        default: [0, 0],
      },
    },

    // Optional: menu or category relation
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    // Optional: delivery options
    deliveryAvailable: {
      type: Boolean,
      default: true,
    },
    minOrderAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false }
);

// Index for location-based queries
RestaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Restaurant", RestaurantSchema);
