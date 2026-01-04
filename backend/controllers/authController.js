const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const CompanyProfile = require("../models/CompanyProfile");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/auth");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Register
const register = async (req, res) => {
  try {
    const { email, password, role, companyName } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["student", "company"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = new User({
      email,
      password,
      role,
      isApproved: role === "student", // Students auto-approved, companies need admin approval
    });

    await user.save();

    // Create profile based on role
    if (role === "student") {
      const studentProfile = new StudentProfile({ userId: user._id });
      await studentProfile.save();
    } else if (role === "company") {
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }
      const companyProfile = new CompanyProfile({
        userId: user._id,
        companyName,
      });
      await companyProfile.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check role match
    if (user.role !== role) {
      return res.status(401).json({ message: "Invalid role selection" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" });
    }

    // For companies, check approval
    if (user.role === "company" && !user.isApproved) {
      return res.status(403).json({ message: "Company account pending approval" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Admin Login (DEVELOPMENT ONLY - HARDCODED BYPASS)
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // DEVELOPMENT ONLY: Accept hardcoded admin credentials
    const ADMIN_EMAIL = "bismoyxyz@gmail.com";
    const ADMIN_PASSWORD = "123456";

    // Only accept the configured development admin credentials
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Ensure an admin user exists in the database so JWT-based auth works as expected.
    // If not present, create one (password will be hashed by the model pre-save hook).
    let adminUser = await User.findOne({ email });

    if (!adminUser) {
      adminUser = new User({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
        isActive: true,
        isApproved: true,
      });
      await adminUser.save();
    } else {
      // If the user exists but is not an admin, convert to admin and ensure active/approved.
      let changed = false;
      if (adminUser.role !== "admin") {
        adminUser.role = "admin";
        changed = true;
      }
      if (!adminUser.isActive) {
        adminUser.isActive = true;
        changed = true;
      }
      if (!adminUser.isApproved) {
        adminUser.isApproved = true;
        changed = true;
      }

      // If the stored password does not match the development password, overwrite it
      // so the hardcoded admin password works in development environments.
      const match = await adminUser.comparePassword(ADMIN_PASSWORD).catch(() => false);
      if (!match) {
        adminUser.password = ADMIN_PASSWORD;
        changed = true;
      }

      if (changed) await adminUser.save();
    }

    const token = generateToken(adminUser._id);

    const userData = {
      id: adminUser._id,
      email: adminUser.email,
      role: adminUser.role,
      isApproved: adminUser.isApproved,
    };

    return res.json({ success: true, message: "Admin login successful", token, user: userData });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Forgot Password (simplified - in production, send email with reset link)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists for security
      return res.json({ message: "If email exists, password reset instructions will be sent" });
    }

    // In production, send email with reset token
    // For now, just return success message
    res.json({ message: "Password reset instructions sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  forgotPassword,
};

