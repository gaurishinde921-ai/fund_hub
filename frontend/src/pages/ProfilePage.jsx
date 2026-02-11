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

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    setProfile(JSON.parse(localStorage.getItem("profile")) || {});
    setCampaigns(JSON.parse(localStorage.getItem("campaigns")) || []);
    setDrafts(JSON.parse(localStorage.getItem("drafts")) || []);
    setDonations(JSON.parse(localStorage.getItem("donations")) || []);
  }, []);

  /* ================= TOTAL FUNDS ================= */
  const totalFunds = donations.reduce(
    (sum, d) => sum + (Number(d.amount) || 0),
    0
  );

  /* ================= PROFILE PHOTO ================= */
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

  /* ================= COVER PHOTO ================= */
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const updated = { ...profile, cover: reader.result };
      setProfile(updated);
      localStorage.setItem("profile", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  /* ================= SHARE ================= */
  const shareProfile = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/profile/${profile.username || ""}`
    );
    alert("Profile link copied 📋");
  };

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="profile-layout">
      <Sidebar />

      <div className="profile-container">
        {/* ================= COVER ================= */}
        <div className="profile-banner">
          <img
            src={
              profile.cover ||
              "https://images.unsplash.com/photo-1557683316-973673baf926"
            }
            alt="cover"
            className="cover-img"
          />

          <label className="cover-upload">
            Change Cover
            <input type="file" hidden onChange={handleCoverChange} />
          </label>
        </div>

        {/* ================= HEADER ================= */}
        <div className="profile-header">
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

            <div className="profile-info">
              <h2>{profile.name || "Your Name"}</h2>
              <p className="username">@{profile.username || "username"}</p>
              <p className="bio">{profile.bio || "No bio added yet"}</p>
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={() => navigate("/edit-profile")}>
              Edit Profile
            </button>
            <button onClick={shareProfile}>Share</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="stats-row">
          <div className="stat-box">
            <h3 className="stat-value">{campaigns.length}</h3>
            <p>Campaigns</p>
          </div>

          <div className="stat-box">
            <h3 className="stat-value">₹{totalFunds}</h3>
            <p>Funds Raised</p>
          </div>

          <div className="stat-box">
            <h3 className="stat-value">{donations.length}</h3>
            <p>Supporters</p>
          </div>
        </div>

        {/* ================= TABS ================= */}
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

        {/* ================= CONTENT ================= */}
        <div className="content-box">
          {activeTab === "campaigns" &&
            (campaigns.length === 0 ? (
              <button
                className="add-btn"
                onClick={() => navigate("/add-post")}
              >
                + Add Campaign
              </button>
            ) : (
              <div className="campaign-grid">
                {campaigns.map((c, i) => (
                  <div key={i} className="campaign-card">
                    <img
                      src={
                        c.image ||
                        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                      }
                      alt="campaign"
                      className="campaign-img"
                    />

                    <div className="campaign-body">
                      <h4>{c.title}</h4>

                      <p className="campaign-amount">
                        ₹{c.raised || 0} raised of ₹{c.goal || 0}
                      </p>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              c.goal
                                ? Math.min((c.raised / c.goal) * 100, 100)
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}

          {activeTab === "drafts" && <p>No drafts available</p>}
          {activeTab === "donations" && <p>No donations yet</p>}
          {activeTab === "liked" && <p>No liked campaigns</p>}
          {activeTab === "saved" && <p>No saved campaigns</p>}
        </div>
      </div>
    </div>
  );
}
