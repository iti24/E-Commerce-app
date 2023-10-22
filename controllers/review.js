// routes/review.js
const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const Order = require("../models/order");

// Add a review (after the user has purchased the product)
const addReview = async (req, res) => {
  try {
    const { productId, rating, reviewText } = req.body;
    const user = req.user;

    // Check if the user has purchased the product
    const hasPurchased = await Order.exists({
      user: user._id,
      product: productId,
    });

    if (!hasPurchased) {
      return res
        .status(403)
        .json({ error: "You must purchase the product to leave a review." });
    }

    const review = new Review({
      product: productId,
      user: user._id,
      rating,
      reviewText,
    });
    await review.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get reviews for a product
const getReviews = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "username"
    );
    res.status(200).json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  addReview,
  getReviews,
};
