const OrgTypeMapping = require("../models/org.type.mapping.model");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Create
const createOrgTypeMapping = async (req, res, next) => {
  try {
    const { orgId, orgTypeId, validFrom, validTo, isActive } = req.body;

    if (!orgId || !orgTypeId || !validFrom || !validTo) {
      return next(new ApiError("orgId, orgTypeId, validFrom, and validTo are required", 400));
    }
    

    const newMapping = new OrgTypeMapping({ orgId, orgTypeId, validFrom, validTo, isActive });
    const saved = await newMapping.save();
    res.status(201).json(new ApiResponse(201, "Mapping created", saved));
  } catch (err) {
    next(err);
  }
};

// Get all
const getAllOrgTypeMappings = async (req, res, next) => {
  try {
    const data = await OrgTypeMapping.find().populate("orgId").populate("orgTypeId");
    res.status(200).json(new ApiResponse(200, "Fetched all mappings", data));
  } catch (err) {
    next(err);
  }
};

// Get by ID
const getOrgTypeMappingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await OrgTypeMapping.findById(id).populate("orgId").populate("orgTypeId");
    if (!data) return next(new ApiError("Mapping not found", 404));
    res.status(200).json(new ApiResponse(200, "Fetched mapping", data));
  } catch (err) {
    next(err);
  }
};

// Update
const updateOrgTypeMapping = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await OrgTypeMapping.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) return next(new ApiError("Mapping not found", 404));
    res.status(200).json(new ApiResponse(200, "Updated successfully", updated));
  } catch (err) {
    next(err);
  }
};

// Delete
const deleteOrgTypeMapping = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await OrgTypeMapping.findByIdAndDelete(id);
    if (!deleted) return next(new ApiError("Mapping not found", 404));
    res.status(200).json(new ApiResponse(200, "Deleted successfully", deleted));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createOrgTypeMapping,
  getAllOrgTypeMappings,
  getOrgTypeMappingById,
  updateOrgTypeMapping,
  deleteOrgTypeMapping,
};
