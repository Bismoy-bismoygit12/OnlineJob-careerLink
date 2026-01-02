const jwt = require("jsonwebtoken");
const User = require("../models/User");

// JWT Secret (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || "careerlink_secret_key_2024";

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid or inactive token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    // For company role, check if approved
    if (req.user.role === "company" && !req.user.isApproved) {
      return res.status(403).json({ message: "Company account pending approval" });
    }

    next();
  };
};

module.exports = { authenticate, authorize, JWT_SECRET };

