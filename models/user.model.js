const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 
  email: {
    type: String,
    trim: true,
    required: [true, "Email is required"],
    unique: true, // Ensure email uniqueness
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
    sparse: true, // Allows unique constraint with null/empty values
    unique: true, // Ensure phone uniqueness when provided
  },
  password: {
    type: String,
    trim: true,
  },
  profilePic: {
    type: String,
    trim: true,
  },
  isGoogleUser: {
    type: Boolean,
    default: false, // Flag for Google users
  },
  isGoogleVerified: {
    type: Boolean,
    default: false, // Flag for Google-verified users
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("userCollection", userSchema);