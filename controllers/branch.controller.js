const BranchModel = require("../models/branch.model");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// Create branch
const createBranch = async (req, res, next) => {
  try {
    const branch = new BranchModel(req.body);
    const saved = await branch.save();
    res
      .status(201)
      .json(new ApiResponse(201, "Branch created successfully", saved));
  } catch (error) {
    next(error);
  }
};

// Get all branches
const getAllBranches = async (req, res, next) => {
  try {
    const list = await BranchModel.find({ isDeleted: false });
    res.status(200).json(new ApiResponse(200, "Fetched all branches", list));
  } catch (error) {
    next(error);
  }
};

// Get branch by ID
const getBranchById = async (req, res, next) => {
  try {
    const branch = await BranchModel.findOne({
      branchId: req.params.branchId,
      isDeleted: false,
    });

    if (!branch) return next(new ApiError("Branch not found", 404));

    res.status(200).json(new ApiResponse(200, "Fetched branch", branch));
  } catch (error) {
    next(error);
  }
};

// Update branch
const updateBranch = async (req, res, next) => {
  try {
    const updated = await Branch.findOneAndUpdate(
      { branchId: req.params.branchId },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );

    if (!updated) return next(new ApiError("Branch not found", 404));

    res.status(200).json(new ApiResponse(200, "Updated branch", updated));
  } catch (error) {
    next(error);
  }
};

// Soft delete branch
const deleteBranch = async (req, res, next) => {
  try {
    const deleted = await Branch.findOneAndUpdate(
      { branchId: req.params.branchId },
      { isDeleted: true, updatedAt: Date.now() },
      { new: true }
    );

    if (!deleted) return next(new ApiError("Branch not found", 404));

    res.status(200).json(new ApiResponse(200, "Deleted branch", deleted));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
};
