const OrgModel = require("../models/org.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const adminModel = require("../models/admin.model");

// Create new OrgModel
const createOrg = async (req, res, next) => {
  try {
    const admin = req.tokenData;
    const { orgName, email, phone } = req.body;

    if (!orgName || !email || !phone) {
      return next(new ApiError("All fields are required", 400));
    }

    // Check if email or phone already exists in Admin
    const isAdminExist = await adminModel.findOne({
      $or: [{ email }, { phone }],
    });

    if (isAdminExist) {
      return next(
        new ApiError(
          isAdminExist.email === email
            ? "This email already exists in admin accounts."
            : "This phone already exists in admin accounts.",
          409
        )
      );
    }

    // Check if email or phone already exists in Org
    const existingOrg = await OrgModel.findOne({
      $or: [{ email }, { phone }],
    });

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

    // Check if admin already created an org
    const isOrgExist = await OrgModel.findOne({ adminId: admin.adminId });
    if (isOrgExist) {
      return next(
        new ApiError("An admin can create only one organization", 403)
      );
    }

    const newOrg = new OrgModel({
      orgName,
      email,
      phone,
      adminId: admin.adminId,
    });

    const saved = await newOrg.save();

    return res
      .status(201)
      .json(new ApiResponse(201, "Organization created successfully", saved));
  } catch (err) {
    next(err);
  }
};

// Get org by Admin ID (assuming adminId is used to fetch org)
const getOrgById = async (req, res, next) => {
  try {
    const admin = req.tokenData;

    const org = await OrgModel.findOne({ adminId: admin.adminId });
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
    const admin = req.tokenData;
    const { orgId } = req.params;

    const org = await OrgModel.findById(orgId);
    if (!org) {
      return next(new ApiError("Organization not found", 404));
    }

    if (org.adminId.toString() !== admin.adminId) {
      return next(
        new ApiError("Unauthorized to update this organization", 403)
      );
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
