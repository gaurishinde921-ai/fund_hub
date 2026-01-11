import React from "react";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <div className="topbar">
      <div className="search-box">
        <input type="text" placeholder="Search campaigns, users..." />
      </div>

      <div className="topbar-icons">
        <span className="icon">🔔</span>

        <div
          className="topbar-profile"
          onClick={() => navigate("/profile")}
        >
          <div className="profile-mini"></div>
        </div>
      </div>
    </div>
  );
}
