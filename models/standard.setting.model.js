const mongoose = require("mongoose");

const standardSettingSchema = new mongoose.Schema({
  settingName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  isEnabled: {
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

module.exports = mongoose.model("standardSettingCollection", standardSettingSchema);
