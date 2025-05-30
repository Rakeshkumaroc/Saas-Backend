const mongoose = require("mongoose");

const orgTypeMappingSchema = new mongoose.Schema({
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
