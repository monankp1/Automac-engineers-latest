const Product = require('../models/productModel');

// Get all products
const getAllProducts = (req, res) => {
  Product.getAllProducts((err, products) => {
    if (err) return res.status(500).json({ error: err.message });

    // Separate the common products
    const commonProducts = products
      .filter(product => product.type === 'Common')
      .map(product => product.name);

    // Create a new object to store products grouped by type
    const groupedProducts = products.reduce((acc, product) => {
      if (product.type !== 'Common') {
        if (!acc[product.type]) {
          acc[product.type] = [...commonProducts]; // Start with common products
        }
        acc[product.type].push(product.name); // Add specific product name
      }
      console.log('kirtan');
      return acc;
    }, {});

    res.json(groupedProducts); // Return the grouped products without "Common"
  });
};

// Get a single product by ID
const getProductById = (req, res) => {
  const productId = req.params.id;
  Product.getProductById(productId, (err, product) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  });
};

// Create a new product
const createProduct = (req, res) => {
  const newProduct = req.body;
  // console.log(newProduct);
  Product.createProduct(newProduct, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Product created', productId: result.insertId });
  });
};

// Update a product by ID
// const updateProduct = (req, res) => {
//   const productId = req.params.id;
//   const updatedProduct = req.body;
//   Product.updateProduct(productId, updatedProduct, (err, result) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
//     res.json({ message: 'Product updated' });
//   });
// };

// Delete a product by ID
const deleteProduct = (req, res) => {
  const productId = req.params.id;
  Product.deleteProduct(productId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  });
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  // updateProduct,
  deleteProduct,
};
