import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../firebase"; 
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  updateDoc 
} from "firebase/firestore";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
import { useAuth } from "../context/AuthContext"; 
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ---------------------------------------------------------
  // State Management
  // ---------------------------------------------------------
  const [profile, setProfile] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false); 
  const [activeTab, setActiveTab] = useState("campaigns");
  const [openMenuId, setOpenMenuId] = useState(null);

  // Constants & Refs
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f";
  const coverInputRef = useRef(null);
  const menuRef = useRef(null);

  // ---------------------------------------------------------
  // Event Handlers & Lifecycle
  // ---------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchFullData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      }

      const q = query(
        collection(db, "campaigns"), 
        where("ownerId", "==", user.uid)
      );
      
      const snap = await getDocs(q);
      const allPosts = snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data() 
      }));
      
      const pub = allPosts.filter(c => c.status === "published" || !c.status);
      const drf = allPosts.filter(c => c.status === "draft");
      
      setCampaigns(pub);
      setDrafts(drf);
    } catch (err) {
      console.error("Load Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFullData();
  }, [user]);

  // ---------------------------------------------------------
  // Action Functions
  // ---------------------------------------------------------
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    try {
      setUploading(true);
      const storagePath = `covers/${user.uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, storagePath);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        coverPic: downloadURL
      });

      setProfile(prev => ({ 
        ...prev, 
        coverPic: downloadURL 
      }));
      alert("Cover updated successfully! ✨");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Check Storage Rules.");
    } finally {
      setUploading(false);
    }
  };

  const handleShareProfile = () => {
    const url = `${window.location.origin}/profile/${user.uid}`;
    navigator.clipboard.writeText(url);
    alert("Profile link copied to clipboard! 👤");
  };

  const handleShare = (id) => {
    const url = `${window.location.origin}/campaign/${id}`;
    navigator.clipboard.writeText(url);
    alert("Campaign link copied! 📋");
    setOpenMenuId(null);
  };

  const handleDelete = async (postId) => {
    setOpenMenuId(null);
    const confirm = window.confirm("Are you sure you want to delete this campaign?");
    if (confirm) {
      try {
        await deleteDoc(doc(db, "campaigns", postId));
        alert("Deleted successfully.");
        fetchFullData();
      } catch (err) {
        alert("Delete failed.");
      }
    }
  };

  const totalFunds = campaigns.reduce((sum, c) => {
    return sum + (Number(c.raised) || 0);
  }, 0);

  // ---------------------------------------------------------
  // Render Logic
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="loader-full-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-banner">
        <img 
          src={profile.coverPic || "https://images.unsplash.com/photo-1557683316-973673baf926"} 
          alt="cover" 
          className="cover-img" 
        />
        {uploading && (
          <div className="upload-overlay">
            <div className="spinner small"></div>
            <span className="upload-text">Uploading...</span>
          </div>
        )}
        <button 
          className="edit-cover-btn" 
          onClick={() => coverInputRef.current.click()} 
          disabled={uploading}
        >
          {uploading ? "Wait..." : "📷 Edit Cover"}
        </button>
        <input 
          type="file" 
          ref={coverInputRef} 
          style={{ display: 'none' }} 
          accept="image/*" 
          onChange={handleCoverUpload} 
        />
      </div>

      <div className="profile-header">
        <div className="profile-left">
          <div className="avatar-wrapper">
            <img 
              src={profile.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
              alt="profile" 
            />
          </div>
          <div className="profile-info">
            <h2>{profile.fullName || profile.username || "User"}</h2>
            <p className="username">@{profile.username || "handle"}</p>
            <p className="bio">{profile.bio || "No bio added yet"}</p>
          </div>
        </div>
        <div className="profile-actions">
          <button onClick={handleShareProfile}>Share Profile</button>
          <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
          <button onClick={() => signOut(auth)} className="logout-btn">Logout</button>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-box">
          <h3>{campaigns.length}</h3>
          <p>Campaigns</p>
        </div>
        <div className="stat-box">
          <h3>₹{totalFunds}</h3>
          <p>Funds Raised</p>
        </div>
        <div className="stat-box">
          <h3>0</h3>
          <p>Supporters</p>
        </div>
      </div>

      <div className="tabs">
        {["campaigns", "drafts", "donations", "liked", "saved"].map((tab) => (
          <button 
            key={tab} 
            className={activeTab === tab ? "active" : ""} 
            onClick={() => setActiveTab(tab)}
          >
            {tab === "donations" ? "Donations Received" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="content-box">
        <div className="campaign-grid">
          {(activeTab === "campaigns" ? campaigns : drafts).map((item) => {
            const goalVal = item.goal || 0;
            const raisedVal = item.raised || 0;
            const progress = goalVal > 0 ? Math.min((raisedVal / goalVal) * 100, 100) : 0;
            
            return (
              <div key={item.id} className="campaign-card">
                <img 
                  src={item.mediaUrls?.[0] || DEFAULT_IMAGE} 
                  alt="campaign" 
                  className="campaign-card-img"
                />
                
                {/* OVERLAY MENU - Simple dots style */}
                <div 
                  className="card-menu-container" 
                  ref={openMenuId === item.id ? menuRef : null}
                >
                  <button 
                    className="menu-dots-btn" 
                    onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                  >
                    ⋮
                  </button>
                  {openMenuId === item.id && (
                    <div className="dropdown-menu">
                      <button onClick={() => navigate(`/add-post/${item.id}`)}>Edit</button>
                      <button onClick={() => handleShare(item.id)}>Share</button>
                      <hr className="menu-divider" />
                      <button className="delete-option" onClick={() => handleDelete(item.id)}>Delete</button>
                    </div>
                  )}
                </div>

                <div className="campaign-body">
                  <h4 className="campaign-title-text">{item.title || "Untitled"}</h4>
                  <div className="mini-progress">
                    <div className="mini-bar" style={{ width: `${progress}%` }}></div>
                  </div>
                  <div className="amount-row">
                     <p className="amount-text">₹{raisedVal} / ₹{goalVal}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}