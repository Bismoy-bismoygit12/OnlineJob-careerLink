const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const {
  getAllStudents,
  getAllCompanies,
  approveCompany,
  rejectCompany,
  getStatistics,
  deleteUser,
} = require("../controllers/adminController");

// All routes require authentication and admin role
router.use(authenticate);
router.use(authorize("admin"));

// User management
router.get("/students", getAllStudents);
router.get("/companies", getAllCompanies);
router.put("/companies/:companyId/approve", approveCompany);
router.put("/companies/:companyId/reject", rejectCompany);
router.delete("/users/:userId", deleteUser);

// Statistics
router.get("/statistics", getStatistics);

module.exports = router;

