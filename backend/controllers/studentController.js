const StudentProfile = require("../models/StudentProfile");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");
const path = require("path");
const fs = require("fs");

// Get student profile
const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update personal details
const updatePersonalDetails = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.user._id });
    }

    const { firstName, lastName, phone, address } = req.body;

    profile.personalDetails = {
      firstName: firstName || profile.personalDetails.firstName,
      lastName: lastName || profile.personalDetails.lastName,
      phone: phone || profile.personalDetails.phone,
      address: address || profile.personalDetails.address,
      profileImage: profile.personalDetails.profileImage,
    };

    await profile.save();
    res.json({ message: "Personal details updated", profile });
  } catch (error) {
    console.error("Update personal details error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.user._id });
    }

    // Delete old image if exists
    if (profile.personalDetails.profileImage) {
      const oldImagePath = path.join(__dirname, "..", profile.personalDetails.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    profile.personalDetails.profileImage = `/uploads/profiles/${req.file.filename}`;
    await profile.save();

    res.json({ message: "Profile image uploaded", imageUrl: profile.personalDetails.profileImage });
  } catch (error) {
    console.error("Upload profile image error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add education
const addEducation = async (req, res) => {
  try {
    const { institute, degree, cgpa, passingYear } = req.body;

    // Validation
    if (!institute || !degree || !cgpa || !passingYear) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate CGPA is numeric
    if (isNaN(cgpa) || parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10) {
      return res.status(400).json({ message: "CGPA must be a number between 0 and 10" });
    }

    // Validate passing year is numeric
    if (isNaN(passingYear) || parseInt(passingYear) < 1900) {
      return res.status(400).json({ message: "Passing year must be a valid number" });
    }

    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.user._id });
    }

    profile.education.push({
      institute,
      degree,
      cgpa: parseFloat(cgpa),
      passingYear: parseInt(passingYear),
    });

    await profile.save();
    res.json({ message: "Education added", profile });
  } catch (error) {
    console.error("Add education error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update education
const updateEducation = async (req, res) => {
  try {
    const { educationId } = req.params;
    const { institute, degree, cgpa, passingYear } = req.body;

    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const education = profile.education.id(educationId);
    if (!education) {
      return res.status(404).json({ message: "Education not found" });
    }

    if (institute) education.institute = institute;
    if (degree) education.degree = degree;
    if (cgpa !== undefined) {
      if (isNaN(cgpa) || parseFloat(cgpa) < 0 || parseFloat(cgpa) > 10) {
        return res.status(400).json({ message: "CGPA must be a number between 0 and 10" });
      }
      education.cgpa = parseFloat(cgpa);
    }
    if (passingYear !== undefined) {
      if (isNaN(passingYear)) {
        return res.status(400).json({ message: "Passing year must be a valid number" });
      }
      education.passingYear = parseInt(passingYear);
    }

    await profile.save();
    res.json({ message: "Education updated", profile });
  } catch (error) {
    console.error("Update education error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete education
const deleteEducation = async (req, res) => {
  try {
    const { educationId } = req.params;

    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.education.id(educationId).remove();
    await profile.save();

    res.json({ message: "Education deleted", profile });
  } catch (error) {
    console.error("Delete education error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add skill
const addSkill = async (req, res) => {
  try {
    const { skill, yearsOfExperience, relatedProjects } = req.body;

    if (!skill || yearsOfExperience === undefined) {
      return res.status(400).json({ message: "Skill and years of experience are required" });
    }

    if (isNaN(yearsOfExperience) || parseFloat(yearsOfExperience) < 0) {
      return res.status(400).json({ message: "Years of experience must be a valid number" });
    }

    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.user._id });
    }

    profile.skills.push({
      skill,
      yearsOfExperience: parseFloat(yearsOfExperience),
      relatedProjects: relatedProjects || "",
    });

    await profile.save();
    res.json({ message: "Skill added", profile });
  } catch (error) {
    console.error("Add skill error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update skill
const updateSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { skill, yearsOfExperience, relatedProjects } = req.body;

    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const skillItem = profile.skills.id(skillId);
    if (!skillItem) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (skill) skillItem.skill = skill;
    if (yearsOfExperience !== undefined) {
      if (isNaN(yearsOfExperience) || parseFloat(yearsOfExperience) < 0) {
        return res.status(400).json({ message: "Years of experience must be a valid number" });
      }
      skillItem.yearsOfExperience = parseFloat(yearsOfExperience);
    }
    if (relatedProjects !== undefined) skillItem.relatedProjects = relatedProjects;

    await profile.save();
    res.json({ message: "Skill updated", profile });
  } catch (error) {
    console.error("Update skill error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete skill
const deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.skills.id(skillId).remove();
    await profile.save();

    res.json({ message: "Skill deleted", profile });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add experience
const addExperience = async (req, res) => {
  try {
    const { companyName, role, position, startDate, endDate } = req.body;

    if (!companyName || !role || !position || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.user._id });
    }

    profile.experience.push({
      companyName,
      role,
      position,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    await profile.save();
    res.json({ message: "Experience added", profile });
  } catch (error) {
    console.error("Add experience error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update experience
const updateExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;
    const { companyName, role, position, startDate, endDate } = req.body;

    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const experience = profile.experience.id(experienceId);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    if (companyName) experience.companyName = companyName;
    if (role) experience.role = role;
    if (position) experience.position = position;
    if (startDate) experience.startDate = new Date(startDate);
    if (endDate) experience.endDate = new Date(endDate);

    await profile.save();
    res.json({ message: "Experience updated", profile });
  } catch (error) {
    console.error("Update experience error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete experience
const deleteExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;

    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.experience.id(experienceId).remove();
    await profile.save();

    res.json({ message: "Experience deleted", profile });
  } catch (error) {
    console.error("Delete experience error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new StudentProfile({ userId: req.user._id });
    }

    // Delete old resume if exists
    if (profile.resume.uploaded) {
      const oldResumePath = path.join(__dirname, "..", profile.resume.uploaded);
      if (fs.existsSync(oldResumePath)) {
        fs.unlinkSync(oldResumePath);
      }
    }

    profile.resume.uploaded = `/uploads/resumes/${req.file.filename}`;
    await profile.save();

    res.json({ message: "Resume uploaded", resumeUrl: profile.resume.uploaded });
  } catch (error) {
    console.error("Upload resume error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Generate resume (simple text-based resume from profile data)
const generateResume = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id }).populate("userId");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Generate simple resume text
    let resumeText = `RESUME\n`;
    resumeText += `===================\n\n`;
    resumeText += `Email: ${profile.userId.email}\n\n`;

    if (profile.personalDetails.firstName || profile.personalDetails.lastName) {
      resumeText += `Name: ${profile.personalDetails.firstName} ${profile.personalDetails.lastName}\n`;
    }
    if (profile.personalDetails.phone) {
      resumeText += `Phone: ${profile.personalDetails.phone}\n`;
    }
    if (profile.personalDetails.address) {
      resumeText += `Address: ${profile.personalDetails.address}\n`;
    }
    resumeText += `\n`;

    if (profile.education.length > 0) {
      resumeText += `EDUCATION\n`;
      resumeText += `----------\n`;
      profile.education.forEach((edu) => {
        resumeText += `${edu.degree} - ${edu.institute}\n`;
        resumeText += `CGPA: ${edu.cgpa}, Passing Year: ${edu.passingYear}\n\n`;
      });
    }

    if (profile.skills.length > 0) {
      resumeText += `SKILLS\n`;
      resumeText += `------\n`;
      profile.skills.forEach((skill) => {
        resumeText += `${skill.skill} - ${skill.yearsOfExperience} years\n`;
        if (skill.relatedProjects) {
          resumeText += `  Projects: ${skill.relatedProjects}\n`;
        }
      });
      resumeText += `\n`;
    }

    if (profile.experience.length > 0) {
      resumeText += `EXPERIENCE\n`;
      resumeText += `----------\n`;
      profile.experience.forEach((exp) => {
        resumeText += `${exp.position} at ${exp.companyName}\n`;
        resumeText += `Role: ${exp.role}\n`;
        resumeText += `Duration: ${exp.startDate.toDateString()} - ${exp.endDate.toDateString()}\n\n`;
      });
    }

    // Save generated resume
    profile.resume.generated = resumeText;
    await profile.save();

    res.json({ message: "Resume generated", resume: resumeText });
  } catch (error) {
    console.error("Generate resume error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Browse jobs
const browseJobs = async (req, res) => {
  try {
    const { jobType } = req.query;
    const query = { isActive: true };

    if (jobType) {
      query.jobType = jobType;
    }

    const jobs = await Job.find(query)
      .populate("companyId", "companyName logo")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error("Browse jobs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Apply for job
const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found" });
    }

    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      studentId: profile._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "Already applied for this job" });
    }

    const application = new Application({
      jobId,
      studentId: profile._id,
    });

    await application.save();
    res.json({ message: "Application submitted", application });
  } catch (error) {
    console.error("Apply for job error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get applied jobs
const getAppliedJobs = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const applications = await Application.find({ studentId: profile._id })
      .populate({
        path: "jobId",
        populate: {
          path: "companyId",
          select: "companyName logo",
        },
      })
      .sort({ appliedAt: -1 });

    res.json({
      totalApplications: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get applied jobs error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark notification as read
const markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOne({
      _id: notificationId,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
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
};

