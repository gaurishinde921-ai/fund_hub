import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Search,
  Mail,
  CreditCard,
  Plus,
  User,
  LogOut
} from "lucide-react";

import "./Sidebar.css";
import logo from "../assets/logo.png";

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/explore", icon: Search, label: "Explore" },
    { to: "/requests", icon: Mail, label: "Requests" },
    { to: "/subscriptions", icon: CreditCard, label: "Subscriptions" },
    { to: "/add-post", icon: Plus, label: "Add Campaign" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* ================= MOBILE OVERLAY ================= */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`sidebar 
          ${collapsed ? "collapsed" : ""} 
          ${mobileOpen ? "mobile-open" : ""}
        `}
      >
        {/* ================= HEADER ================= */}
        <div className="sidebar-header">
          <div className="logo-box">
            <img src={logo} alt="FundHub" />
            {!collapsed && <span>FundHub</span>}
          </div>

          <button
            className="collapse-btn desktop-only"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <ChevronLeft size={18} />
            )}
          </button>
        </div>

        {/* ================= MENU ================= */}
        <nav className="sidebar-menu">
          {navItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={index}
                to={item.to}
                className="sidebar-link"
                data-label={item.label}   /* Tooltip text */
              >
                <Icon size={18} />

                {/* Show label only when expanded */}
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* ================= FOOTER ================= */}
        <div className="sidebar-footer">
          <button
            className="logout-btn sidebar-link"
            data-label="Logout"   /* Tooltip text */
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
