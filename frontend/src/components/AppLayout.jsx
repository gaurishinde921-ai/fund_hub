import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AppLayout.css";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout">
      {/* FIXED SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN AREA */}
      <div className="main">
        {/* FIXED TOPBAR */}
        <Topbar
          setMobileOpen={setMobileOpen}
          onSearch={setSearchQuery}
        />

        {/* SCROLLABLE CONTENT ONLY */}
        <div className="content-scroll">
          <Outlet context={{ searchQuery }} />
        </div>
      </div>
    </div>
  );
}
