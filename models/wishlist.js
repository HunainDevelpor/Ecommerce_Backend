// const db = require('../utils/db');

// exports.addToWishlist = async (userId, productId) => {
//   const existing = await db.execute(
//     'SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?',
//     [userId, productId]
//   );
//   if (existing.length > 0) return null; // Already in wishlist

//   const result = await db.execute(
//     'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)',
//     [userId, productId]
//   );
//   return result.insertId;
// };

// exports.removeFromWishlist = async (userId, productId) => {
//   const result = await db.execute(
//     'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
//     [userId, productId]
//   );
//   return result;
// };

// exports.getWishlist = async (userId) => {
//   const items = await db.execute(
//     `SELECT w.product_id, p.name, p.price, p.image 
//      FROM wishlist w 
//      JOIN products p ON w.product_id = p.id 
//      WHERE w.user_id = ?`,
//     [userId]
//   );
//   return items;
// };

//Version 2
// const db = require('../utils/db');

// exports.getWishlist = async (userId) => {
//   const result = await db.execute('SELECT * FROM Wishlist WHERE user_id = ?', [userId]);
//   const rows = result[0];
//   return rows && rows.length > 0 ? rows[0] : null;
// };

// exports.createWishlist = async (userId) => {
//   const result = await db.execute('INSERT INTO Wishlist (user_id) VALUES (?)', [userId]);
//   const insertResult = result[0];
//   return insertResult.insertId;
// };

// exports.addItem = async (wishlistId, productId) => {
//   const result = await db.execute(
//     'SELECT * FROM WishlistItem WHERE wishlist_id = ? AND product_id = ?',
//     [wishlistId, productId]
//   );
//   const existing = result[0];
//   if (existing.length > 0) return;

//   await db.execute(
//     'INSERT INTO WishlistItem (wishlist_id, product_id) VALUES (?, ?)',
//     [wishlistId, productId]
//   );
// };

// exports.removeItem = async (wishlistId, productId) => {
//   return db.execute(
//     'DELETE FROM WishlistItem WHERE wishlist_id = ? AND product_id = ?',
//     [wishlistId, productId]
//   );
// };

// exports.getItems = async (wishlistId) => {
//   const result = await db.execute(
//     `SELECT wi.product_id, p.name, p.price 
//      FROM WishlistItem wi 
//      JOIN Product p ON wi.product_id = p.product_id 
//      WHERE wi.wishlist_id = ?`,
//     [wishlistId]
//   );
//   return result[0]; // rows
// };


//version 3
const db = require('../utils/db');

const Wishlist = {
  getWishlist: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM Wishlist WHERE user_id = ?', [userId], (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null); // return null if not found
      });
    });
  },

  createWishlist: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('INSERT INTO Wishlist (user_id) VALUES (?)', [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      });
    });
  },

  clearWishlist: (userId) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM WishlistItem WHERE wishlist_id IN (SELECT wishlist_id FROM Wishlist WHERE user_id = ?)', [userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  addItem: (wishlistId, productId) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM WishlistItem WHERE wishlist_id = ? AND product_id = ?',
        [wishlistId, productId],
        (err, results) => {
          if (err) return reject(err);
          if (results.length > 0) return resolve(); // already exists

          db.query(
            'INSERT INTO WishlistItem (wishlist_id, product_id) VALUES (?, ?)',
            [wishlistId, productId],
            (err2) => {
              if (err2) return reject(err2);
              resolve();
            }
          );
        }
      );
    });
  },

  removeItem: (wishlistId, productId) => {
    return new Promise((resolve, reject) => {
      db.query(
        'DELETE FROM WishlistItem WHERE wishlist_id = ? AND product_id = ?',
        [wishlistId, productId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  getItems: (wishlistId) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT *
         FROM WishlistItem wi 
         JOIN products p ON wi.product_id = p.id 
         WHERE wi.wishlist_id = ?`,
        [wishlistId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }
};

module.exports = Wishlist;
