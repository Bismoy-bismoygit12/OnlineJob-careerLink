const express = require("express");
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  forgotPassword,
} = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);
router.post("/forgot-password", forgotPassword);

module.exports = router;

