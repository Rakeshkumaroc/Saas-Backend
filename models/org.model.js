const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema({
  OrgID: { type: String, required: true, unique: true }, // Custom ID, e.g., ORG-001
  orgName: { type: String, required: true },
  isMultiBranch: { type: String, enum: ["single", "multi"], default: "single", required: true },
  branchCount: { type: Number, default: 1, required: true },
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("orgCollection", orgSchema);