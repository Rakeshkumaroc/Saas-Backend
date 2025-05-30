const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  resourceName: {
    type: String,
    required: true,
    trim: true,
    
  },
  description: {
    type: String,
    default: "",
    trim: true,
  },
  value: {
    type: Number,
    default: 0,
  },
  validFrom: {
    type: Date,
    required: true,
  },
  validTo: {
    type: Date,
    required: true,
  },
  language: {
    type: String,
    required: true,
    trim: true,
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

module.exports = mongoose.model("resourceCollection", resourceSchema);
