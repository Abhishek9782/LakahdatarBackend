const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String },
    landmark: { type: String },
    isPrimary: { type: Boolean, default: false },

    // 🧭 Geo location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: false,
      },
    },
  },
  { timestamps: true, versionKey: false }
);

// Optional: add 2dsphere index for geospatial queries
addressSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Addresse", addressSchema);
