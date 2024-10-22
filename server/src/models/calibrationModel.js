const db = require('../config/db');

// Get all products
const getAllCalibration = (callback) => {
  db.query('SELECT * FROM calibration_details', (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

const getAllUnits = (callback) => {
          db.query('SELECT * FROM units', (err, results) => {
            if (err) return callback(err, null);
            callback(null, results);
          });
        };

// Get a single product by ID
const getCalibrationByCerti = (id, callback) => {
  db.query('SELECT * FROM calibration_details WHERE certificate_number = ?', [id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result[0]);
  });
};

// Create a new product
const addCalibration = (calibration, callback) => {
  const { certificate_number, ir_1, ir_2, ir_3, ir_4, ir_5} = calibration;
  db.query(
    'INSERT INTO calibration_details (certificate_number, ir_1, ir_2, ir_3, ir_4, ir_5) VALUES (?)',
    [certificate_number, ir_1, ir_2, ir_3, ir_4, ir_5],
    (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    }
  );
};

const addUnit = (unit, callback) => {
          db.query(
            'INSERT INTO units (unit) VALUES (?)',
            [unit.unit], // Use unit.unit instead of unit
            (err, result) => {
              if (err) return callback(err, null);
              callback(null, result);
            }
          );
        };

const deleteCalibration = (certificate_number, callback) => {
  db.query('DELETE FROM calibration_details WHERE id = ?', [certificate_number], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
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
