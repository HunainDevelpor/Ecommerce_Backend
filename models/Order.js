const db = require('../utils/db');

exports.createOrder = async (userId, total_amount) => {
  const [result] = await db.execute(
    'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
    [userId, total_amount, 'pending']
  );
  return result.insertId;
};

exports.addOrderItems = async (orderId, items) => {
  for (const item of items) {
    await db.execute(
      'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
      [orderId, item.product_id, item.quantity]
    );
  }
};

exports.getOrdersByUser = async (userId) => {
  const [orders] = await db.execute('SELECT * FROM orders WHERE user_id = ?', [userId]);
  return orders;
};

exports.getOrderWithItems = async (orderId) => {
  const [order] = await db.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
  const [items] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
  return { order: order[0], items };
};
