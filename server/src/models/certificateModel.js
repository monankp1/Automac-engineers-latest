const db = require('../config/db');

// Get all calibration certificates
const getAllCertificates = (callback) => {
  db.query('SELECT * FROM certificates', (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

// Get a single calibration certificate by certificate number
const getCertificateById = (id, callback) => {
  db.query('SELECT * FROM certificates WHERE certificate_number = ?', [id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result[0]);
  });
};

const getLastcertificate = (callback) => {
  db.query(`SELECT certificate_number FROM certificates ORDER BY certificate_number DESC LIMIT 1`, (err, result) => {
    if (err) return callback(err, null);
    callback(null, result[0]);
  });
};


// Create a new calibration certificate
const createCertificate = (certificate, callback) => {
          // console.log('new',certificate);
          const {product, certificate_number, date_of_calibration, company_name, intr_sr_no, intr_details, instr_make, instr_model, instr_range, instr_date, mst_model, mst_last_cal_date, mst_make, mst_range} = certificate;
          db.query(
            `INSERT INTO certificates 
            (product, certificate_number, date_of_calibration, company_name, 
            intr_sr_no, intr_details, instr_make, instr_model, instr_range, instr_date, 
            mst_model, mst_last_cal_date, mst_make, mst_range) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [product, certificate_number, date_of_calibration, company_name, intr_sr_no, intr_details, instr_make, instr_model, instr_range, instr_date, mst_model, mst_last_cal_date, mst_make, mst_range],
            (err, result) => {
              if (err) return callback(err, null);
              callback(null, result);
            }
          );
        };

const createCalibrationRecord = (calibration, callback) => {
  // console.log('new',calibration);
  const {certificate_number, ir_1, ir_2, ir_3, ir_4, ir_5} = calibration;
  db.query(
    `INSERT INTO calibration_details 
    (certificate_number, ir_1, ir_2, ir_3, ir_4, ir_5) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [certificate_number, ir_1, ir_2, ir_3, ir_4, ir_5],
    (err, result) => {
      if (err) return callback(err, null);
      callback(null, result);
    }
  );
};
        

// Delete a calibration certificate by ID
const deleteCertificate = (certificate_number, callback) => {
  db.query('DELETE FROM certificates WHERE certificate_number = ?', [certificate_number], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  });
};

module.exports = {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  createCalibrationRecord,
  getLastcertificate,
  deleteCertificate,
};
