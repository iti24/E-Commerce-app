const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  deliveryStatus,
} = require("../controllers/order");
router.post("/", placeOrder);
router.get("/", getUserOrders);
router.post("/deliverystatus", deliveryStatus);

module.exports = router;
