const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  const userId = req.user.id;
  console.log(userId);
  
  const cart = await Cart.getCart(userId);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  res.json(cart);
};

exports.addToCart = async (req, res) => {
  const { product_id, quantity } = req.body;
  console.log(product_id, quantity);
  await Cart.addOrUpdateCart(req.user.id, product_id, quantity);
  res.status(201).json({ message: 'Added to cart' });
};

exports.updateCartItem = async (req, res) => {
  const { product_id, quantity } = req.body;
  await Cart.updateCartItem(req.user.id, product_id, quantity);
  res.json({ message: 'Cart item updated' });
};

// exports.removeFromCart = async (req, res) => {
//   const { productId } = req.body;
//   await Cart.removeCart(req.user.id, productId);
//   res.json({ message: 'Item removed from cart' });
// };
exports.removeFromCart = async (req, res) => {
  const { productId } = req.body || {};

  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  await Cart.removeCart(req.user.id, productId);
  res.json({ message: 'Item removed from cart' });
};

