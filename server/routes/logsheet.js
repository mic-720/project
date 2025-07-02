// routes/logsheet.js
const express = require('express');
const router = express.Router();
const logsheetController = require('../controllers/logsheetController');
const { authenticate } = require('../middleware/authMiddleware');
router.post('/submit', authenticate, logsheetController.submitLogsheet);
router.get('/my-logs', authenticate, logsheetController.getMyLogsheets);
module.exports = router;
