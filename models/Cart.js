const db = require('../utils/db');

exports.getCart = async (userId) => {
  const cart = await db.execute('SELECT * FROM cart WHERE user_id = ?', [userId]);
  return cart;
};

exports.addOrUpdateCart = async (userId, product_Id, quantity) => {
  const rows = await db.execute(
    'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
    [userId, product_Id]
  );

  if (rows&&rows.length > 0) {
    // If the item already exists, update the quantity
    await db.execute(
      'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, product_Id]
    );
  } else {
    await db.execute(
      'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
      [userId, product_Id, quantity]
    );
  }
};


exports.updateCartItem = async (userId, productId, quantity) => {
  await db.execute(
    'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
    [quantity, userId, productId]
  );
};

exports.removeCart = async (userId, productId) => {
  await db.execute(
    'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
    [userId, productId]
  );
};
