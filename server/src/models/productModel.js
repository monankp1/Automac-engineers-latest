const db = require('../config/db');

// Get all products
const getAllProducts = (callback) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

// Get a single product by ID
const getProductById = (id, callback) => {
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result[0]);
  });
};

// Create a new product
const createProduct = (product, callback) => {
  const { name } = product.name;
  const { type } = product.type;
  console.log(product);
  db.query(
    'INSERT INTO products (name, type) VALUES (?)',
    [name, type],
    (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    }
  );
};

// Update a product by ID
// const updateProduct = (id, product, callback) => {
//   const { name, price, description } = product;
//   db.query(
//     'UPDATE products SET name = ? WHERE id = ?',
//     [name, price, description, id],
//     (err, result) => {
//       if (err) return callback(err, null);
//       callback(null, result);
//     }
//   );
// };

// Delete a product by ID
const deleteProduct = (id, callback) => {
  db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
//   updateProduct,
  deleteProduct,
};
