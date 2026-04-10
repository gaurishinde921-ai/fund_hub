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

  const [profile, setProfile] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("campaigns");
  const [openMenuId, setOpenMenuId] = useState(null);

  const coverInputRef = useRef(null);
  const menuRef = useRef(null);

  const DEFAULT_IMAGE =
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f";

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) setProfile(userDoc.data());

      const q = query(
        collection(db, "campaigns"),
        where("ownerId", "==", user.uid)
      );

      const snap = await getDocs(q);
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      setCampaigns(all.filter(c => c.status !== "draft"));
      setDrafts(all.filter(c => c.status === "draft"));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // ---------------- COVER UPLOAD ----------------
  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    try {
      setUploading(true);

      const storageRef = ref(
        storage,
        `covers/${user.uid}/${Date.now()}_${file.name}`
      );

      const snap = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snap.ref);

      await updateDoc(doc(db, "users", user.uid), {
        coverPic: url
      });

      setProfile(prev => ({ ...prev, coverPic: url }));
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this campaign?")) return;

    await deleteDoc(doc(db, "campaigns", id));
    fetchData();
  };

  const totalFunds = campaigns.reduce(
    (sum, c) => sum + (Number(c.raised) || 0),
    0
  );

  if (loading) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      {/* COVER */}
      <div className="profile-banner">
        <img
          src={
            profile.coverPic ||
            "https://images.unsplash.com/photo-1557683316-973673baf926"
          }
          alt="cover"
          className="cover-img"
        />

        <button onClick={() => coverInputRef.current.click()}>
          Edit Cover
        </button>

        <input
          type="file"
          ref={coverInputRef}
          hidden
          onChange={handleCoverUpload}
        />
      </div>

      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-left">
          <img
            src={
              profile.profilePic ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
          />

          <div>
            <h2>{profile.fullName || "User"}</h2>
            <p>@{profile.username || "username"}</p>
            <p>{profile.bio || "No bio"}</p>
          </div>
        </div>

        <div>
          <button onClick={() => navigate("/edit-profile")}>
            Edit
          </button>
          <button onClick={() => signOut(auth)}>Logout</button>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        <div>
          <h3>{campaigns.length}</h3>
          <p>Campaigns</p>
        </div>
        <div>
          <h3>₹{totalFunds}</h3>
          <p>Funds</p>
        </div>
        <div>
          <h3>0</h3>
          <p>Supporters</p>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        {["campaigns", "drafts"].map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? "active" : ""}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="campaign-grid">
        {(activeTab === "campaigns" ? campaigns : drafts).map(c => (
          <div key={c.id} className="campaign-card">
            <img
              src={c.mediaUrls?.[0] || DEFAULT_IMAGE}
              alt="campaign"
            />

            <h4>{c.title}</h4>

            <p>
              ₹{c.raised || 0} / ₹{c.goal || 0}
            </p>

            <button onClick={() => navigate(`/add-post/${c.id}`)}>
              Edit
            </button>
            <button onClick={() => handleDelete(c.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}