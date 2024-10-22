const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Calibration = require('../models/calibrationModel');

// Get all products
const getAllCalibration = (req, res) => {
  Calibration.getAllCalibration((err, calibrations) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(calibrations);
  });
};

const getAllUnits = (req, res) => {
  Calibration.getAllUnits((err, units) => {
    if (err) return res.status(500).json({ error: err.message });

    // Separate the common units
    const commonUnits = units
      .filter(unit => unit.type === 'Common')
      .map(unit => unit.name); // Assuming 'name' is the relevant field for units

    // Create a new object to store units grouped by type
    const groupedUnits = units.reduce((acc, unit) => {
      if (unit.type !== 'Common') {
        if (!acc[unit.type]) {
          acc[unit.type] = [...commonUnits]; // Start with common units
        }
        acc[unit.type].push(unit.name); // Add specific unit name
      }
      return acc;
    }, {});

    res.json(groupedUnits); // Return the grouped units without "Common"
  });
};


// Get a single product by ID
const getCalibrationByCerti = (req, res) => {
  const certiId = req.params.id;
  // console.log('kirtan');
  Calibration.getCalibrationByCerti(certiId, (err, calibration) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!calibration) return res.status(404).json({ message: 'Calibration not found' });
    res.json(calibration);
  });
};

// Create a new product
const addCalibration = (req, res) => {
  const newCalibration = req.body;
  Calibration.addCalibration(newCalibration, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Calibration added', productId: result.insertId });
  });
};

const addUnit = (req, res) => {
          const newUnit = req.body;
          Calibration.addUnit(newUnit, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Unit added', productId: result.insertId });
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
const deleteCalibration = (req, res) => {
  const calibrationId = req.params.id;
  Calibration.deleteCalibration(calibrationId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Calibration not found' });
    res.json({ message: 'Calibration deleted' });
  });
};

module.exports = {
  getAllCalibration,
  getCalibrationByCerti,
  addCalibration,
  getAllUnits,
  addUnit,
  deleteCalibration,
};
