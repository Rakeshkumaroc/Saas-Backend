// models/OrganizationType.js
const mongoose = require("mongoose");

const orgTypeSchema = new mongoose.Schema({
  OrgTypeID: { type: String, required: true, unique: true }, // Custom ID, e.g., TYPE-001
  orgTypeName: { type: String, required: true },
  description: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("orgTypeCollection", orgTypeSchema);