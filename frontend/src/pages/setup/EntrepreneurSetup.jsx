import React, { useState } from "react";
import "../../styles/premium.css";
import { db, auth } from "../../firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function EntrepreneurSetup() {
  const navigate = useNavigate();

  const [startup, setStartup] = useState("");
  const [idea, setIdea] = useState("");
  const [funding, setFunding] = useState("");
  const [industry, setIndustry] = useState("");

  const handleFundingChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFunding(value);
  };

  const handleSubmit = async () => {
    if (!startup || !idea || !funding || !industry) {
      alert("Fill all fields ⚠️");
      return;
    }

    try {
      const user = auth.currentUser;

      if (!user) {
        alert("User not logged in ❌");
        return;
      }

      // ✅ Save in USERS
      await setDoc(
        doc(db, "users", user.uid),
        {
          role: "entrepreneur",
          startup,
          idea,
          funding,
          industry,
          uid: user.uid,
          profileCompleted: true,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      // ✅ Save in ENTREPRENEURS collection
      await addDoc(collection(db, "entrepreneurs"), {
        startup,
        idea,
        funding,
        industry,
        userId: user.uid,
        createdAt: new Date(),
      });

      alert("Saved successfully 🚀");

      // 🔥 REDIRECT
      navigate("/home");

    } catch (error) {
      console.error("❌ ERROR:", error);
      alert(error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="glass-card">
          <h2 className="page-title">Entrepreneur Profile</h2>

          <input
            className="input"
            placeholder="Startup Name"
            value={startup}
            onChange={(e) => setStartup(e.target.value)}
          />

          <textarea
            className="input"
            placeholder="Describe your idea"
            rows={4}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
          />

          <div className="rupee-field">
            <span className="rupee-icon">₹</span>
            <input
              type="text"
              value={funding}
              onChange={handleFundingChange}
              className="rupee-input"
              placeholder="Funding Goal"
            />
          </div>

          <select
            className="input"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            <option value="" disabled hidden>
              Select Industry
            </option>
            <option>Technology</option>
            <option>Healthcare</option>
            <option>Finance</option>
            <option>E-commerce</option>
            <option>Education</option>
            <option>Other</option>
          </select>

          <button className="primary-btn" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}