const express = require("express");
const router = express.Router();
const {
  createRight,
  getAllRights,
  getRightById,
  updateRight,
  deleteRight,
} = require("../controllers/rights.controller");

router.post("/create-right", createRight);
router.get("/get-all-rights", getAllRights);
router.get("/get-right-by-id/:id", getRightById);
router.put("/update-right/:id", updateRight);
router.delete("/delete-right/:id", deleteRight);

module.exports = router;
