const Company = require('../models/companiesModel');

// Get all products
const getAllCompany = (req, res) => {
    Company.getAllCompany((err, companies) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(companies);
  });
};

// Get a single product by ID
const getCompanyById = (req, res) => {
  const companyId = req.params.id;
  Company.getCompanyById(companyId, (err, company) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!company) return res.status(404).json({ message: 'company not found' });
    res.json(company);
  });
};

// Create a new product
const createCompany = (req, res) => {
  const newCompany = req.body;
  console.log(newCompany);
  Company.createCompany(newCompany, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Company created', companyId: result.insertId });
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
const deleteCompany = (req, res) => {
  const companyId = req.params.id;
  Company.deleteCompany(companyId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Company not found' });
    res.json({ message: 'Company deleted' });
  });
};

module.exports = {
  getAllCompany,
  getCompanyById,
  createCompany,
  // updateProduct,
  deleteCompany,
};
