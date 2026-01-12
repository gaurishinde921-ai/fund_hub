const express = require('express');
const router = express.Router();
const { uploadKYC, getKYCStatus } = require('../controllers/kycController');

router.post('/upload', uploadKYC);
router.get('/status/:userId', getKYCStatus);

module.exports = router;

