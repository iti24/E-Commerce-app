const Order = require("../models/order");
const Cart = require("../models/cart");

// Place an order
const placeOrder = async (req, res) => {
  try {
    const user = req.user; // Assuming you have user data in req.user
    const cart = await Cart.findOne({ user: user._id }).populate(
      "items.product"
    );

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Calculate the total price
    let totalPrice = 0;
    cart.items.forEach((item) => {
      totalPrice += item.quantity * item.product.price;
    });

    // Create the order
    const order = new Order({
      user: user._id,
      items: cart.items,
      totalPrice,
    });

    await order.save();

    // Clear the user's cart after placing the order
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a user's orders
const getUserOrders = async (req, res) => {
  try {
    const user = req.user;
    const orders = await Order.find({ user: user._id });

    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deliveryStatus = async (req, res) => {
  try {
    const { orderId, deliveryStatus } = req.body;
    const order = await Order.findById(orderId);

    // Update the order status to 'Pending Payment'
    order.status = deliveryStatus;
    await order.save();

    res.json({
      message: `Your order status has been changed to ${deliveryStatus}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  deliveryStatus,
};
