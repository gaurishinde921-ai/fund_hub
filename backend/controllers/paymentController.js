import admin from "../firebaseAdmin.js";

const db = admin.firestore();

// VERIFY PAYMENT + UPDATE ESCROW
export const verifyPaymentAndUpdateEscrow = async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    if (!campaignId || !amount) {
      return res.status(400).json({ error: "Missing campaignId or amount" });
    }

    const escrowRef = db.collection("escrow_wallet").doc(campaignId);
    const escrowDoc = await escrowRef.get();

    if (!escrowDoc.exists) {
      return res.status(404).json({ error: "Escrow not found" });
    }

    const data = escrowDoc.data();

    await escrowRef.update({
      totalFunds: (data.totalFunds || 0) + amount,
      escrowBalance: (data.escrowBalance || 0) + amount,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.json({
      success: true,
      message: "Escrow updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};