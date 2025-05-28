const Resource = require("../models/resource.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Create
const createResource = async (req, res, next) => {
  try {
    const {
      resourceName,
      description,
      value,
      validFrom,
      validTo,
      language,
      isActive,
    } = req.body;

    if (!resourceName || !validFrom || !validTo || !language) {
      return next(new ApiError("Required fields missing", 400));
    }

    const newResource = new Resource({
      resourceName,
      description,
      value,
      validFrom,
      validTo,
      language,
      isActive,
    });

    const saved = await newResource.save();
    res.status(201).json(new ApiResponse(201, "Resource created", saved));
  } catch (error) {
    next(error);
  }
};

// Get all
const getAllResources = async (req, res, next) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(new ApiResponse(200, "All resources", resources));
  } catch (error) {
    next(error);
  }
};

// Get by ID
const getResourceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findById(id);

    if (!resource) {
      return next(new ApiError("Resource not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Resource fetched", resource));
  } catch (error) {
    next(error);
  }
};

// Update
const updateResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await Resource.findByIdAndUpdate(
      id,
      {
        $set: {
          ...req.body,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) {
      return next(new ApiError("Resource not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Resource updated", updated));
  } catch (error) {
    next(error);
  }
};

// Delete
const deleteResource = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Resource.findByIdAndDelete(id);

    if (!deleted) {
      return next(new ApiError("Resource not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Resource deleted", deleted));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
};
