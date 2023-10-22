const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name:{ type: String },
  description: { type: String },
  price: { type: Number },
  imageUrl:{ type: String },
  type: { type: String },
  color: { type: String },
  size: { type: String},
  material: {
    type: String,
  },
  print: {
    type: String,
  },
});

module.exports = mongoose.model("Product", productSchema);
