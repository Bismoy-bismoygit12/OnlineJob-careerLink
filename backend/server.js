const express = require("express");
const path = require("path");
const connectDB = require("./db");
const cors = require("cors"); // <--- ADD THIS

const app = express();

// ✅ REPLACE THE MANUAL BLOCK WITH THIS:
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// ✅ REQUIRED
app.use(express.json());

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// database connection
connectDB();

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

// test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});