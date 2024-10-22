const express = require('express');
const router = express.Router();
const calibrationController = require('../controller/calibrationController');
// const calibrationForm = require('../controller/calibrationForm');


// Define routes for CRUD operations
router.get('/', calibrationController.getAllCalibration);
// router.get('/form', calibrationController.generateExcel);
router.get('/get_unit', calibrationController.getAllUnits);
router.get('/:id', calibrationController.getCalibrationByCerti);
router.post('/', calibrationController.addCalibration);
router.post('/addunit', calibrationController.addUnit);
// router.put('/:id', calibrationController.updateProduct);
router.delete('/:id', calibrationController.deleteCalibration);

module.exports = router;
