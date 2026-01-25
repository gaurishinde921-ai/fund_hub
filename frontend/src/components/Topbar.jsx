import { Bell, User, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import "./Topbar.css";

export default function Topbar({ setMobileOpen, onSearch }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef(null);

  // close notification dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // handle search input
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value); // SAFE: doesn’t break old logic
  };

  return (
    <div className="topbar">
      {/* SEARCH BAR WITH ICON */}
      <div className="search-box">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search"
          placeholder="Search campaigns, users..."
          value={query}
          onChange={handleSearch}
        />
      </div>

      {/* ACTIONS */}
      <div className="topbar-actions" ref={dropdownRef}>
        <button className="icon-btn" onClick={() => setOpen(!open)}>
          <Bell size={18} />
        </button>

        {open && (
          <div className="notification-dropdown">
            <p className="title">Notifications</p>
            <div className="item">🚀 Campaign approved</div>
            <div className="item">💰 New donation received</div>
            <div className="item">📢 Subscription expiring</div>
          </div>
        )}

        <button className="icon-btn">
          <User size={18} />
        </button>
      </div>
    </div>
  );
}
