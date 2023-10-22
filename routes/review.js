const express = require("express");
const router = express.Router();
const { addReview, getReviews } = require("../controllers/review");

router.post("/add", addReview);
router.get("/product/:productId", getReviews);

module.exports = router;
