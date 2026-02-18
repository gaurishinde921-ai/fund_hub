// src/pages/EditProfile.jsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { auth, db, storage } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./EditProfile.css";

export default function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
  });

  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);

  /* ================= GET USER ================= */
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
            name: data.name || "",
            username: data.username || "",
            bio: data.bio || "",
            location: data.location || "",
          });

          setPreview(data.photo || "");
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  /* ================= INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  /* ================= PHOTO ================= */
  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  /* ================= SAVE ================= */
  const handleSubmit = async (e) => {
  e.preventDefault();

  setSaving(true);

  try {
    let photoURL = preview;

    // If new photo selected → convert to base64
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        photoURL = reader.result;

        const updatedProfile = {
          ...form,
          photo: photoURL,
        };

        // SAVE LOCALLY
        localStorage.setItem(
          "profile",
          JSON.stringify(updatedProfile)
        );

        alert("Profile updated (Local) ✅");
        navigate("/profile");
      };

      reader.readAsDataURL(file);

      return; // stop further execution
    }

    // If no new photo
    const updatedProfile = {
      ...form,
      photo: photoURL,
    };

    localStorage.setItem(
      "profile",
      JSON.stringify(updatedProfile)
    );

    alert("Profile updated (Local) ✅");
    navigate("/profile");
  } catch (err) {
    console.error(err);
    alert("Save failed ❌");
  } finally {
    setSaving(false);
  }
};

  /* ================= LOADER ================= */
  if (loading) {
    return (
      <div className="edit-layout">
        <Sidebar />
        <div className="edit-main">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="edit-layout">
      <Sidebar />

      <div className="edit-main">
        <div className="edit-card">
          <h2>Edit Profile</h2>

          <div className="edit-avatar-section">
            <div className="edit-avatar">
              {preview ? <img src={preview} alt="" /> : <span>U</span>}
            </div>

            <label className="edit-upload-btn">
              Change Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="edit-form">
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
            />

            <label>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
            />

            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
            />

            <div className="edit-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-btn"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
