const express = require("express");
const router = express.Router();
const {
  createMapping,
  getMappingsByOrg,
  deleteMapping,
} = require("../controllers/🔹 org.user.m.controller");

router.post("/create-mapping", createMapping);
router.get("/org/:orgId", getMappingsByOrg);
router.delete("/:id", deleteMapping);

module.exports = router;
