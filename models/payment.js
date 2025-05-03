const db = require('../utils/db');

exports.createPayment = async (orderId, userId, amount, method = 'card') => {
  const [result] = await db.execute(
    'INSERT INTO payments (order_id, user_id, amount, status, method) VALUES (?, ?, ?, ?, ?)',
    [orderId, userId, amount, 'pending', method]
  );
  return result.insertId;
};

exports.updatePaymentStatus = async (paymentId, status) => {
  await db.execute('UPDATE payments SET status = ? WHERE id = ?', [status, paymentId]);
};

exports.getPaymentByOrderId = async (orderId) => {
  const rows = await db.execute('SELECT * FROM payments WHERE order_id = ?', [orderId]);
  return rows;
};
