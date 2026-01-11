import React, { useRef, useState, useEffect } from "react";
import "./Subscription.css";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import axios from "axios";
import { loadRazorpay } from "../utils/razorpay";

const Subscription = () => {
  const { user } = useAuth();
  const plansRef = useRef(null);

  const [plan, setPlan] = useState("1month");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const check = async () => {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists() && snap.data().subscription === "premium") {
        setIsSubscribed(true);
      }
      setLoading(false);
    };

    check();
  }, [user]);

  const handlePay = async () => {
    await loadRazorpay();

    const prices = {
      "1month": 19900,
      "3months": 49900,
      "1year": 129900,
    };

    const order = await axios.post("http://localhost:5000/create-order", {
      amount: prices[plan],
      userId: user.uid,
      plan,
    });

    const options = {
      key: "RAZORPAY_PUBLIC_KEY",
      order_id: order.data.id,
      currency: "INR",
      name: "FundHub Premium",
      handler: () => {
        alert("Payment successful. Verifying...");
      },
    };

    new window.Razorpay(options).open();
  };

  if (loading) return null;

  return (
    <div className="subscription-layout">
      <Sidebar />

      <div className="subscription-page">
        <header className="subscription-hero">
          <h1>FundHub Premium 🚀</h1>

          {isSubscribed ? (
            <span className="badge badge-success">✅ Premium Active</span>
          ) : (
            <button onClick={handlePay}>Activate Premium</button>
          )}
        </header>

        {!isSubscribed && (
          <section ref={plansRef}>
            <div onClick={() => setPlan("1month")}>₹199 / Month</div>
            <div onClick={() => setPlan("3months")}>₹499 / 3 Months</div>
            <div onClick={() => setPlan("1year")}>₹1299 / Year</div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Subscription;
