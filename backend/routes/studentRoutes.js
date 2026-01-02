const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth");
const upload = require("../utils/upload");
const {
  getProfile,
  updatePersonalDetails,
  uploadProfileImage,
  addEducation,
  updateEducation,
  deleteEducation,
  addSkill,
  updateSkill,
  deleteSkill,
  addExperience,
  updateExperience,
  deleteExperience,
  uploadResume,
  generateResume,
  browseJobs,
  applyForJob,
  getAppliedJobs,
  getNotifications,
  markNotificationRead,
} = require("../controllers/studentController");

// All routes require authentication and student role
router.use(authenticate);
router.use(authorize("student"));

// Profile routes
router.get("/profile", getProfile);
router.put("/profile/personal-details", updatePersonalDetails);
router.post("/profile/image", upload.single("profileImage"), uploadProfileImage);

// Education routes
router.post("/education", addEducation);
router.put("/education/:educationId", updateEducation);
router.delete("/education/:educationId", deleteEducation);

// Skills routes
router.post("/skills", addSkill);
router.put("/skills/:skillId", updateSkill);
router.delete("/skills/:skillId", deleteSkill);

// Experience routes
router.post("/experience", addExperience);
router.put("/experience/:experienceId", updateExperience);
router.delete("/experience/:experienceId", deleteExperience);

// Resume routes
router.post("/resume/upload", upload.single("resume"), uploadResume);
router.post("/resume/generate", generateResume);

// Jobs routes
router.get("/jobs", browseJobs);
router.post("/jobs/:jobId/apply", applyForJob);
router.get("/jobs/applied", getAppliedJobs);

// Notifications routes
router.get("/notifications", getNotifications);
router.put("/notifications/:notificationId/read", markNotificationRead);

module.exports = router;

