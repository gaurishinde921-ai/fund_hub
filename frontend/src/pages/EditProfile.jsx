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
  const userId = localStorage.getItem("user");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
  });

  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null); // selected image file

  useEffect(() => {
    if (!userId) {
      navigate("/signup");
      return;
    }

    const load = async () => {
      try {
        const refDoc = doc(db, "users", userId);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            name: data.name || "",
            username: data.username || "",
            bio: data.bio || "",
            location: data.location || data.address || "",
          });
          setPreview(data.photo || data.profilePic || "");
        }
      } catch (e) {
        console.error("Error loading profile for edit:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, navigate]);

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
    if (!userId) return;

    setSaving(true);
    try {
      let photoURL = preview;

      // upload image if a new one is selected
      if (file) {
        const storageRef = ref(storage, `profiles/${userId}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(storageRef);
      }

      const refDoc = doc(db, "users", userId);
      await setDoc(
        refDoc,
        {
          name: form.name,
          username: form.username,
          bio: form.bio,
          location: form.location,
          photo: photoURL,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      alert("Profile updated successfully ✅");
      navigate("/profile");
    } catch (e) {
      console.error("Error saving profile:", e);
      alert("Failed to save profile. " + (e.message || ""));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-layout">
        <Sidebar />
        <div className="edit-main" style={{ alignItems: "center", justifyContent: "center" }}>
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-layout">
      <Sidebar />

      <div className="edit-main">
        <div className="edit-card">
          <h2>Edit Profile</h2>

          <div className="edit-avatar-section">
            <div className="edit-avatar">
              {preview ? (
                <img src={preview} alt="preview" />
              ) : (
                <span>U</span>
              )}
            </div>

            <label className="edit-upload-btn">
              Change Photo
              <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            </label>
          </div>

          <form onSubmit={handleSubmit} className="edit-form">
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
            />

            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="your_username"
            />

            <label>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Say something about yourself & your startup"
            />

            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, Country"
            />

            <div className="edit-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate("/profile")}
              >
                Cancel
              </button>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
