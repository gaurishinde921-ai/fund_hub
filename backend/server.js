// ================= IMPORTS =================
const express = require("express");
const cors = require("cors");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const admin = require("firebase-admin");

const app = express();
const PORT = 5000;

console.log("🚀 SERVER FILE LOADED");

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= FIREBASE =================
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("✅ SERVER WORKING");
});

// ================= RAZORPAY INIT =================
const razorpay = new Razorpay({
  key_id: "rzp_test_SJSLW45U0hVH25",
  key_secret: "5k8o00yYHxoGmv4BBYz8Zqvl",
});

// ================= CREATE ORDER =================
app.post("/create-order", async (req, res) => {

  console.log("🟡 CREATE ORDER HIT");

  try {

    const { amount } = req.body;

    if (!amount) {
      return res.json({
        success: false,
        message: "Amount missing",
      });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    console.log("✅ Order Created:", order.id);

    return res.json({
      success: true,
      order,
    });

  } catch (error) {

    console.log("❌ ORDER ERROR:", error);

    return res.json({
      success: false,
      error: error.message,
    });

  }

});

// ================= VERIFY PAYMENT =================
app.post("/verify-razorpay", async (req, res) => {

  console.log("\n==============================");
  console.log("🔥 VERIFY PAYMENT API HIT");
  console.log("BODY:", req.body);
  console.log("==============================\n");

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      campaignId,
      investorId,
      amount
    } = req.body;

    if (!campaignId || !amount) {

      return res.json({
        success: false,
        message: "campaignId or amount missing",
      });

    }

    // ================= VERIFY SIGNATURE =================
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", "5k8o00yYHxoGmv4BBYz8Zqvl")
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {

      console.log("❌ Payment signature mismatch");

      return res.json({
        success: false,
        message: "Payment verification failed",
      });

    }

    console.log("✅ Payment verified successfully");

    // ================= UPDATE CAMPAIGN =================
    const campaignRef = db.collection("campaigns").doc(campaignId);
    const campaignDoc = await campaignRef.get();

    if (!campaignDoc.exists) {

      return res.json({
        success: false,
        message: "Campaign not found",
      });

    }

    const campaignData = campaignDoc.data();

    const newRaisedAmount =
      (campaignData.raisedAmount || 0) + Number(amount);

    await campaignRef.update({
      raisedAmount: newRaisedAmount,
    });

    console.log("✅ Campaign updated");

    // ================= UPDATE ESCROW =================
    const escrowRef = db.collection("escrow_wallet").doc(campaignId);
    const escrowDoc = await escrowRef.get();

    if (!escrowDoc.exists) {

      return res.json({
        success: false,
        message: "Escrow wallet not found",
      });

    }

    const escrowData = escrowDoc.data();

    const newTotalFunds =
      (escrowData.totalFunds || 0) + Number(amount);

    const newEscrowBalance =
      (escrowData.escrowBalance || 0) + Number(amount);

    await escrowRef.update({
      totalFunds: newTotalFunds,
      escrowBalance: newEscrowBalance,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ Escrow wallet updated");

    // ================= STORE INVESTMENT =================
    const investmentRef = db.collection("investments").doc();

    await investmentRef.set({
      campaignId,
      investorId: investorId || "anonymous",
      amount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("✅ Investment recorded");

    return res.json({
      success: true,
      message: "Payment verified and investment recorded",
      raisedAmount: newRaisedAmount,
      escrowBalance: newEscrowBalance,
    });

  } catch (error) {

    console.log("❌ VERIFY ERROR:", error);

    return res.json({
      success: false,
      error: error.message,
    });

  }

});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});