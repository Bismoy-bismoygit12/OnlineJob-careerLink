const CompanyProfile = require("../models/CompanyProfile");
const Job = require("../models/Job");
const Application = require("../models/Application");
const StudentProfile = require("../models/StudentProfile");
const Notification = require("../models/Notification");
const path = require("path");
const fs = require("fs");

// Get company profile
const getProfile = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update company profile
const updateProfile = async (req, res) => {
  try {
    let profile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new CompanyProfile({ userId: req.user._id });
    }

    const { companyName, address, description } = req.body;

    if (companyName) profile.companyName = companyName;
    if (address) profile.address = address;
    if (description) profile.description = description;

    await profile.save();
    res.json({ message: "Profile updated", profile });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload company logo
const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let profile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new CompanyProfile({ userId: req.user._id });
    }

    // Delete old logo if exists
    if (profile.logo) {
      const oldLogoPath = path.join(__dirname, "..", profile.logo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    profile.logo = `/uploads/logos/${req.file.filename}`;
    await profile.save();

    res.json({ message: "Logo uploaded", logoUrl: profile.logo });
  } catch (error) {
    console.error("Upload logo error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create job posting
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      salary,
      position,
      jobType,
      experienceRequired,
      numberOfPositions,
    } = req.body;

    if (!title || !description || !requiredSkills || !salary || !position || !jobType || !experienceRequired || !numberOfPositions) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const profile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const job = new Job({
      companyId: profile._id,
      title,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills],
      salary,
      position,
      jobType,
      experienceRequired,
      numberOfPositions: parseInt(numberOfPositions),
    });

    await job.save();
    res.status(201).json({ message: "Job created", job });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all jobs posted by company
const getMyJobs = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const jobs = await Job.find({ companyId: profile._id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error("Get my jobs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const profile = await CompanyProfile.findOne({ userId: req.user._id });

    const job = await Job.findOne({ _id: jobId, companyId: profile._id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const {
      title,
      description,
      requiredSkills,
      salary,
      position,
      jobType,
      experienceRequired,
      numberOfPositions,
      isActive,
    } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (requiredSkills) job.requiredSkills = Array.isArray(requiredSkills) ? requiredSkills : [requiredSkills];
    if (salary) job.salary = salary;
    if (position) job.position = position;
    if (jobType) job.jobType = jobType;
    if (experienceRequired) job.experienceRequired = experienceRequired;
    if (numberOfPositions) job.numberOfPositions = parseInt(numberOfPositions);
    if (isActive !== undefined) job.isActive = isActive;

    await job.save();
    res.json({ message: "Job updated", job });
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const profile = await CompanyProfile.findOne({ userId: req.user._id });

    const job = await Job.findOne({ _id: jobId, companyId: profile._id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get applications for a job
const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const profile = await CompanyProfile.findOne({ userId: req.user._id });

    const job = await Job.findOne({ _id: jobId, companyId: profile._id });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const applications = await Application.find({ jobId })
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "email",
        },
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Get job applications error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all applications for company
const getAllApplications = async (req, res) => {
  try {
    const profile = await CompanyProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const jobs = await Job.find({ companyId: profile._id });
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate({
        path: "jobId",
        select: "title",
      })
      .populate({
        path: "studentId",
        populate: {
          path: "userId",
          select: "email",
        },
      })
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Get all applications error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// View student resume
const viewStudentResume = async (req, res) => {
  try {
    const { studentId } = req.params;

    const studentProfile = await StudentProfile.findById(studentId).populate("userId", "email");
    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    res.json({
      profile: studentProfile,
      resume: {
        generated: studentProfile.resume.generated,
        uploaded: studentProfile.resume.uploaded,
      },
    });
  } catch (error) {
    console.error("View student resume error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve application
const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const profile = await CompanyProfile.findOne({ userId: req.user._id });

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if job belongs to company
    const job = await Job.findOne({ _id: application.jobId._id, companyId: profile._id });
    if (!job) {
      return res.status(403).json({ message: "Access denied" });
    }

    application.status = "Approved";
    await application.save();

    // Create notification for student
    const studentProfile = await StudentProfile.findById(application.studentId);
    if (studentProfile) {
      const notification = new Notification({
        userId: studentProfile.userId,
        type: "application_approved",
        message: `Your application for ${job.title} has been approved`,
        relatedId: application._id,
      });
      await notification.save();
    }

    res.json({ message: "Application approved", application });
  } catch (error) {
    console.error("Approve application error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reject application
const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const profile = await CompanyProfile.findOne({ userId: req.user._id });

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if job belongs to company
    const job = await Job.findOne({ _id: application.jobId._id, companyId: profile._id });
    if (!job) {
      return res.status(403).json({ message: "Access denied" });
    }

    application.status = "Rejected";
    await application.save();

    // Create notification for student
    const studentProfile = await StudentProfile.findById(application.studentId);
    if (studentProfile) {
      const notification = new Notification({
        userId: studentProfile.userId,
        type: "application_rejected",
        message: `Your application for ${job.title} has been rejected`,
        relatedId: application._id,
      });
      await notification.save();
    }

    res.json({ message: "Application rejected", application });
  } catch (error) {
    console.error("Reject application error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
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
};

