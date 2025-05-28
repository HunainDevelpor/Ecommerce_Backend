// const Cart = require('../models/Cart');

// exports.getCart = async (req, res) => {
//   const userId = req.user.id;
//   console.log(userId);
  
//   const cart = await Cart.getCart(userId);
//   if (!cart) {
//     return res.status(404).json({ message: 'Cart not found' });
//   }
//   res.json(cart);
// };

// exports.addToCart = async (req, res) => {
//   const { product_id, quantity } = req.body;
//   console.log(product_id, quantity);
//   await Cart.addOrUpdateCart(req.user.id, product_id, quantity);
//   res.status(201).json({ message: 'Added to cart' });
// };

// exports.updateCartItem = async (req, res) => {
//   const { product_id, quantity } = req.body;
//   await Cart.updateCartItem(req.user.id, product_id, quantity);
//   res.json({ message: 'Cart item updated' });
// };

// // exports.removeFromCart = async (req, res) => {
// //   const { productId } = req.body;
// //   await Cart.removeCart(req.user.id, productId);
// //   res.json({ message: 'Item removed from cart' });
// // };
// exports.removeFromCart = async (req, res) => {
//   const { productId } = req.body || {};

//   if (!productId) {
//     return res.status(400).json({ message: 'Product ID is required' });
//   }

//   await Cart.removeCart(req.user.id, productId);
//   res.json({ message: 'Item removed from cart' });
// };




const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.getCart(req.user.id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const items = await Cart.getItems(cart.cart_id);
    res.status(200).json({ cartId: cart.cart_id, items });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log(productId, quantity);
    
    let cart = await Cart.getCart(req.user.id);
      console.log(req.user.id);
      
    if (!cart) {
      const cartId = await Cart.createCart(req.user.id);
      cart = { cart_id: cartId };
    }
    console.log(cart.cart_id);
    await Cart.addItem(cart.cart_id, productId, quantity);
    res.status(200).json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.getCart(req.user.id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    await Cart.removeItem(cart.cart_id, req.params.productId);
    res.status(200).json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const { quantity } = req.body;
console.log(quantity);

    const cart = await Cart.getCart(userId);
    console.log(cart);
    
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    await Cart.updateItemQuantity(cart.cart_id, productId, quantity);
    console.log('Quantity updated for product:', productId, 'to', quantity);
    
    res.status(200).json({ message: 'Quantity updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    
    const cart = await Cart.getCart(userId);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
console.log(cart);

    await Cart.clearCart(cart.cart_id);
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

