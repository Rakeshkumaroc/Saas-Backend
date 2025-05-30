const orgModel = require("../models/org.model");
const OrgModel = require("../models/org.model");
const orgTypeMappingModel = require("../models/org.type.mapping.model");
const orgTypeModel = require("../models/org.type.model");
const orgUserMappingModel = require("../models/org.user.mapping.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");


// Create new OrgModel
const createOrg = async (req, res, next) => {
  try {
    const { orgName, orgTypeName, isMultiBranch, branchCount } = req.body;
    const userId = req.user?.UserID; // From auth middleware

    // Validate required fields
    if (!orgName || !orgTypeName || !isMultiBranch || branchCount === undefined || !userId) {
      return next(new ApiError("All fields are required", 400));
    }

    // Validate isMultiBranch
    if (!["single", "multi"].includes(isMultiBranch)) {
      return next(new ApiError("isMultiBranch must be 'single' or 'multi'", 400));
    }

    // Validate branchCount
    if (isMultiBranch === "multi" && (branchCount < 2 || !Number.isInteger(branchCount))) {
      return next(new ApiError("Branch count must be at least 2 for multi-branch setup", 400));
    }
    if (isMultiBranch === "single" && branchCount !== 1) {
      return next(new ApiError("Branch count must be 1 for single-branch setup", 400));
    }

    // Validate orgTypeName
    const orgType = await orgTypeModel.findOne({ orgTypeName, IsActive: true, IsDeleted: false });
    if (!orgType) {
      return next(new ApiError("Invalid or inactive organization type", 400));
    }

    // Check if user has an active organization
    const existingUserMapping = await orgUserMappingModel.findOne({
      UserID: userId,
      IsActive: true,
      IsDeleted: false,
    });
    if (existingUserMapping) {
      return next(new ApiError("User already has an active organization", 409));
    }

    // Generate custom IDs
    const orgId = `ORG-${uuidv4().slice(0, 8)}`;
    const typeMappingId = `MAP-TYPE-${uuidv4().slice(0, 8)}`;
    const userMappingId = `MAP-USER-${uuidv4().slice(0, 8)}`;

    // Create organization
    const newOrg = new orgModel({
      OrgID: orgId,
      orgName,
      isMultiBranch,
      branchCount,
    });

    // Create OrgTypeMapping
    const newTypeMapping = new orgTypeMappingModel({
      MappingID: typeMappingId,
      OrgID: orgId,
      OrgTypeID: orgType.OrgTypeID,
      ValidFrom: new Date(),
      ValidTo: new Date("9999-12-31"),
      IsActive: true,
      IsDeleted: false,
    });

    // Create OrgUserMapping
    const newUserMapping = new orgUserMappingModel({
      MappingID: userMappingId,
      OrgID: orgId,
      UserID: userId,
      BranchID: null,
      IsPrimaryContact: true,
      ValidFrom: new Date(),
      ValidTo: new Date("9999-12-31"),
      IsActive: true,
      IsDeleted: false,
    });

    // Save with transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await newOrg.save({ session });
      await newTypeMapping.save({ session });
      await newUserMapping.save({ session });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "Organization created successfully", { org: newOrg }));
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
