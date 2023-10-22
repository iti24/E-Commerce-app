// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//     },
//     product: {
//       type: Schema.Types.ObjectId,
//       ref: "Product",
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },
//     address: {
//       type: Object,
//       required: true,
//     },
//     status: {
//       type: Number,
//       default: 1,
//       //   1.process
//       //   2.delivered
//       // 3.pending
//       // 4.dispatched
//       // 5.cancelled
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", OrderSchema);

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Cod Payment', 'Paid', 'Pending Payment'],
    default: 'Pending Payment',
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);

