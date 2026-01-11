// backend/models/userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  profilePic: { type: String, default: "" }, // URL of image
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
