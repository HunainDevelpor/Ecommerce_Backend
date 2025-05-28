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

// Version 2
// const Order = require('../models/Order');

// // POST /api/orders - Create a new order
// exports.createOrder = async (req, res) => {
//   try {
//     const userId = req.user.id; // from auth middleware
//     const { items, total_amount } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ error: 'No items provided in order.' });
//     }

//     const orderId = await Order.createOrder(userId, total_amount);
//     await Order.addOrderItems(orderId, items);

//     res.status(201).json({ message: 'Order placed successfully', orderId });
//   } catch (err) {
//     console.error('Create Order Error:', err);
//     res.status(500).json({ error: 'Server error while creating order' });
//   }
// };

// // GET /api/orders - Get all orders for logged-in user
// exports.getUserOrders = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const orders = await Order.getOrdersByUser(userId);
//     res.json(orders);
//   } catch (err) {
//     console.error('Get User Orders Error:', err);
//     res.status(500).json({ error: 'Server error while fetching orders' });
//   }
// };

// // GET /api/orders/:id - Get a specific order with its items
// exports.getOrderDetails = async (req, res) => {
//   try {
//     const orderId = req.params.id;
//     const data = await Order.getOrderWithItems(orderId);

//     if (!data.order) {
//       return res.status(404).json({ error: 'Order not found' });
//     }

//     // Ensure only order owner can view their order
//     if (data.order.user_id !== req.user.id) {
//       return res.status(403).json({ error: 'Not authorized to view this order' });
//     }

//     res.json(data);
//   } catch (err) {
//     console.error('Get Order Details Error:', err);
//     res.status(500).json({ error: 'Server error while fetching order details' });
//   }
// };


//Version 3
const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, paymentInfo } = req.body; 
    // paymentInfo: { method, cardNo, cardName, cardExpire, cvv }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Step 1: Save shipping info
    const {
      firstName, lastName, email, phone,
      address, city, state, zipCode, country
    } = req.body.shippingInfo;

    const shippingInfoId = await Order.saveShippingInfo({
      userId: req.user.id,
      firstName, lastName, email, phone,
      address, city, state, zipCode, country
    });

    // Step 2: Create order
    const orderId = await Order.createOrder(req.user.id, shippingInfoId, totalAmount);
// console.log(items, totalAmount, paymentInfo);

    // Step 3: Add order items
    for (const item of items) {
      await Order.addOrderItem(orderId, item.product_id, item.quantity, item.price);
    }

    // Step 4: Save payment
    await Order.savePayment({
      orderId,
      amount: totalAmount,
      method: "Credit Card", // Assuming Credit Card for simplicity
      cardNo: paymentInfo.cardNo,
      cardName: paymentInfo.cardName,
      cardExpire: paymentInfo.cardExpire,
      cvv: paymentInfo.cvv
    });

    // Step 5: Clear cart
const cartId = await Cart.getCartIdByUserId(req.user.id); // you need this function
if (cartId) {
  await Cart.clearCart(cartId);
  console.log('Cart cleared');
} else {
  console.log('No cart found for user:', req.user.id);
}

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};


exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.getOrdersByUser(req.user.id);
    res.status(200).json( orders );
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.order_Id;
    const order = await Order.getOrderById(orderId);
    if (!order || order.user_id !== req.user.id) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const items = await Order.getOrderItems(orderId);
    res.status(200).json({ order, items });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order details', error: err.message });
  }
};
