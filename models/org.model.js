const mongoose = require('mongoose');

const orgSchema = new mongoose.Schema({
  orgName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true  },
  isActive: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'adminCollection' }
});

module.exports = mongoose.model('orgCollection', orgSchema);
