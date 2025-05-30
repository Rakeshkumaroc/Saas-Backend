const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
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
      default: Date.now, // Set creation date
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Set initial updated date
    },
     isAdmin: {
    type: Boolean,
    default: false,
  },
  }
  
);

module.exports = mongoose.model("userCollection", userSchema);
