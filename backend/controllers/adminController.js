const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const CompanyProfile = require("../models/CompanyProfile");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Notification = require("../models/Notification");

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    const studentsWithProfiles = await Promise.all(
      students.map(async (student) => {
        const profile = await StudentProfile.findOne({ userId: student._id });
        return {
          ...student.toObject(),
          profile,
        };
      })
    );

    res.json(studentsWithProfiles);
  } catch (error) {
    console.error("Get all students error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: "company" })
      .select("-password")
      .sort({ createdAt: -1 });

    const companiesWithProfiles = await Promise.all(
      companies.map(async (company) => {
        const profile = await CompanyProfile.findOne({ userId: company._id });
        return {
          ...company.toObject(),
          profile,
        };
      })
    );

    res.json(companiesWithProfiles);
  } catch (error) {
    console.error("Get all companies error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Approve company
const approveCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await User.findById(companyId);
    if (!company || company.role !== "company") {
      return res.status(404).json({ message: "Company not found" });
    }

    company.isApproved = true;
    await company.save();

    // Create notification for company
    const notification = new Notification({
      userId: company._id,
      type: "company_approved",
      message: "Your company account has been approved",
      relatedId: company._id,
    });
    await notification.save();

    res.json({ message: "Company approved", company });
  } catch (error) {
    console.error("Approve company error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reject company
const rejectCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await User.findById(companyId);
    if (!company || company.role !== "company") {
      return res.status(404).json({ message: "Company not found" });
    }

    company.isApproved = false;
    company.isActive = false;
    await company.save();

    // Create notification for company
    const notification = new Notification({
      userId: company._id,
      type: "company_rejected",
      message: "Your company account has been rejected",
      relatedId: company._id,
    });
    await notification.save();

    res.json({ message: "Company rejected", company });
  } catch (error) {
    console.error("Reject company error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get platform statistics
const getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalCompanies = await User.countDocuments({ role: "company" });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();
    const approvedApplications = await Application.countDocuments({ status: "Approved" });
    const pendingApplications = await Application.countDocuments({ status: "Pending" });

    res.json({
      totalUsers,
      totalStudents,
      totalCompanies,
      totalJobs,
      activeJobs,
      totalApplications,
      approvedApplications,
      pendingApplications,
    });
  } catch (error) {
    console.error("Get statistics error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete user (admin can delete any user)
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete associated profile
    if (user.role === "student") {
      await StudentProfile.findOneAndDelete({ userId: user._id });
    } else if (user.role === "company") {
      await CompanyProfile.findOneAndDelete({ userId: user._id });
      // Delete company jobs
      const companyProfile = await CompanyProfile.findOne({ userId: user._id });
      if (companyProfile) {
        await Job.deleteMany({ companyId: companyProfile._id });
      }
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getAllCompanies,
  approveCompany,
  rejectCompany,
  getStatistics,
  deleteUser,
};

