const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getSettings,
  updateSettings
} = require("../controllers/settingsController");

router.get("/", authMiddleware, getSettings);
router.post("/update", authMiddleware, updateSettings);

module.exports = router;