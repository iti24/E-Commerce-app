const Cart = require('../models/cart');
const Product = require('../models/product');

// Add a product to the cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = req.user; // user data in req.user

 
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the user already has a cart, or create one if not
    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = new Cart({ user: user._id, items: [] });
    }

    // Check if the product is already in the cart, and update the quantity
    const existingItem = cart.items.find((item) => item.product.equals(productId));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get the user's shopping cart
const getCart = async (req, res) => {
  try {
    const user = req.user; 
    const cart = await Cart.findOne({ user: user._id }).populate('items.product');

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.status(200).json(cart);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Remove a product from the cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user; // Assuming you have user data in req.user

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter((item) => !item.product.equals(productId));

    await cart.save();
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart
  };
  