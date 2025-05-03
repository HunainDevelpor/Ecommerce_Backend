// // const db = require('../utils/db');

// // const Product = {
// //   create: (name, description, price, stock, image) => {
// //     return db.execute('INSERT INTO products (name, description, price, stock, image) VALUES (?, ?, ?, ?, ?)', [name, description, price, stock, image]);
// //   },
// //   getAll: () => {
// //     return db.execute('SELECT * FROM products');
// //   },
// //   getById: (id) => {
// //     return db.execute('SELECT * FROM products WHERE id = ?', [id]);
// //   },
// //   update: (id, name, description, price, stock, image) => {
// //     return db.execute('UPDATE products SET name=?, description=?, price=?, stock=?, image=? WHERE id=?', [name, description, price, stock, image, id]);
// //   },
// //   delete: (id) => {
// //     return db.execute('DELETE FROM products WHERE id=?', [id]);
// //   }
// // };

// // module.exports = Product;



// const db = require('../utils/db');

// const Product = {
//   create: (
//     name,
//     description,
//     fullDescription,
//     price,
//     discount,
//     rating,
//     reviewCount,
//     stock,
//     category,
//     brand,
//     model,
//     colors,
//     variants,
//     featured,
//     createdAt,
//     image,
//     images
//   ) => {
//     const query = `
//       INSERT INTO products (
//         name, description, fullDescription, price, discount, rating,
//         reviewCount, stock, category, brand, model,
//         colors, variants, featured, createdAt, image, images
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const values = [
//       name,
//       description,
//       fullDescription,
//       price,
//       discount,
//       rating,
//       reviewCount,
//       stock,
//       category,
//       brand,
//       model,
//       JSON.stringify(colors),   // JSON array
//       JSON.stringify(variants), // JSON array
//       featured,
//       createdAt,
//       image,
//       JSON.stringify(images)    // JSON array
//     ];
//     return db.execute(query, values);
//   },

//   getAll: () => {
//     return db.execute('SELECT * FROM products');
//   },

//   getById: (id) => {
//     return db.execute('SELECT * FROM products WHERE id = ?', [id]);
//   },

//   update: (
//     id,
//     name,
//     description,
//     fullDescription,
//     price,
//     discount,
//     rating,
//     reviewCount,
//     stock,
//     category,
//     brand,
//     model,
//     colors,
//     variants,
//     featured,
//     createdAt,
//     image,
//     images
//   ) => {
//     const query = `
//       UPDATE products SET 
//         name = ?, description = ?, fullDescription = ?, price = ?, discount = ?, rating = ?,
//         reviewCount = ?, stock = ?, category = ?, brand = ?, model = ?, colors = ?, variants = ?,
//         featured = ?, createdAt = ?, image = ?, images = ?
//       WHERE id = ?
//     `;
//     const values = [
//       name,
//       description,
//       fullDescription,
//       price,
//       discount,
//       rating,
//       reviewCount,
//       stock,
//       category,
//       brand,
//       model,
//       JSON.stringify(colors),
//       JSON.stringify(variants),
//       featured,
//       createdAt,
//       image,
//       JSON.stringify(images),
//       id
//     ];
//     return db.execute(query, values);
//   },

//   delete: (id) => {
//     return db.execute('DELETE FROM products WHERE id = ?', [id]);
//   }
// };

// module.exports = Product;



const db = require('../utils/db');

const Product = {
  create: (
    name,
    description,
    fullDescription,
    price,
    discount,
    rating,
    reviewCount,
    stock,
    category,
    brand,
    model,
    colors,
    variants,
    featured,
    createdAt,
    image,
    images
  ) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO products (
          name, description, fullDescription, price, discount, rating,
          reviewCount, stock, category, brand, model,
          colors, variants, featured, createdAt, image, images
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        name,
        description,
        fullDescription,
        price,
        discount,
        rating,
        reviewCount,
        stock,
        category,
        brand,
        model,
        JSON.stringify(colors),
        JSON.stringify(variants),
        featured,
        createdAt,
        image,
        JSON.stringify(images)
      ];
      db.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM products', (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // return first item
      });
    });
  },

  update: (
    id,
    name,
    description,
    fullDescription,
    price,
    discount,
    rating,
    reviewCount,
    stock,
    category,
    brand,
    model,
    colors,
    variants,
    featured,
    createdAt,
    image,
    images
  ) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE products SET 
          name = ?, description = ?, fullDescription = ?, price = ?, discount = ?, rating = ?,
          reviewCount = ?, stock = ?, category = ?, brand = ?, model = ?, colors = ?, variants = ?,
          featured = ?, createdAt = ?, image = ?, images = ?
        WHERE id = ?
      `;
      const values = [
        name,
        description,
        fullDescription,
        price,
        discount,
        rating,
        reviewCount,
        stock,
        category,
        brand,
        model,
        JSON.stringify(colors),
        JSON.stringify(variants),
        featured,
        createdAt,
        image,
        JSON.stringify(images),
        id
      ];
      db.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  delete: (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
};

module.exports = Product;
