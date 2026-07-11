const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: { type: String, trim: true },

    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },

    addressType: {
      type: String,
      enum: ["home", "work", "other"],
      required: true,
    },

    fullAddress: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    landmark: { type: String, trim: true },

    isPrimary: { type: Boolean, default: false },

    // // 🌍 Geo Location (OPTIONAL)
    // location: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     default: "Point",
    //   },
    //   coordinates: {
    //     type: [Number], // [lng, lat]
    //     default: undefined, // IMPORTANT
    //   },
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * ✅ Partial index
 * This ensures MongoDB ONLY applies geo index
 * when coordinates actually exist.
 */
// addressSchema.index(
//   { location: "2dsphere" },
//   {
//     partialFilterExpression: {
//       "location.coordinates": { $exists: true },
//     },
//   }
// );

module.exports = mongoose.model("Address", addressSchema);
