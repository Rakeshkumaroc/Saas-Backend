const OrgModel = require("../models/org.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const OrgTypeMapping = require("../models/org.type.mapping.model");
const OrgUserMapping = require("../models/org.user.mapping.model");
// Create new OrgModel
const createOrg = async (req, res, next) => {
  try {
    console.log(req.body)
    const {
      orgName,
      email,
      phone,
      orgTypeId,
      userId,
      orgLogo,
      branchCount,
      isMultiBranch,
    } = req.body;

    if (!orgName || !email || !phone || !orgTypeId || !userId) {
      return next(new ApiError("All fields are required", 400));
    }

    // Check if email or phone already exists in Org
    const existingOrg = await OrgModel.findOne({
      $or: [{ email }, { phone }],
    });
console.log("comingi 1")
    if (existingOrg) {
      return next(
        new ApiError(
          existingOrg.email === email
            ? "This email already exists in organization."
            : "This phone already exists in organization.",
          409
        )
      );
    }

    const newOrg = new OrgModel({
      orgName,
      email,
      phone,
      orgLogo,
      branchCount,
      isMultiBranch,
    });
    console.log("comingi 2")

    const savedOrg = await newOrg.save();
    console.log("comingi 3")
console.log(savedOrg)
    const orgTypeMapping = new OrgTypeMapping({
      orgId: savedOrg._id,
      orgTypeId,
    });
    const savedOrgAndOrgTypeMapping = await orgTypeMapping.save();

    // here create method are used don't need to save
    const orgUserMapping = await OrgUserMapping.create({
      orgId: savedOrg._id,
      userId,
    });

    return res.status(201).json(
      new ApiResponse(201, "Organization and mapping created successfully", {
        organization: savedOrg,
        orgTypeMapping: savedOrgAndOrgTypeMapping,
        orgUserMapping: orgUserMapping,
      })
    );
  } catch (err) {
    next(err);
  }
};

// Get org by Admin ID (assuming adminId is used to fetch org)
const getOrgById = async (req, res, next) => {
  try {
    const { orgId } = req.params;

    const org = await OrgModel.findOne({ _id: orgId });
    if (!org || org.isDeleted) {
      return next(new ApiError("Organization not found", 404));
    }

    return res.status(200).json(new ApiResponse(200, "Organization data", org));
  } catch (err) {
    next(err);
  }
};

// Update org
const updateOrg = async (req, res, next) => {
  try {
    const { orgId } = req.params;

    const org = await OrgModel.findById(orgId);
    if (!org) {
      return next(new ApiError("Organization not found", 404));
    }

    const updated = await OrgModel.findByIdAndUpdate(
      orgId,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Organization updated successfully", updated));
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrg, getOrgById, updateOrg };
