const mongoose = require("mongoose");

const resourceSpecificationTypeSchema = new mongoose.Schema({
  specTypeName: {
    type: String,
    required: true,
    trim: true,
    index: true,
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

module.exports = mongoose.model("ResourceSpecificationType", resourceSpecificationTypeSchema);
