const express = require('express');
const router = express.Router();
const companyController = require('../controller/companiesController');

router.get('/', companyController.getAllCompany);
router.get('/:id', companyController.getCompanyById);
router.post('/', companyController.createCompany);
router.delete('/:id', companyController.deleteCompany);

module.exports = router;
