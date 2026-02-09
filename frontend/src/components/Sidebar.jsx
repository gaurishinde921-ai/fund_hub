import { NavLink } from "react-router-dom";
import { ChevronLeft, ChevronRight, Home, Search, Mail, CreditCard, Plus, User, LogOut } from "lucide-react";

import "./Sidebar.css";
import logo from "../assets/logo.png";

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  return (
    <>
      {/* MOBILE OVERLAY (ONLY MOBILE) */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`sidebar 
          ${collapsed ? "collapsed" : ""} 
          ${mobileOpen ? "mobile-open" : ""}
        `}
      >
        {/* LOGO + COLLAPSE */}
        <div className="sidebar-header">
          <div className="logo-box">
            <img src={logo} alt="FundHub" />
            {!collapsed && <span>FundHub</span>}
          </div>

          {/* DESKTOP COLLAPSE ONLY */}
          <button
            className="collapse-btn desktop-only"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* MENU */}
        <nav className="sidebar-menu">
          <NavLink to="/home" className="sidebar-link" data-label="Home">
  <Home size={18} />
  {!collapsed && <span>Home</span>}
</NavLink>

<NavLink to="/explore" className="sidebar-link" data-label="Explore">
  <Search size={18} />
  {!collapsed && <span>Explore</span>}
</NavLink>

<NavLink to="/requests" className="sidebar-link" data-label="Requests">
  <Mail size={18} />
  {!collapsed && <span>Requests</span>}
</NavLink>

<NavLink to="/subscriptions" className="sidebar-link" data-label="Subscriptions">
  <CreditCard size={18} />
  {!collapsed && <span>Subscriptions</span>}
</NavLink>

<NavLink
  to="/add-post"
  className="sidebar-link"
  data-label="Add Campaign"
>
  <Plus size={18} />
  {!collapsed && <span>Add Campaign</span>}
</NavLink>


<NavLink to="/profile" className="sidebar-link" data-label="Profile">
  <User size={18} />
  {!collapsed && <span>Profile</span>}
</NavLink>

        </nav>


      

        {/* LOGOUT */}
        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
