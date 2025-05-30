
// models/OrgUserMapping.js
const mongoose = require("mongoose");

const orgUserMappingSchema = new mongoose.Schema({
  MappingID: { type: String, required: true, unique: true }, // Custom ID, e.g., MAP-USER-001
  OrgID: { type: String, required: true, index: true },
  UserID: { type: String, required: true, index: true },
  BranchID: { type: String, index: true }, // Optional
  IsPrimaryContact: { type: Boolean, default: true },
  ValidFrom: { type: Date, required: true, index: true },
  ValidTo: { type: Date, required: true, index: true },
  IsActive: { type: Boolean, default: true },
  IsDeleted: { type: Boolean, default: false },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OrgUserMapping", orgUserMappingSchema);