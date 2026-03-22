const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getNotifications
} = require("../controllers/notificationController");

router.get("/", authMiddleware, getNotifications);

module.exports = router;