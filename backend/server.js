const express = require("express");
const path = require("path");
const connectDB = require("./db");

const app = express();

// ========================================
// 1. DATABASE CONNECTION
// ========================================
connectDB();

// ========================================
// 2. MIDDLEWARE
// ========================================

// Parse JSON request bodies
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========================================
// 3. API ROUTES (DO NOT TOUCH)
// ========================================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// ========================================
// 4. SERVE REACT BUILD
// ========================================
const buildPath = path.join(__dirname, "..", "frontend", "build");
app.use(express.static(buildPath));

// ========================================
// 5. FALLBACK ROUTE (🔥 ONLY FIX IS HERE 🔥)
// ========================================
// ❌ app.get("*", ...)  <-- NOT ALLOWED IN EXPRESS 5
// ✅ app.use(...)       <-- EXPRESS 5 SAFE

app.use((req, res) => {
  // If API route not found, return proper JSON
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ message: "API route not found" });
  }

  // Otherwise serve React app
  res.sendFile(path.join(buildPath, "index.html"));
});

// ========================================
// 6. START SERVER
// ========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Frontend: http://localhost:${PORT}`);
  console.log(`✅ API: http://localhost:${PORT}/api`);
});
