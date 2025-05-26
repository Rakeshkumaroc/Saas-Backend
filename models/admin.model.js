const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: { type: String, trim: true, required: true }, 
    userName: { type: String, trim: true, required: true }, 
    phone: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("adminCollection", adminSchema);
