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
  


const Payment = require('../models/Payment');

exports.initiatePayment = async (req, res) => {
  try {
    const { orderId, amount, method } = req.body;
    const userId = req.user.id;

    const paymentId = await Payment.createPayment(orderId, userId, amount, method);
    res.status(201).json({ message: 'Payment initiated', paymentId });
  } catch (err) {
    console.error('Initiate Payment Error:', err);
    res.status(500).json({ error: 'Server error initiating payment' });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { paymentId, status } = req.body;

    await Payment.updatePaymentStatus(paymentId, status);
    res.json({ message: 'Payment status updated' });
  } catch (err) {
    console.error('Update Payment Error:', err);
    res.status(500).json({ error: 'Server error updating payment status' });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const payment = await Payment.getPaymentByOrderId(orderId);

    if (!payment) return res.status(404).json({ error: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    console.error('Get Payment Error:', err);
    res.status(500).json({ error: 'Server error fetching payment' });
  }
};
