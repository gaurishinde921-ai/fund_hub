import express from "express";
import { verifyPaymentAndUpdateEscrow } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/verify-payment", verifyPaymentAndUpdateEscrow);

export default router;