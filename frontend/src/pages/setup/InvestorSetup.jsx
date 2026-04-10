import React, { useState } from "react";
import "../../styles/premium.css";
import { db, auth } from "../../firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function InvestorSetup() {
  const navigate = useNavigate();

  const [budget, setBudget] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");

  const handleBudgetChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setBudget(value);
  };

  const handleSubmit = async () => {
    if (!budget || !industry || !experience) {
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
          role: "investor",
          budget,
          preferredIndustry: industry,
          experienceLevel: experience,
          profileCompleted: true,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      // ✅ Save in INVESTORS collection
      await addDoc(collection(db, "investors"), {
        userId: user.uid,
        budget,
        preferredIndustry: industry,
        experienceLevel: experience,
        createdAt: new Date(),
      });

      alert("Saved successfully 🚀");

      // 🔥 REDIRECT
      navigate("/home");

    } catch (error) {
      console.error("🔥 ERROR:", error);
      alert(error.message);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="glass-card">
          <h2 className="page-title">Investor Profile</h2>

          <div className="rupee-field">
            <span className="rupee-icon">₹</span>
            <input
              type="text"
              value={budget}
              onChange={handleBudgetChange}
              className="rupee-input"
              placeholder="Investment Budget"
            />
          </div>

          <select
            className="input"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          >
            <option value="" disabled hidden>
              Preferred Industry
            </option>
            <option>Technology</option>
            <option>Healthcare</option>
            <option>Finance</option>
            <option>E-commerce</option>
            <option>Education</option>
            <option>Other</option>
          </select>

          <select
            className="input"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          >
            <option value="" disabled hidden>
              Experience Level
            </option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <button className="primary-btn" onClick={handleSubmit}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}