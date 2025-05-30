const mongoose = require("mongoose");

const orgTypeMappingSchema = new mongoose.Schema({
  MappingID: { type: String, required: true, unique: true }, // Custom ID, e.g., MAP-TYPE-001
  OrgID: { type: String, required: true, index: true },
  OrgTypeID: { type: String, required: true, index: true },
  ValidFrom: { type: Date, required: true, index: true },
  ValidTo: { type: Date, required: true, index: true },
  IsActive: { type: Boolean, default: true },
  IsDeleted: { type: Boolean, default: false },
  CreatedAt: { type: Date, default: Date.now },
  UpdatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("OrgTypeMapping", orgTypeMappingSchema);