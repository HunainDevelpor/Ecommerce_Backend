// exports.initiatePayment = async (req, res) => {
//     const { orderId, amount } = req.body;
//     // Dummy response (no real payment gateway)
//     res.json({ message: 'Payment initiated', orderId, amount, status: 'pending' });
//   };
  
//   exports.getPaymentStatus = async (req, res) => {
//     const { orderId } = req.params;
//     // Dummy static status
//     res.json({ orderId, status: 'paid' });
//   };
  


// const Payment = require('../models/Payment');

// exports.initiatePayment = async (req, res) => {
//   try {
//     const { orderId, amount, method } = req.body;
//     const userId = req.user.id;

//     const paymentId = await Payment.createPayment(orderId, userId, amount, method);
//     res.status(201).json({ message: 'Payment initiated', paymentId });
//   } catch (err) {
//     console.error('Initiate Payment Error:', err);
//     res.status(500).json({ error: 'Server error initiating payment' });
//   }
// };

// exports.updatePayment = async (req, res) => {
//   try {
//     const { paymentId, status } = req.body;

//     await Payment.updatePaymentStatus(paymentId, status);
//     res.json({ message: 'Payment status updated' });
//   } catch (err) {
//     console.error('Update Payment Error:', err);
//     res.status(500).json({ error: 'Server error updating payment status' });
//   }
// };

// exports.getPayment = async (req, res) => {
//   try {
//     const orderId = req.params.orderId;
//     const payment = await Payment.getPaymentByOrderId(orderId);

//     if (!payment) return res.status(404).json({ error: 'Payment not found' });
//     res.json(payment);
//   } catch (err) {
//     console.error('Get Payment Error:', err);
//     res.status(500).json({ error: 'Server error fetching payment' });
//   }
// };



//version 3
const Payment = require('../models/payment');
const Order = require('../models/Order');

exports.initiatePayment = async (req, res) => {
  const userId = req.user.id;
  const { orderId, method } = req.body;

  try {
    const order = await Order.getOrderById(orderId);
    console.log(order);
    
    if (!order || order.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized or order not found' });
    }

    const paymentId = await Payment.createPayment(orderId, order.total_amount, method);

    res.status(201).json({
      message: 'Payment initiated',
      paymentId,
      orderId,
      amount: order.amount,
      method,
      status: 'Success'
    });
  } catch (err) {
    res.status(500).json({ message: 'Payment failed', error: err.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  const userId = req.user.id;
  const orderId = req.params.orderId;

  try {
    const order = await Order.getOrderWithItems(orderId);
    if (!order.order || order.order.user_id !== userId) {
      return res.status(403).json({ message: 'Unauthorized or order not found' });
    }

    const payment = await Payment.getPaymentByOrderId(orderId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    res.status(200).json({ payment });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payment', error: err.message });
  }
};
