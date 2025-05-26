const express = require("express");
const {
  createOrg,
  getOrgById,
  updateOrg,
} = require("../controllers/org.controller");
const { tokenChecker } = require("../middleware/authChecker");
const router = express.Router();

router.post("/add-new-org", tokenChecker, createOrg);
router.get("get-org-by-id/:id", tokenChecker, getOrgById);
router.put("update-org-by-id/:id", tokenChecker, updateOrg);


module.exports = router;
