const express = require("express");
const router = express.Router();

const {
  createResourceType,
  getAllResourceTypes,
  getResourceTypeById,
  updateResourceType,
  deleteResourceType,
} = require("../controllers/resource.type.controller");

router.post("/create-resource-type", createResourceType);
router.get("/get-all-resource-types", getAllResourceTypes);
router.get("/get-resource-type-by-id/:id", getResourceTypeById);
router.put("/update-resource-type/:id", updateResourceType);
router.delete("/delete-resource-type/:id", deleteResourceType);

module.exports = router;
