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

  const price = plan === "pro" ? 199 : 399;

  const handlePay = async () => {
    try {
      setLoading(true);

      const orderRes = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: price })
      });

      const orderData = await orderRes.json();
      console.log("ORDER RESPONSE:", orderData);



      if (!orderData.success) {
        alert("Order creation failed");
        setLoading(false);
        return;
      }

      const options = {
        key: "rzp_test_SJSLW45U0hVH25",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "FundHub",
        description: "Subscription Payment",
        order_id: orderData.order.id,

        handler: async function (response) {
          const verifyRes = await fetch("http://localhost:5000/verify-razorpay", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              investorId: user.uid,
              amount: price
            })
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            await setDoc(
              doc(db, "users", user.uid),
              {
                subscription: plan,
                subscriptionDate: new Date()
              },
              { merge: true }
            );
            



            alert("✅ Payment Successful");
            navigate("/home");
          } else {
            alert("Payment verification failed");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setLoading(false);
    } catch (error) {
  console.log("FULL ERROR:", error);
  alert("Payment failed - check console");
  setLoading(false);
}
  };

  return (
    <div className="payment-page">
      <div className="payment-box">
        <h2>{plan?.toUpperCase()} PLAN</h2>

        <p className="price">₹{price} / month</p>

        <button
          className="pay-btn"
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? "Processing..." : `Pay ₹${price}`}
        </button>

        <p className="note">🔒 Secure payment via Razorpay</p>
      </div>
    </div>
  );
}