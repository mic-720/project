// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middleware/authMiddleware');
router.get('/pending-logs', authenticate, authorizeAdmin, adminController.getPendingLogsheets);
router.put('/update-status/:id', authenticate, authorizeAdmin, adminController.updateLogsheetStatus);
module.exports = router;