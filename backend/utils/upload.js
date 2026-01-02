const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadsDir;
    
    if (file.fieldname === "profileImage") {
      uploadPath = path.join(uploadsDir, "profiles");
    } else if (file.fieldname === "logo") {
      uploadPath = path.join(uploadsDir, "logos");
    } else if (file.fieldname === "resume") {
      uploadPath = path.join(uploadsDir, "resumes");
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = {
    "profileImage": ["image/jpeg", "image/jpg", "image/png"],
    "logo": ["image/jpeg", "image/jpg", "image/png"],
    "resume": ["application/pdf"],
  };

  const allowedTypes = allowedMimes[file.fieldname] || [];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(", ")}`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: fileFilter,
});

module.exports = upload;

