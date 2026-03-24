const express = require("express");
const router = express.Router();
const Razorpay = require("razorpay");
const authMiddleware = require("../middleware/authMiddleware");
const { success, error } = require("../utils/responseHandler");

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "test_key",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_secret"
});

// CREATE ORDER
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return error(res, "Amount is required");
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    };

    const order = await razorpay.orders.create(options);

    return success(res, "Order created successfully", {
      userId: req.user.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });

  } catch (err) {
    console.error(err);
    return error(res, "Payment failed");
  }
});

module.exports = router;