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

  // ================= CREATE ORDER =================
  const orderRes = await fetch("http://localhost:5000/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      amount: price
    })
  });

  const orderData = await orderRes.json();

  if (!orderData.success) {
    alert("Order creation failed");
    setLoading(false);
    return;
  }

  const order = orderData.order;

  // ================= RAZORPAY OPTIONS =================
  const options = {
    key: "rzp_test_SJSLW45U0hVH25",
    amount: order.amount,
    currency: order.currency,
    name: "FundHub",
    description: "Subscription Payment",
    order_id: order.id,

    handler: async function (response) {

      console.log("Payment Success:", response);

      // ================= VERIFY PAYMENT =================
      const verifyRes = await fetch("http://localhost:5000/verify-razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          campaignId: "CMP001",
          investorId: user.uid,
          amount: price
        })
      });

      const verifyData = await verifyRes.json();

      if (verifyData.success) {

        // ================= UPDATE USER SUBSCRIPTION =================
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

    },

    prefill: {
      name: user?.displayName || "Investor",
      email: user?.email || ""
    },

    theme: {
      color: "#4CAF50"
    }

  };

  // ================= OPEN RAZORPAY =================
  const rzp = new window.Razorpay(options);

  rzp.open();

  setLoading(false);

} catch (error) {

  console.log("Payment Error:", error);
  alert("Payment failed");

  setLoading(false);

}


};

return ( <div className="payment-page">


  <div className="payment-box">

    <h2>{plan?.toUpperCase()} PLAN</h2>

    <p className="price">₹{price} / month</p>

    <p className="desc">
      You are about to activate the <b>{plan}</b> subscription.
    </p>

    <button
      className="pay-btn"
      onClick={handlePay}
      disabled={loading}
    >
      {loading ? "Processing..." : `Pay ₹${price}`}
    </button>

  </div>

</div>

);
}
