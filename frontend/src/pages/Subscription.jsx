import React, { useState, useEffect } from "react";
import "./Subscription.css";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function Subscription() {
  const [plan, setPlan] = useState("free");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchPlan = async () => {
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        setPlan(snap.data().subscription || "free");
      }
    };
    fetchPlan();
  }, [user]);

  const choosePlan = (id) => {
    setPlan(id); // glow moves instantly

    if (id === "free") return;
    navigate(`/payment?plan=${id}`);
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      features: ["1 Campaign", "Basic Support", "Limited Visibility"],
    },
    {
      id: "pro",
      name: "Pro",
      price: "₹199 / month",
      badge: "🔥 Most Popular",
      features: [
        "Unlimited Campaigns",
        "Priority Support",
        "Better Visibility",
        "Analytics Dashboard",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "₹399 / month",
      badge: "💎 Best Value",
      features: [
        "Unlimited Campaigns",
        "Top Visibility",
        "Premium Badge",
        "Advanced Analytics",
        "Priority Listing",
      ],
    },
  ];

  return (
    <div className="sub-wrapper">
      <h1 className="title">Choose Your Plan</h1>

      <div className="plan-grid">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`card ${plan === p.id ? "active" : ""}`}
            onClick={() => choosePlan(p.id)}
          >
            {p.badge && <span className="badge">{p.badge}</span>}

            <h2>{p.name}</h2>
            <h1 className="price">{p.price}</h1>

            <ul>
              {p.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            <button className="btn">
              {plan === p.id ? "Current Plan" : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
