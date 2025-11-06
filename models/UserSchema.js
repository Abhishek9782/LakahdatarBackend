const mongoose = require("mongoose");

const userLoginSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    img: {
      type: String, // Profile image URL
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure unique emails
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    mobile: {
      type: String,
      required: true,
      unique: true, // Ensure unique mobile number
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
      default: Date.now, // Expiry of OTP (can be a 15-minute window, for example)
    },
    otpVerified: {
      type: Boolean,
      default: false, // Whether OTP was verified or not
    },
    role: {
      type: String,
      enum: ["user", "admin", "delivery-person", "vendor"],
      default: "user",
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 1, // 0: inactive, 1: active, 2: blocked
    },
    addresses: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Address", // References to an Address collection for storing multiple addresses
      },
    ],
    preferences: {
      favoriteCategories: [mongoose.Types.ObjectId], // Store user preferences like favorite food categories
      dietaryRestrictions: [mongoose.Schema.Types.ObjectId], // Track user's dietary preferences or restrictions (e.g., vegetarian, gluten-free)
    },
    emailVerified: {
      type: Boolean,
      default: false, // Whether the user's email is verified
    },
    lastLogin: {
      type: Date, // Tracks the last time the user logged in
    },
    lastLoginIp: {
      type: String, // Tracks the last IP address the user logged in from
    },
    resetPasswordToken: {
      type: String, // Token for resetting the user's password
    },
    resetPasswordExpires: {
      type: Date, // Expiration date of the password reset token
    },
    socialLogin: {
      google: {
        type: String, // Store Google account ID for social login
      },
      facebook: {
        type: String, // Store Facebook account ID for social login
      },
    },
    loyaltyPoints: {
      type: Number,
      default: 0, // Track user's loyalty points
    },
    dateOfBirth: {
      type: Date, // Date of birth for targeting promotions
    },
  },
  { timestamps: true, versionKey: false }
);

userLoginSchema.index({ email: 1, fullname: 1 });

module.exports = mongoose.model("User", userLoginSchema);
