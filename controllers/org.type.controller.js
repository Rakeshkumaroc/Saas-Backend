const OrgType = require("../models/org.type.model");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Create
const createOrgType = async (req, res, next) => {
  try {
    const orgType = new OrgType(req.body);
    const saved = await orgType.save();
    res
      .status(201)
      .json(new ApiResponse(201, "Org type created successfully", saved));
  } catch (error) {
    next(error);
  }
};

// Get All
const getAllOrgTypes = async (req, res, next) => {
  try {
    const list = await OrgType.find({ isDeleted: false });
    res.status(200).json(new ApiResponse(200, "Fetched all org types", list));
  } catch (error) {
    next(error);
  }
};

// Get by ID
const getOrgTypeById = async (req, res, next) => {
  try {
    const org = await OrgType.findOne({
      orgTypeId: req.params.orgTypeId,
      isDeleted: false,
    });

    if (!org) return next(new ApiError("Org type not found", 404));

    res.status(200).json(new ApiResponse(200, "Fetched org type", org));
  } catch (error) {
    next(error);
  }
};

// Update
const updateOrgType = async (req, res, next) => {
  try {
    const updated = await OrgType.findOneAndUpdate(
      { orgTypeId: req.params.orgTypeId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) return next(new ApiError("Org type not found", 404));

    res.status(200).json(new ApiResponse(200, "Updated org type", updated));
  } catch (error) {
    next(error);
  }
};

// Soft Delete
const deleteOrgType = async (req, res, next) => {
  try {
    const deleted = await OrgType.findOneAndUpdate(
      { orgTypeId: req.params.orgTypeId },
      { isDeleted: true, updatedAt: Date.now() },
      { new: true }
    );

    if (!deleted) return next(new ApiError("Org type not found", 404));

    res.status(200).json(new ApiResponse(200, "Deleted org type", deleted));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrgType,
  getAllOrgTypes,
  getOrgTypeById,
  updateOrgType,
  deleteOrgType,
};
