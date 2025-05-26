const express = require('express');
const router = express.Router();
const {
  createOrgType,
  getAllOrgTypes,
  getOrgTypeById,
  updateOrgType,
  deleteOrgType,
} = require("../controllers/org.type.controller");

// CRUD Routes
router.post('/create-org-type', createOrgType);
router.get('/get-all-org-type', getAllOrgTypes);
router.get('/get-org-type-by-id/:orgTypeId', getOrgTypeById);
router.put('/update-org-type/:id', updateOrgType);
router.delete('/delete-org-type/:id', deleteOrgType);

module.exports = router;
