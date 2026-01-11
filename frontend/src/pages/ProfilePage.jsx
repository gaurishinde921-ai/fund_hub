import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Sidebar from "../components/Sidebar";
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [donations, setDonations] = useState([]);

  const [activeTab, setActiveTab] = useState("campaigns");
  const [showSettings, setShowSettings] = useState(false);

  // 🔄 Load local cached data (safe fallback)
  useEffect(() => {
    setProfile(JSON.parse(localStorage.getItem("profile")) || {});
    setCampaigns(JSON.parse(localStorage.getItem("campaigns")) || []);
    setDrafts(JSON.parse(localStorage.getItem("drafts")) || []);
    setDonations(JSON.parse(localStorage.getItem("donations")) || []);
  }, []);

  const totalFunds = donations.reduce(
    (sum, d) => sum + (Number(d.amount) || 0),
    0
  );

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = { ...profile, photo: reader.result };
      setProfile(updated);
      localStorage.setItem("profile", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  const shareProfile = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/profile/${profile.username || ""}`
    );
    alert("Profile link copied 📋");
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="profile-layout">
      <Sidebar />

      <div className="profile-container">
        {/* TOP BAR */}
        <div className="profile-top">
          <h2>Profile</h2>

          <button
            className="menu-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            ☰
          </button>

          {showSettings && (
            <div className="settings-dropdown">
              <p onClick={() => navigate("/edit-profile")}>Edit Profile</p>
              <p onClick={() => navigate("/profile-setup")}>Profile Setup</p>
              <p onClick={handleLogout}>Logout</p>
            </div>
          )}
        </div>

        {/* PROFILE CARD */}
        <div className="profile-card">
          <div className="profile-left">
            <label className="avatar-wrapper">
              <img
                src={
                  profile.photo ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
              />
              <input type="file" hidden onChange={handlePhotoChange} />
            </label>

            <h3>{profile.name || "Your Name"}</h3>
            <p className="username">@{profile.username || "username"}</p>
            <p className="bio">{profile.bio || "No bio added yet"}</p>

            <div className="profile-actions">
              <button onClick={() => navigate("/edit-profile")}>
                Edit Profile
              </button>
              <button onClick={shareProfile}>Share Profile</button>
            </div>
          </div>

          <div className="profile-stats">
            <div>
              <h4>{campaigns.length}</h4>
              <p>Campaigns</p>
            </div>
            <div>
              <h4>₹{totalFunds}</h4>
              <p>Funds Raised</p>
            </div>
            <div>
              <h4>{donations.length}</h4>
              <p>Supporters</p>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          {["campaigns", "drafts", "donations", "liked", "saved"].map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? "active" : ""}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "donations" ? "Donations Received" : tab}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="content-box">
          {activeTab === "campaigns" &&
            (campaigns.length === 0 ? (
              <button onClick={() => navigate("/add-post")}>
                + Add Campaign
              </button>
            ) : (
              campaigns.map((c, i) => (
                <div key={i} className="item-card">
                  <h4>{c.title}</h4>
                  <p>
                    ₹{c.raised} / ₹{c.goal}
                  </p>
                </div>
              ))
            ))}

          {activeTab === "drafts" &&
            (drafts.length === 0 ? (
              <p>No drafts available</p>
            ) : (
              drafts.map((d, i) => <div key={i}>{d.title}</div>)
            ))}

          {activeTab === "donations" &&
            (donations.length === 0 ? (
              <p>No donations yet</p>
            ) : (
              donations.map((d, i) => (
                <div key={i} className="item-card">
                  <p>User: {d.userId}</p>
                  <p>₹{d.amount}</p>
                  <p>{d.date}</p>
                </div>
              ))
            ))}

          {activeTab === "liked" && <p>No liked campaigns</p>}
          {activeTab === "saved" && <p>No saved campaigns</p>}
        </div>
      </div>
    </div>
  );
}
