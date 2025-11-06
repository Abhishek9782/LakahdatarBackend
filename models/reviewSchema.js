const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    // Reference to Product or Restaurant (depending on your business model)
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // or "Restaurant"
      required: true,
      index: true, // using this index will improve query performance
    },
    // Reference to User who made the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // user base index will improve query performance
    },
    // Numeric rating (1–5)
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
      // here we validate that rating is an integer
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer value",
      },
    },
    // Optional review text
    comment: {
      type: String,
      trim: true,
      maxlength: [300, "Comment cannot exceed 100 characters"],
    },

    // Optional fields for richer feedback (like Zomato/Swiggy)
    photos: [
      {
        type: String, // URLs of uploaded review images
      },
    ],
    // To store like/dislike or helpful votes
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    // Moderation and visibility control this review should be visible to others or not handle by vendor
    isApproved: {
      type: Boolean,
      default: true,
    },
    reviewStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // creates createdAt & updatedAt
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🧠 Prevent duplicate reviews from same user on same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// 🚀 Virtual field for average rating (used if you populate product)
// here we use this function to use here for making comment or user review short last 80 characters after then add ... other wise no reviews then i add ""

reviewSchema.virtual("shortComment").get(function () {
  return this.comment ? this.comment.slice(0, 80) + "..." : "";
});

// 📊 Static method to calculate and update product’s average rating
// this function for making average rating of products
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      averageRating: stats[0].avgRating.toFixed(1),
      numOfReviews: stats[0].numOfReviews,
    });
  } else {
    await mongoose.model("Product").findByIdAndUpdate(productId, {
      averageRating: 0,
      numOfReviews: 0,
    });
  }
};

// 🪄 Middleware to recalculate rating after save or remove
reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post("remove", function () {
  this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model("Review", reviewSchema);
