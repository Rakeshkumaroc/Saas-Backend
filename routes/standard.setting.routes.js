const express = require("express");
const router = express.Router();
const {
  createSetting,
  getAllSettings,
  getSettingById,
  updateSetting,
  deleteSetting,
} = require("../controllers/standard.setting.controller");

router.post("/create-setting", createSetting);
router.get("/get-all-settings", getAllSettings);
router.get("/get-setting-by-id/:id", getSettingById);
router.put("/update-setting/:id", updateSetting);
router.delete("/delete-setting/:id", deleteSetting);

module.exports = router;
