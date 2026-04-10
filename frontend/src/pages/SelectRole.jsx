import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Ensure this path matches your firebase config
import "../styles/premium.css";

export default function SelectRole() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = async (role) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const user = auth.currentUser;
      
      if (user) {
        // 1. Reference the specific user document in Firestore
        const userRef = doc(db, "users", user.uid);

        // 2. Update the role field in the database
        await updateDoc(userRef, {
          role: role,
        });

        // 3. Navigate to the appropriate setup page
        if (role === "entrepreneur") {
          navigate("/setup-entrepreneur");
        } else {
          navigate("/setup-investor");
        }
      } else {
        // If session lost, send to login
        navigate("/login");
      }
    } catch (error) {
      console.error("Error saving role:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1 className="page-title">Select Your Role</h1>

        <div className={`role-container ${loading ? "processing" : ""}`}>
          <div
            className="role-card"
            onClick={() => handleRoleSelection("entrepreneur")}
          >
            <h2>🚀 Entrepreneur</h2>
            <p>Raise funds for your startup</p>
          </div>

          <div
            className="role-card"
            onClick={() => handleRoleSelection("investor")}
          >
            <h2>💰 Investor</h2>
            <p>Invest and grow your money</p>
          </div>
        </div>
        
        {loading && <p style={{ textAlign: "center", marginTop: "20px", color: "#3b82f6" }}>Saving your profile...</p>}
      </div>
    </div>
  );
}