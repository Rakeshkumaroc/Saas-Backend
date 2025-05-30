const ResourceType = require("../models/resource.type.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Create
const createResourceType = async (req, res, next) => {
  try {
    const { resourceTypeName, description, isActive } = req.body;

    if (!resourceTypeName) {
      return next(new ApiError("resourceTypeName is required", 400));
    }

    const resourceType = new ResourceType({
      resourceTypeName,
      description,
      isActive,
    });

    const saved = await resourceType.save();
    res.status(201).json(new ApiResponse(201, "Resource type created", saved));
  } catch (error) {
    next(error);
  }
};

// Get all
const getAllResourceTypes = async (req, res, next) => {
  try {
    const data = await ResourceType.find();
    res.status(200).json(new ApiResponse(200, "All resource types", data));
  } catch (error) {
    next(error);
  }
};

// Get by ID
const getResourceTypeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await ResourceType.findById(id);

    if (!data) {
      return next(new ApiError("Resource type not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Resource type fetched", data));
  } catch (error) {
    next(error);
  }
};

// Update
const updateResourceType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await ResourceType.findByIdAndUpdate(
      id,
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    );

    if (!updated) {
      return next(new ApiError("Resource type not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Resource type updated", updated));
  } catch (error) {
    next(error);
  }
};

// Delete
const deleteResourceType = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ResourceType.findByIdAndDelete(id);

    if (!deleted) {
      return next(new ApiError("Resource type not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Resource type deleted", deleted));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResourceType,
  getAllResourceTypes,
  getResourceTypeById,
  updateResourceType,
  deleteResourceType,
};
