const ResourceSpecificationType = require("../models/resource.specification.type.model");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Create
const createResourceSpecType = async (req, res, next) => {
  try {
    const { specTypeName, isActive } = req.body;

    if (!specTypeName) {
      return next(new ApiError("specTypeName is required", 400));
    }

    const newType = new ResourceSpecificationType({ specTypeName, isActive });
    const saved = await newType.save();
    res.status(201).json(new ApiResponse(201, "Created successfully", saved));
  } catch (err) {
    next(err);
  }
};

// Get All
const getAllResourceSpecTypes = async (req, res, next) => {
  try {
    const data = await ResourceSpecificationType.find();
    res
      .status(200)
      .json(new ApiResponse(200, "All resource specification types", data));
  } catch (err) {
    next(err);
  }
};

// Get by ID
const getResourceSpecTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await ResourceSpecificationType.findById(id);
    if (!data) {
      return next(new ApiError("Not found", 404));
    }
    res.status(200).json(new ApiResponse(200, "Fetched successfully", data));
  } catch (err) {
    next(err);
  }
};

// Update
const updateResourceSpecType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await ResourceSpecificationType.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!updated) {
      return next(new ApiError("Not found", 404));
    }
    res.status(200).json(new ApiResponse(200, "Updated successfully", updated));
  } catch (err) {
    next(err);
  }
};

// Delete
const deleteResourceSpecType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ResourceSpecificationType.findByIdAndDelete(id);
    if (!deleted) {
      return next(new ApiError("Not found", 404));
    }
    res.status(200).json(new ApiResponse(200, "Deleted successfully", deleted));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createResourceSpecType,
  getAllResourceSpecTypes,
  getResourceSpecTypeById,
  updateResourceSpecType,
  deleteResourceSpecType,
};
