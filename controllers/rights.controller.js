const Right = require("../models/rights.model");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Create Right
const createRight = async (req, res, next) => {
  try {
    const { rightName, canPrint, maxCopies } = req.body;

    if (!rightName) {
      return next(new ApiError("Right name is required", 400));
    }

    const newRight = new Right({
      rightName,
      canPrint: canPrint || false,
      maxCopies: maxCopies || 0,
    });

    const savedRight = await newRight.save();
    res.status(201).json(new ApiResponse(201, "Right created", savedRight));
  } catch (error) {
    next(error);
  }
};

// Get all Rights
const getAllRights = async (req, res, next) => {
  try {
    const rights = await Right.find({ isDeleted: false });
    res.status(200).json(new ApiResponse(200, "All rights fetched", rights));
  } catch (error) {
    next(error);
  }
};

// Get single Right
const getRightById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const right = await Right.findById(id);

    if (!right || right.isDeleted) {
      return next(new ApiError("Right not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Right fetched", right));
  } catch (error) {
    next(error);
  }
};

// Update Right
const updateRight = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rightName, canPrint, maxCopies, isActive } = req.body;

    const updatedRight = await Right.findByIdAndUpdate(
      id,
      {
        $set: {
          rightName,
          canPrint,
          maxCopies,
          isActive,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updatedRight || updatedRight.isDeleted) {
      return next(new ApiError("Right not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Right updated", updatedRight));
  } catch (error) {
    next(error);
  }
};

// Soft Delete Right
const deleteRight = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedRight = await Right.findByIdAndUpdate(
      id,
      { isDeleted: true, isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!deletedRight) {
      return next(new ApiError("Right not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Right deleted (soft)", deletedRight));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRight,
  getAllRights,
  getRightById,
  updateRight,
  deleteRight,
};
