const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Careerlink");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectDB;
