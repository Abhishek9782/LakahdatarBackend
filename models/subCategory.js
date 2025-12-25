const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensure category names are unique
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    parentSlug: {
      type: String,
      required: true,
    },
    description: {
      type: String, // Optional description of the category
    },
    image: {
      type: String, // Optional field for the category image (e.g., a banner or icon for the category)
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 1, // Default to active unless otherwise specified
    },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("subcategori", subcategorySchema);
