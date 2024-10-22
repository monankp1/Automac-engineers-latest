const express = require('express');
const router = express.Router();
const certificateController = require('../controller/certificateController');

router.get('/', certificateController.getAllCertificates);
// router.get('/:id', certificateController.getCertificateById);
router.post('/', certificateController.createCertificate);
router.delete('/:id', certificateController.deleteCertficate);
// router.get('/new_certificate', certificateController.run);

module.exports = router;
