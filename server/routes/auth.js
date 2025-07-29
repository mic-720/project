const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");
router.post("/register", authenticate, authController.registerUsers); // Only admin can register
router.post("/login", authController.login);
router.post("/change-password", authenticate, authController.changePassword);
module.exports = router;
