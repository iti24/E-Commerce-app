const express = require('express');
const router = express.Router();
const config = require("../config");
config.mongodbUri
const stripe = require('stripe')(config.stripeSecretKey);
const Order = require('../models/order');

// Create a payment intent for Stripe
const online= async (req, res) => {
  try {
    const { orderId, paymentMethodId } = req.body;
    const order = await Order.findById(orderId);
    
    // Create a payment intent using Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.totalPrice * 100, // Stripe expects the amount in cents (amount in paise)
      currency: 'inr', // Use 'inr' for Indian Rupees
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
    });
    
    // Update the order status to 'Paid'
    order.paymentStatus = 'Paid';
    await order.save();
    // res.json({ clientSecret: paymentIntent.client_secret });
    res.json({ message: 'Payment successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create an order with cash on delivery
const cod= async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    
    // Update the order status to 'Pending Payment'
    order.paymentStatus = 'Cod Payment';
    await order.save();
    
    res.json({ message: 'Order placed with Cash on Delivery' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
   online,
    cod,
  
  };
