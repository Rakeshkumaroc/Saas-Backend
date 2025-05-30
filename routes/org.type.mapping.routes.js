const express = require("express");
const router = express.Router();

const {
  createOrgTypeMapping,
  getAllOrgTypeMappings,
  getOrgTypeMappingById,
  updateOrgTypeMapping,
  deleteOrgTypeMapping,
} = require("../controllers/org.type.mapping.controller");

router.post("/create-org-type-mapping", createOrgTypeMapping);
router.get("/get-all-org-type-mappings", getAllOrgTypeMappings);
router.get("/get-org-type-mapping-by-id/:id", getOrgTypeMappingById);
router.put("/update-org-type-mapping/:id", updateOrgTypeMapping);
router.delete("/delete-org-type-mapping/:id", deleteOrgTypeMapping);

module.exports = router;
