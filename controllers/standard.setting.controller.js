const StandardSetting = require("../models/standard.setting.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// Create
const createSetting = async (req, res, next) => {
  try {
    const { settingName, isEnabled } = req.body;

    if (!settingName) {
      return next(new ApiError("Setting name is required", 400));
    }

    const newSetting = new StandardSetting({
      settingName,
      isEnabled: isEnabled || false,
    });

    const saved = await newSetting.save();
    res.status(201).json(new ApiResponse(201, "Setting created", saved));
  } catch (error) {
    next(error);
  }
};

// Get All
const getAllSettings = async (req, res, next) => {
  try {
    const settings = await StandardSetting.find();
    res.status(200).json(new ApiResponse(200, "All settings", settings));
  } catch (error) {
    next(error);
  }
};

// Get by ID
const getSettingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const setting = await StandardSetting.findById(id);

    if (!setting) {
      return next(new ApiError("Setting not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Setting fetched", setting));
  } catch (error) {
    next(error);
  }
};

// Update
const updateSetting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { settingName, isEnabled } = req.body;

    const updated = await StandardSetting.findByIdAndUpdate(
      id,
      {
        $set: {
          settingName,
          isEnabled,
          updatedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!updated) {
      return next(new ApiError("Setting not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Setting updated", updated));
  } catch (error) {
    next(error);
  }
};

// Delete
const deleteSetting = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await StandardSetting.findByIdAndDelete(id);

    if (!deleted) {
      return next(new ApiError("Setting not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Setting deleted", deleted));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSetting,
  getAllSettings,
  getSettingById,
  updateSetting,
  deleteSetting,
};
