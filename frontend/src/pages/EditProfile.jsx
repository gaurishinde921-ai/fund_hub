import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./EditProfile.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    bio: "",
    location: "",
  });

  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const refDoc = doc(db, "users", user.uid);
        const snap = await getDoc(refDoc);

        if (snap.exists()) {
          const data = snap.data();
          setForm({
            fullName: data.fullName || data.name || "",
            username: data.username || "",
            bio: data.bio || "",
            location: data.location || "",
          });
          setPreview(data.profilePic || data.photo || "");
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalPhoto = preview;

      // Handle image if a new file was picked
      if (file) {
        finalPhoto = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      }

      const updatedData = {
        ...form,
        profilePic: finalPhoto,
        updatedAt: new Date().toISOString(),
      };

      // 🔥 THE FIX: Save to FIRESTORE, not just localStorage
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, updatedData, { merge: true });

      alert("Profile updated successfully! ✅");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Save failed ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-layout">
        <Sidebar />
        <div className="edit-main">
          <div className="loader">Loading Profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-layout">
      <Sidebar />

      <div className="edit-main">
        <div className="edit-card">
          <div className="edit-header">
            <h2>Edit Profile</h2>
            <p>Update your information to build trust with donors.</p>
          </div>

          <div className="edit-avatar-section">
            <div className="edit-avatar">
              {preview ? <img src={preview} alt="Avatar" /> : <span>{form.fullName?.charAt(0) || "U"}</span>}
            </div>

            <label className="edit-upload-btn">
              Change Photo
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="input-box">
              <label>Full Name</label>
              <input
                name="fullName"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-box">
              <label>Username</label>
              <input
                name="username"
                placeholder="username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="input-box">
              <label>Bio</label>
              <textarea
                name="bio"
                placeholder="Write a short bio about yourself..."
                value={form.bio}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="input-box">
              <label>Location</label>
              <input
                name="location"
                placeholder="City, Country"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="edit-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate("/profile")}>
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}