const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User", // Reference to the User who owns the address
      required: true,
    },
    name: {
      type: String,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false, // Whether this address is the primary address for delivery
    },
    phone: {
      type: String, // Optional phone number for this specific address
    },
    landmark: {
      type: String, // Optional field for additional information, like landmarks or nearby places
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Address", addressSchema);
