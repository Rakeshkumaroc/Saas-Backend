const express = require("express");
const {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} = require("../controllers/role.controller");

const router = express.Router();

router.post("/create-role", createRole);
router.get("/get-all-roles", getAllRoles);
router.get("/get-role-by-id/:roleId", getRoleById);
router.put("/updateRole/:roleId", updateRole);
router.delete("/delete-role/:roleId", deleteRole);

module.exports = router;
