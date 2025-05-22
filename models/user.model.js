const mongoose = require("mongoose");

const userStructure = new mongoose.Schema(
  {
    email: { type: String, trim: true, required: true }, //unique:true
    phone: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    //
  },
  { timestamps: true }
);

module.exports = mongoose.model("userCollection", userStructure);
