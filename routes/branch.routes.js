const express = require("express");
const router = express.Router();
const {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
} = require("../controllers/branch.controller");

router.post("/create-branch", createBranch);
router.get("/get-all-branches", getAllBranches);
router.get("/get-branch-by-id/:branchId", getBranchById);
router.put("/update-branch/:branchId", updateBranch);
router.delete("/delete-branch/:branchId", deleteBranch);

module.exports = router;
