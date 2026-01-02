const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../utils/upload");
const {
  getProfile,
  updateProfile,
  uploadLogo,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobApplications,
  getAllApplications,
  viewStudentResume,
  approveApplication,
  rejectApplication,
} = require("../controllers/companyController");

// All routes require authentication and company role
router.use(authenticate);
router.use(authorize("company"));

// Profile routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/logo", upload.single("logo"), uploadLogo);

// Job routes
router.post("/jobs", createJob);
router.get("/jobs", getMyJobs);
router.put("/jobs/:jobId", updateJob);
router.delete("/jobs/:jobId", deleteJob);

// Application routes
router.get("/jobs/:jobId/applications", getJobApplications);
router.get("/applications", getAllApplications);
router.get("/applications/students/:studentId/resume", viewStudentResume);
router.put("/applications/:applicationId/approve", approveApplication);
router.put("/applications/:applicationId/reject", rejectApplication);

module.exports = router;

