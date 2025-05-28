// const db = require('../utils/db');

// exports.createOrder = async (userId, total_amount) => {
//   const [result] = await db.execute(
//     'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
//     [userId, total_amount, 'pending']
//   );
//   return result.insertId;
// };

// exports.addOrderItems = async (orderId, items) => {
//   for (const item of items) {
//     await db.execute(
//       'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
//       [orderId, item.product_id, item.quantity]
//     );
//   }
// };

// exports.getOrdersByUser = async (userId) => {
//   const [orders] = await db.execute('SELECT * FROM orders WHERE user_id = ?', [userId]);
//   return orders;
// };

// exports.getOrderWithItems = async (orderId) => {
//   const [order] = await db.execute('SELECT * FROM orders WHERE id = ?', [orderId]);
//   const [items] = await db.execute('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
//   return { order: order[0], items };
// };

//Version 2

// const db = require('../utils/db');

// const Order = {
//   createOrder: (userId, totalAmount, status = 'Pending') => {
//     return new Promise((resolve, reject) => {
//       db.query(
//         'INSERT INTO OrderTable (user_id, order_date, total_amount, status) VALUES (?, CURDATE(), ?, ?)',
//         [userId, totalAmount, status],
//         (err, result) => {
//           if (err) return reject(err);
//           resolve(result.insertId); // Return new order ID
//         }
//       );
//     });
//   },

//   addOrderItem: (orderId, productId, quantity, price) => {
//     return new Promise((resolve, reject) => {
//       db.query(
//         'INSERT INTO OrderItem (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
//         [orderId, productId, quantity, price],
//         (err, result) => {
//           if (err) return reject(err);
//           resolve(result);
//         }
//       );
//     });
//   },

//   getOrdersByUser: (userId) => {
//     return new Promise((resolve, reject) => {
//       db.query(
//         'SELECT * FROM OrderTable WHERE user_id = ? ORDER BY order_date DESC',
//         [userId],
//         (err, results) => {
//           if (err) return reject(err);
//           resolve(results);
//         }
//       );
//     });
//   },

//   getOrderItems: (orderId) => {
//     return new Promise((resolve, reject) => {
//       db.query(
//         `SELECT oi.product_id, p.name, oi.quantity, oi.price
//          FROM OrderItem oi
//          JOIN products p ON oi.product_id = p.id
//          WHERE oi.order_id = ?`,
//         [orderId],
//         (err, results) => {
//           if (err) return reject(err);
//           resolve(results);
//         }
//       );
//     });
//   },

//   getOrderById: (orderId) => {
//     return new Promise((resolve, reject) => {
//       db.query(
//         'SELECT * FROM OrderTable WHERE order_id = ?',
//         [orderId],
//         (err, results) => {
//           if (err) return reject(err);
//           resolve(results[0]); // Return first (or null if not found)
//         }
//       );
//     });
//   },
// };

// module.exports = Order;


// ✅ UPDATED: models/Order.js
const db = require('../utils/db');

const Order = {
  // Step 1: Save shipping info and return the inserted ID
  saveShippingInfo: ({ userId, firstName, lastName, email, phone, address, city, state, zipCode, country }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO ShippingInfo (user_id, first_name, last_name, email, phone, address_line, city, state, zip_code, country)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, firstName, lastName, email, phone, address, city, state, zipCode, country],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  },
savePayment: ({ orderId, amount, method, cardNo, cardName, cardExpire, cvv, status = 'Paid' }) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO Payment (order_id, amount, method, cardNo, cardName, cardExpire, cvv, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderId, amount, method, cardNo, cardName, cardExpire, cvv, status],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId); // returns payment_id
      }
    );
  });
},

  createOrder: (userId, shippingInfoId, totalAmount, status = 'Pending') => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO OrderTable (user_id, shipping_info_id, order_date, total_amount, status) VALUES (?, ?, CURDATE(), ?, ?)',
        [userId, shippingInfoId, totalAmount, status],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  },

  addOrderItem: (orderId, productId, quantity, price) => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO OrderItem (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, productId, quantity, price],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  getOrdersByUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT o.*, s.first_name, s.last_name, s.city, s.address_line
         FROM OrderTable o
         JOIN ShippingInfo s ON o.shipping_info_id = s.id
         WHERE o.user_id = ?
         ORDER BY o.order_date DESC`,
        [userId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  getOrderItems: (orderId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT oi.product_id, p.name, oi.quantity, oi.price
         FROM OrderItem oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },

  getOrderById: (orderId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT o.*, s.first_name, s.last_name, s.email, s.phone, s.city, s.address_line
         FROM OrderTable o
         JOIN ShippingInfo s ON o.shipping_info_id = s.id
         WHERE o.order_id = ?`,
        [orderId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  }
};

module.exports = Order;
