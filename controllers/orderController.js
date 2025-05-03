// const Order = require('../models/Order');

// exports.createOrder = async (req, res) => {
//   const userId = req.user.id;
//   const { products, total_amount } = req.body;

//   const orderId = await Order.createOrder(userId, total_amount);
//   await Order.addOrderItems(orderId, products);

//   res.status(201).json({ message: 'Order created', orderId });
// };

// exports.getUserOrders = async (req, res) => {
//   const orders = await Order.getOrdersByUser(req.user.id);
//   res.json(orders);
// };

// exports.getOrderById = async (req, res) => {
//   const orderDetails = await Order.getOrderWithItems(req.params.id);
//   res.json(orderDetails);
// };


const Order = require('../models/Order');

// POST /api/orders - Create a new order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { items, total_amount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided in order.' });
    }

    const orderId = await Order.createOrder(userId, total_amount);
    await Order.addOrderItems(orderId, items);

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    console.error('Create Order Error:', err);
    res.status(500).json({ error: 'Server error while creating order' });
  }
};

// GET /api/orders - Get all orders for logged-in user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.getOrdersByUser(userId);
    res.json(orders);
  } catch (err) {
    console.error('Get User Orders Error:', err);
    res.status(500).json({ error: 'Server error while fetching orders' });
  }
};

// GET /api/orders/:id - Get a specific order with its items
exports.getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = await Order.getOrderWithItems(orderId);

    if (!data.order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure only order owner can view their order
    if (data.order.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to view this order' });
    }

    res.json(data);
  } catch (err) {
    console.error('Get Order Details Error:', err);
    res.status(500).json({ error: 'Server error while fetching order details' });
  }
};
