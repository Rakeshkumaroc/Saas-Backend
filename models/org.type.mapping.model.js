const mongoose = require("mongoose");

const orgTypeMappingSchema = new mongoose.Schema({
<<<<<<< HEAD
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
=======
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  orgTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  validFrom: {
    type: Date,
    // required: true,
    default: Date.now,
  },
  validTo: {
    type: Date,
    // required: true,
    default: null,
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

module.exports = mongoose.model("orgTypeMapping", orgTypeMappingSchema);
>>>>>>> 5fdda80a6b2375dbf5988701eab03fc96147498d
