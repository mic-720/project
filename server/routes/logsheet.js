// routes/logsheet.js
const express = require('express');
const router = express.Router();
const logsheetController = require('../controllers/logsheetController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/submit', authenticate, logsheetController.submitLogsheet);
router.get('/my-logs', authenticate, logsheetController.getMyLogsheets);
router.get('/export-csv', authenticate, logsheetController.exportMyLogsheetsCSV);

module.exports = router;
