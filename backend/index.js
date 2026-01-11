import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import cors from "cors";
import { db } from "./firebaseAdmin.js";
import "dotenv/config";

const app = express();

/* CORS */
app.use(cors());

/* JSON for normal routes */
app.use(express.json());

/* RAW BODY ONLY for webhook */
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.body.toString());

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const userId = payment.notes.userId;
      const plan = payment.notes.plan;

      if (userId) {
        await db.collection("users").doc(userId).update({
          subscription: "premium",
          subscriptionPlan: plan,
          paymentId: payment.id,
          subscribedAt: new Date(),
        });
      }
    }

    res.json({ status: "ok" });
  }
);
