const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  foodType: {
    type: String,
  },
  food: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
  desc: {
    type: String,
  },
  qty: {
    type: Number,
    default: 1,
  },
  reviews: [],
});

module.exports = mongoose.model("product", FoodSchema);
