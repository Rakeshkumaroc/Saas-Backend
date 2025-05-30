const express = require("express");
const router = express.Router();

const {
  createResourceSpecType,
  getAllResourceSpecTypes,
  getResourceSpecTypeById,
  updateResourceSpecType,
  deleteResourceSpecType,
} = require("../controllers/resource.specification.type.controller");

router.post("/create-resource-spec-type", createResourceSpecType);
router.get("/get-all-resource-spec-types", getAllResourceSpecTypes);
router.get("/get-resource-spec-type-by-id/:id", getResourceSpecTypeById);
router.put("/update-resource-spec-type/:id", updateResourceSpecType);
router.delete("/delete-resource-spec-type/:id", deleteResourceSpecType);

module.exports = router;
