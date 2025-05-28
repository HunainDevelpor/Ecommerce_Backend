// const db = require('../utils/db');

// exports.createPayment = async (orderId, userId, amount, method = 'card') => {
//   const [result] = await db.execute(
//     'INSERT INTO payments (order_id, user_id, amount, status, method) VALUES (?, ?, ?, ?, ?)',
//     [orderId, userId, amount, 'pending', method]
//   );
//   return result.insertId;
// };

// exports.updatePaymentStatus = async (paymentId, status) => {
//   await db.execute('UPDATE payments SET status = ? WHERE id = ?', [status, paymentId]);
// };

// exports.getPaymentByOrderId = async (orderId) => {
//   const rows = await db.execute('SELECT * FROM payments WHERE order_id = ?', [orderId]);
//   return rows;
// };



const db = require('../utils/db');

const Payment = {
  createPayment: (orderId, amount, method, status = 'Success') => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO Payment (order_id, amount, method, status) VALUES (?, ?, ?, ?)',
        [orderId, amount, method, status],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId); // Return new payment ID
        }
      );
    });
  },

  updatePaymentStatus: (paymentId, status) => {
    return new Promise((resolve, reject) => {
      db.query(
        'UPDATE Payment SET status = ? WHERE payment_id = ?',
        [status, paymentId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result); // Can return result.affectedRows if needed
        }
      );
    });
  },

  getPaymentByOrderId: (orderId) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM Payment WHERE order_id = ?',
        [orderId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows[0]); // Return the first result
        }
      );
    });
  },
};

module.exports = Payment;
