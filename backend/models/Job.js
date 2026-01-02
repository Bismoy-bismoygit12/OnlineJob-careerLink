const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyProfile",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requiredSkills: [
      {
        type: String,
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
    ],
    salary: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time"],
      required: true,
    },
    experienceRequired: {
      type: String,
      required: true,
    },
    numberOfPositions: {
      type: Number,
      required: true,
      min: 1,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Job", jobSchema);

