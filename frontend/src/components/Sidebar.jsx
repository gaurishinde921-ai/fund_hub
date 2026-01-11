import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2 className="sidebar-logo">FundHub</h2>

      <nav className="sidebar-menu">
        <NavLink to="/home" className="sidebar-link">
          Home
        </NavLink>

        <NavLink to="/explore" className="sidebar-link">
          Explore
        </NavLink>

        <NavLink to="/requests" className="sidebar-link">
          Requests
        </NavLink>

        <NavLink to="/subscription" className="sidebar-link">
          Subscriptions
        </NavLink>

        <NavLink to="/profile" className="sidebar-link">
          Profile
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
