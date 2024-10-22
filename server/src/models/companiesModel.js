const db = require('../config/db');

// Get all calibration certificates
const getAllCompany = (callback) => {
  db.query('SELECT * FROM companies', (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

// Get a single calibration certificate by certificate number
const getCompanyById = (id, callback) => {
  db.query('SELECT * FROM companies WHERE id = ?', [id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result[0]);
  });
};

// Create a new calibration certificate
const createCompany = (company, callback) => {
  const {name, address} = company;
  db.query(
    'INSERT INTO companies (name, address) VALUES (?, ?)',
    [name, address],
    (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    }
  );
};

// Delete a calibration certificate by ID
const deleteCompany = (id, callback) => {
  db.query('DELETE FROM companies WHERE id = ?', [id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

module.exports = {
  getAllCompany,
  getCompanyById,
  createCompany,
  deleteCompany,
};
