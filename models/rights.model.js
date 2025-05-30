const mongoose = require("mongoose");

const rightSchema = new mongoose.Schema({
  rightName: {
    type: String,
    required: true,

    trim: true,
  },
  canPrint: {
    type: Boolean,
    default: false,
  },
  maxCopies: {
    type: Number,
    default: 0,
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

module.exports = mongoose.model("rightCollection", rightSchema);
