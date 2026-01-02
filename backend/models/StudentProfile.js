const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    enum: [
      "Java",
      "Python",
      "C / C++",
      "JavaScript",
      "MERN Stack",
      "Full Stack",
      "Frontend Developer",
      "Backend Developer",
      "DSA",
      "Database (MongoDB, MySQL)",
    ],
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0,
  },
  relatedProjects: {
    type: String,
    default: "",
  },
});

const educationSchema = new mongoose.Schema({
  institute: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    enum: ["BSC", "MSC"],
    required: true,
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
    validate: {
      validator: function (v) {
        return /^\d+(\.\d+)?$/.test(v.toString());
      },
      message: "CGPA must be a number (decimal allowed)",
    },
  },
  passingYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 10,
  },
});

const experienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    personalDetails: {
      firstName: {
        type: String,
        default: "",
      },
      lastName: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
      profileImage: {
        type: String,
        default: "",
      },
    },
    education: [educationSchema],
    skills: [skillSchema],
    experience: [experienceSchema],
    resume: {
      generated: {
        type: String,
        default: "",
      },
      uploaded: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);

