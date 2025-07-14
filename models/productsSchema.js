const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      enum: ["full", "half"],
      default: "half",
    },
    fullprice: {
      type: Number,
      min: 1,
    },
    halfprice: {
      type: Number,
      min: 1,
    },
    foodType: {
      type: String,
    },
    food: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
      max: 5,
    },
    desc: {
      type: String,
    },
    qty: {
      type: Number,
      default: 1,
    },
    offer: {
      type: Number,
    },
    status: {
      type: Number,
      enum: [0, 1, 2],
      default: 1,
    },
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("product", FoodSchema);
