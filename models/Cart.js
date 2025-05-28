// const db = require('../utils/db');

// exports.getCart = async (userId) => {
//   const cart = await db.execute('SELECT * FROM cart WHERE user_id = ?', [userId]);
//   return cart;
// };

// exports.addOrUpdateCart = async (userId, product_Id, quantity) => {
//   const rows = await db.execute(
//     'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
//     [userId, product_Id]
//   );

//   if (rows&&rows.length > 0) {
//     // If the item already exists, update the quantity
//     await db.execute(
//       'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
//       [quantity, userId, product_Id]
//     );
//   } else {
//     await db.execute(
//       'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
//       [userId, product_Id, quantity]
//     );
//   }
// };


// exports.updateCartItem = async (userId, productId, quantity) => {
//   await db.execute(
//     'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
//     [quantity, userId, productId]
//   );
// };

// exports.removeCart = async (userId, productId) => {
//   await db.execute(
//     'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
//     [userId, productId]
//   );
// };
//version 2
// const db = require('../utils/db');

// exports.getCart = async (userId) => {
//   const cart = await db.execute('SELECT * FROM Cart WHERE user_id = ?', [userId]);
//   return cart;
// };
// // For createCart
// exports.createCart = async (userId) => {
//   try {
//     const [result] = await db.execute('INSERT INTO Cart (user_id) VALUES (?)', [userId]);
//     console.log('Create cart result:', result);
//     // If result.insertId undefined, check your DB driver docs or result structure
//     return result.insertId; 
//   } catch (err) {
//     console.error('Error creating cart:', err);
//     throw err;
//   }
// };

// exports.addItem = async (cartId, productId, quantity) => {
//   const [existing] = await db.execute(
//     'SELECT * FROM CartItem WHERE cart_id = ? AND product_id = ?',
//     [cartId, productId]
//   );

//   if (existing.length > 0) {
//     return db.execute(
//       'UPDATE CartItem SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
//       [quantity, cartId, productId]
//     );
//   } else {
//     return db.execute(
//       'INSERT INTO CartItem (cart_id, product_id, quantity) VALUES (?, ?, ?)',
//       [cartId, productId, quantity]
//     );
//   }
// };

// exports.removeItem = async (cartId, productId) => {
//   return db.execute(
//     'DELETE FROM CartItem WHERE cart_id = ? AND product_id = ?',
//     [cartId, productId]
//   );
// };

// exports.getItems = async (cartId) => {
//   const [items] = await db.execute(
//     `SELECT ci.product_id, p.name, p.price, ci.quantity 
//      FROM CartItem ci JOIN Product p ON ci.product_id = p.product_id 
//      WHERE ci.cart_id = ?`,
//     [cartId]
//   );
//   return items;
// };



//Version 3
const db = require('../utils/db');

const Cart = {
  getCart: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Cart WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // return first cart or undefined
      });
    });
  },

  createCart: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO Cart (user_id) VALUES (?)', [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId); // return newly created cart ID
      });
    });
  },
getCartIdByUserId: (userId) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT cart_id FROM Cart WHERE user_id = ?', [userId], (err, results) => {
      if (err) return reject(err);
      if (results.length > 0) resolve(results[0].cart_id);
      else resolve(null);
    });
  });
},

  addItem: (cartId, productId, quantity) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM CartItem WHERE cart_id = ? AND product_id = ?',
        [cartId, productId],
        (err, results) => {
          if (err) return reject(err);

          if (results.length > 0) {
            // Item exists, update quantity
            db.query(
              'UPDATE CartItem SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',
              [quantity, cartId, productId],
              (err2, result2) => {
                if (err2) return reject(err2);
                resolve(result2);
              }
            );
          } else {
            // New item, insert
            db.query(
              'INSERT INTO CartItem (cart_id, product_id, quantity) VALUES (?, ?, ?)',
              [cartId, productId, quantity],
              (err3, result3) => {
                if (err3) return reject(err3);
                resolve(result3);
              }
            );
          }
        }
      );
    });
  },

  removeItem: (cartId, productId) => {
    return new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM CartItem WHERE cart_id = ? AND product_id = ?',
        [cartId, productId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },
clearCart: (cartId) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM CartItem WHERE cart_id = ?', [cartId], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
},
updateItemQuantity: (cartId, productId, quantity) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE CartItem SET quantity = ? WHERE cart_id = ? AND product_id = ?',
      [quantity, cartId, productId],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
},
  getItems: (cartId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT *
         FROM CartItem ci 
         JOIN products p ON ci.product_id = p.id 
         WHERE ci.cart_id = ?`,
        [cartId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },
};

module.exports = Cart;
