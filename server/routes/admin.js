const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

router.get(
  "/pending-logs",
  authenticate,
  authorizeAdmin,
  adminController.getPendingLogsheets
);
router.put(
  "/update-status/:id",
  authenticate,
  authorizeAdmin,
  adminController.updateLogsheetStatus
);
router.post(
  "/users/create",
  authenticate,
  authorizeAdmin,
  authController.registerUsers
); // ✅ Added

module.exports = router;
