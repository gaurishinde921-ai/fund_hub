const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');

router.get('/:userId', getSettings);
router.put('/:userId', updateSettings);

module.exports = router;
