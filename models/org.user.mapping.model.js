const mongoose = require("mongoose");

const OrgUserMappingSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    //   ref: "Organization",
     
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    //   ref: "User",
   
    },
    isPrimaryContact: {
      type: Boolean,
      default: false,
    },
    validFrom: {
      type: Date,
       default: Date.now,
    },
    validTo: {
      type: Date,
     default:null
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("OrgUserMapping", OrgUserMappingSchema);
