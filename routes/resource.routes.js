const express = require("express");
const router = express.Router();
const {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource,
} = require("../controllers/resource.controller");

router.post("/create-resource", createResource);
router.get("/get-all-resources", getAllResources);
router.get("/get-resource-by-id/:id", getResourceById);
router.put("/update-resource/:id", updateResource);
router.delete("/delete-resource/:id", deleteResource);

module.exports = router;
