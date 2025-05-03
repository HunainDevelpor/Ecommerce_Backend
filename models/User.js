// const {db} = require('../utils/db');

// const User = {
//   create: (name, email, password, role = 'user') => {
//     return db.execute('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, role]);
//   },
//   findByEmail: (email) => {
//     return db.execute('SELECT * FROM users WHERE email = ?', [email]);
//   },
//   findById: (id) => {
//     return db.execute('SELECT * FROM users WHERE id = ?', [id]);
//   }
// };

// module.exports = User;

// models/User.js
const db = require('../utils/db');

const User = {
  create: (name, email, password, role = 'user') => {
    return new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, password, role],
        (err, results) => {
          if (err) return reject(err);
          resolve(results); // OK
        }
      );
    });
  },

  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]); // OK: first row
        }
      );
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]); // OK
        }
      );
    });
  }
};

module.exports = User;
