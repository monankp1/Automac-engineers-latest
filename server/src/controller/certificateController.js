const Certificate = require('../models/certificateModel');
const Product = require('../models/productModel');
const Calibration = require('../models/calibrationModel');
const fs = require('fs');
const puppeteer = require('puppeteer');
const { Console } = require('console');
const path = require('path');

// Get all products
const getAllCertificates = (req, res) => {
  Certificate.getAllCertificates((err, certificates) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(certificates);
  });
};

// Get a single product by ID
// const getCertificateById = (req, res) => {
//   const certificateId = req.params.id;
//   Certificate.getProductById(certificateId, (err, certificate) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
//     res.json(certificate);
//   });
// };

// Create a new product


const createCertificate = async (req, res) => {
  let newCertificate = req.body;

  // Initialize the formatted object
  let formattedCertificate = {
      companyName: newCertificate.companyName,
      companyAddress: newCertificate.companyAddress,
      instrumentSerial: newCertificate.instrumentSerial,
      instrumentDetails: newCertificate.instrumentDetails,
      masterModel: newCertificate.masterModel,
      masterCalDate: newCertificate.masterCalDate,
      masterMake: newCertificate.masterMake,
      masterRange: newCertificate.masterRange,
      instrumentModel: newCertificate.instrumentModel,
      instrumentDate: newCertificate.instrumentDate,
      instrumentMake: newCertificate.instrumentMake,
      instrumentRange: newCertificate.instrumentRangeLow + "-" + newCertificate.instrumentRangeHigh // Combine range low and high
  };

  // Iterate through the reading keys (0, 1, 2, ...) in newCertificate
  for (let i = 0; i < Object.keys(newCertificate).length - 13; i++) {
      const readingKey = i.toString(); // Convert index to string

      // Check if the key exists in newCertificate
      if (newCertificate.hasOwnProperty(readingKey)) {
          formattedCertificate[`reading${i + 1}`] = parseFloat(newCertificate[readingKey].reading);
          formattedCertificate[`upDiff${i + 1}`] = newCertificate[readingKey].upDiff.toFixed(2);
          formattedCertificate[`downDiff${i + 1}`] = newCertificate[readingKey].downDiff.toFixed(2);
          formattedCertificate[`upAccuracy${i + 1}`] = (newCertificate[readingKey].upAccuracy * 100).toFixed(2) + "%";
          formattedCertificate[`downAccuracy${i + 1}`] = (newCertificate[readingKey].downAccuracy * 100).toFixed(2) + "%";
          formattedCertificate[`upOutput${i + 1}`] = parseFloat(newCertificate[readingKey].upOutput);
          formattedCertificate[`downOutput${i + 1}`] = parseFloat(newCertificate[readingKey].downOutput);
          formattedCertificate[`remark${i + 1}`] = newCertificate[readingKey].remark;
          formattedCertificate[`upReading${i + 1}`] = newCertificate[readingKey].upReading;
          formattedCertificate[`downReading${i + 1}`] = newCertificate[readingKey].downReading;
      }
  }

  // Output the formatted certificate
  newCertificate = formattedCertificate;
  console.log(formattedCertificate);

  try {
      const lastCertificate = await new Promise((resolve, reject) => {
          Certificate.getLastcertificate((err, result) => {
              if (err) return reject(err);
              resolve(result);
          });
      });
      console.log(lastCertificate);
      let newCertificateNumber;

      if (!lastCertificate || lastCertificate.certificate_number === null) {
          newCertificateNumber = 1; // If no last certificate found
      } else {
          const lastNumber = parseInt(lastCertificate.certificate_number.replace('ATM', ''), 10);
          newCertificateNumber = lastNumber + 1; // Increment
      }

      const formattedCertificateNumber = `ATM${String(newCertificateNumber).padStart(5, '0')}`;

      // Create calibration results HTML (similar to your current approach)
      const calibrationResults = generateCalibrationResults(newCertificate);

      const htmlTemplate = await fs.promises.readFile('new_certificate.html', 'utf8');

      const htmlContent = htmlTemplate
          .replace('{{certificate_number}}', formattedCertificateNumber)
          .replace('{{companyName}}', newCertificate.companyName || '')
          .replace('{{companyAddress}}', newCertificate.companyAddress || '')
          .replace('{{instrumentSerial}}', newCertificate.instrumentSerial || '')
          .replace('{{instrumentDetails}}', newCertificate.instrumentDetails || '')
          .replace('{{masterModel}}', newCertificate.masterModel || '')
          .replace('{{masterCalDate}}', newCertificate.masterCalDate || '')
          .replace('{{masterMake}}', newCertificate.masterMake || '')
          .replace('{{masterRange}}', newCertificate.masterRange || '')
          .replace('{{instrumentModel}}', newCertificate.instrumentModel || '')
          .replace('{{instrumentDate}}', newCertificate.instrumentDate || '')
          .replace('{{instrumentMake}}', newCertificate.instrumentMake || '')
          .replace('{{instrumentRange}}', newCertificate.instrumentRange || '')
          .replace('{{calibration_results}}', calibrationResults);

      // Generate PDF
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(htmlContent);
      const pdfBuffer = await page.pdf({ format: 'A4' });

      // Close the browser
      await browser.close();
      
      // Save the PDF to a file
      const outputPath = path.join(__dirname, 'pdfs', `${formattedCertificateNumber}.pdf`); // Adjust the path as necessary
      await fs.promises.writeFile(outputPath, pdfBuffer);

      // Save the new certificate number in the database
      await Certificate.createCertificate({
          certificate_number: formattedCertificateNumber,
          // Include other necessary fields here
      });

      // Send the PDF buffer as a response
      res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${formattedCertificateNumber}.pdf"`,
      });
      res.send(pdfBuffer);

  } catch (err) {
      console.error('Error generating certificate:', err);
      res.status(500).json({ error: err.message });
  }
};

const generateCalibrationResults = (newCertificate) => {
  let results = '';
  for (let i = 1; i <= 5; i++) {
      results += `
          <tr>
              <td>${i}</td>
              <td>${newCertificate[`reading${i}`] || ''}</td>
              <td>${(i - 1) * 25}</td>
              <td>${newCertificate[`upReading${i}`] || ''}</td>
              <td>${newCertificate[`downReading${i}`] || ''}</td>
              <td>${newCertificate[`upDiff${i}`] || ''}</td>
              <td>${newCertificate[`downDiff${i}`] || ''}</td>
              <td>${newCertificate[`upAccuracy${i}`] || '0.00%'}</td>
              <td>${newCertificate[`downAccuracy${i}`] || ''}</td>
              <td>${newCertificate[`upOutput${i}`] || ''}</td>
              <td>${newCertificate[`downOutput${i}`] || ''}</td>
              <td>${newCertificate[`remark${i}`] || ''}</td>
          </tr>
      `;
  }
  return results;
};



const newCertificate = async (req, res) => {
  try {
    const products = await new Promise((resolve, reject) => {
      Product.getAllProducts((err, products) => {
        if (err) {
          reject(err);
        } else {
          resolve(products);
        }
      });
    });

    const units = await new Promise((resolve, reject) => {
      Calibration.getAllUnits((err, units) => {
        if (err) {
          reject(err);
        } else {
          resolve(units);
        }
      });
    });

    let data = [];
    data.push({ units: units });
    data.push({ products: products });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



const deleteCertficate = (req, res) => {
  const certificateId = req.params.id;
  Certificate.deleteCertificate(certificateId, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Certificate not found' });
    res.json({ message: 'Certificate deleted' });
  });
};

module.exports = {
  getAllCertificates,
  // getCertificateById,
  createCertificate,
  newCertificate,
  // updateProduct,
  deleteCertficate,
};
