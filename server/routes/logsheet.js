const express = require("express");
const router = express.Router();
const logsheetController = require("../controllers/logsheetController");
const { authenticate } = require("../middleware/authMiddleware");
const multer = require("multer");
const { storage } = require("../utils/cloudinary"); // adjust path
const upload = multer({ storage });

router.post(
  "/submit",
  authenticate,
  upload.single("image"),
  logsheetController.submitLogsheet
);
router.get("/my-logs", authenticate, logsheetController.getMyLogsheets);
router.get(
  "/export-csv",
  authenticate,
  logsheetController.exportMyLogsheetsCSV
);
router.get(
  "/admin/logsheets",
  authenticate,
  logsheetController.getAllLogsheets
);
router.get(
  "/admin/logsheets/export",
  // authenticate,
  logsheetController.exportAllLogsheetsCSVAdmin
);

module.exports = router;
