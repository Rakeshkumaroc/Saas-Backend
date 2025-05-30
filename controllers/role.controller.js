const RoleModel = require("../models/role.model");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// ================= CREATE ROLE =================
const createRole = async (req, res, next) => {
  try {
    const { roleName, description } = req.body;

    if (!roleName) {
      return next(new ApiError("roleName is required", 400));
    }

    const newRole = new RoleModel({
      roleName,
      description,
    });

    const savedRole = await newRole.save();

    res.status(201).json(new ApiResponse(201, "Role created", savedRole));
  } catch (error) {
    next(error);
  }
};

// ================= GET ALL ROLES =================
const getAllRoles = async (req, res, next) => {
  try {
    const roles = await RoleModel.find({ isDeleted: false });
    res.status(200).json(new ApiResponse(200, "All roles fetched", roles));
  } catch (error) {
    next(error);
  }
};

// ================= GET ROLE BY ID =================
const getRoleById = async (req, res, next) => {
  try {
    const { roleId } = req.params;

    const role = await RoleModel.findById(roleId);
    if (!role || role.isDeleted) {
      return next(new ApiError("Role not found", 404));
    }

    res.status(200).json(new ApiResponse(200, "Role fetched", role));
  } catch (error) {
    next(error);
  }
};

// ================= UPDATE ROLE =================
const updateRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;
    const { roleName, description, isActive } = req.body;

    const role = await RoleModel.findById(roleId);
    if (!role || role.isDeleted) {
      return next(new ApiError("Role not found", 404));
    }

    if (roleName !== undefined) role.roleName = roleName;
    if (description !== undefined) role.description = description;

    if (isActive !== undefined) role.isActive = isActive;

    role.updatedAt = Date.now();

    const updatedRole = await role.save();

    res.status(200).json(new ApiResponse(200, "Role updated", updatedRole));
  } catch (error) {
    next(error);
  }
};

// ================= DELETE ROLE (SOFT DELETE) =================
const deleteRole = async (req, res, next) => {
  try {
    const { roleId } = req.params;

    const role = await RoleModel.findById(roleId);
    if (!role || role.isDeleted) {
      return next(new ApiError("Role not found", 404));
    }

    role.isDeleted = true;
    role.updatedAt = Date.now();

    await role.save();

    res.status(200).json(new ApiResponse(200, "Role deleted", null));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
