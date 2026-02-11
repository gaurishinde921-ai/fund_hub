import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./Payment.css";

export default function Payment() {
  const [params] = useSearchParams();
  const plan = params.get("plan");
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const price = plan === "pro" ? "₹199" : "₹399";

  const handlePay = async () => {
    setLoading(true);

    setTimeout(async () => {
      await setDoc(
        doc(db, "users", user.uid),
        {
          subscription: plan,
          subscriptionDate: new Date(),
        },
        { merge: true }
      );

      setLoading(false);
      setSuccess(true);
    }, 1200);
  };

  return (
    <div className="payment-page">
      <div className="payment-box">

        {!success ? (
          <>
            <h2>{plan?.toUpperCase()} PLAN</h2>
            <p className="price">{price} / month</p>

            <p className="desc">
              You are about to activate the <b>{plan}</b> subscription.
            </p>

            <button
              className="pay-btn"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay ${price}`}
            </button>

            <p className="note">Demo payment • No real money</p>
          </>
        ) : (
          <>
            <h2>✅ Payment Successful</h2>
            <p>Your {plan?.toUpperCase()} plan is now active.</p>

            <button className="pay-btn" onClick={() => navigate("/home")}>
              Continue
            </button>
          </>
        )}

      </div>
    </div>
  );
}
