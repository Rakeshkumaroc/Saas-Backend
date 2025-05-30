const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema({
  orgName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  orgLogo: { type: String, default: null },
  branchCount: { type: String, default: null },
  isMultiBranch: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("orgCollection", orgSchema);
