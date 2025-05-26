const OrgUserMapping = require("../models/🔹 org.user.mapping");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

// 🔹 Create Mapping
const createMapping = async (req, res, next) => {
  try {
    const { orgId, userId, isPrimaryContact, validFrom, validTo } = req.body;

    if (!orgId || !userId) {
      return next(new ApiError("orgId and userId are required", 400));
    }

    const newMapping = await OrgUserMapping.create({
      orgId,
      userId,
      isPrimaryContact,
      validFrom,
      validTo,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, "Mapping created successfully", newMapping));
  } catch (err) {
    next(err);
  }
};

// 🔹 Get Mapping by orgId
const getMappingsByOrg = async (req, res, next) => {
  try {
    const { orgId } = req.params;
    const mappings = await OrgUserMapping.find({ orgId, isDeleted: false });
    return res
      .status(200)
      .json(new ApiResponse(200, "Mappings fetched", mappings));
  } catch (err) {
    next(err);
  }
};

// 🔹 Soft Delete Mapping
const deleteMapping = async (req, res, next) => {
  try {
    const { id } = req.params;

    const mapping = await OrgUserMapping.findById(id);
    if (!mapping || mapping.isDeleted) {
      return next(new ApiError("Mapping not found", 404));
    }

    mapping.isDeleted = true;
    mapping.isActive = false;
    await mapping.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Mapping  deleted", mapping));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMapping,
  getMappingsByOrg,
  deleteMapping,
};
