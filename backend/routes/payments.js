const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { success, error } = require("../utils/responseHandler");

// CREATE ORDER
router.post("/create-order", authMiddleware, (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return error(res, "Amount is required");
    }

    return success(res, "Order created successfully", {
      userId: req.user.id,
      amount,
      currency: "INR"
    });

  } catch (err) {
    return error(res, "Payment failed");
  }
});

module.exports = router;