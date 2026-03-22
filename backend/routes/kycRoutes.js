const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  submitKYC,
  getKYCStatus
} = require("../controllers/kycController");

router.post("/submit", authMiddleware, submitKYC);
router.get("/status", authMiddleware, getKYCStatus);

module.exports = router;