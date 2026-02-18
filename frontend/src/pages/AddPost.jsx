import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AddPost.css";

const CATEGORIES = [
  "Tech",
  "Food",
  "Education",
  "Health",
  "Startup",
  "Social Cause",
  "Art",
  "Music",
  "Film",
];

// 🔥 TEMP DEFAULT IMAGE (safe public image)
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f";

export default function AddPost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [media, setMedia] = useState([]);

  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const isValidDeadline = () => {
    if (!deadline) return false;
    return new Date(deadline) > new Date();
  };

  const handleMedia = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("You can upload max 5 files only");
      return;
    }
    setMedia(files);
    setDirty(true);
  };

  const publish = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!isValidDeadline()) {
      alert("Please enter a valid future date");
      return;
    }

    setLoading(true);

    await addDoc(collection(db, "campaigns"), {
      title,
      description,
      goal: Number(goal),
      raised: 0,
      category,
      ownerId: user.uid,
      createdAt: Timestamp.now(),
      deadline,
      location,

      // 🔥 TEMP FIX: fake image URL
      mediaUrls: [DEFAULT_IMAGE],
      mediaCount: media.length,

      status: "published",
    });

    setLoading(false);
    clearForm();
    alert("Campaign published 🚀");
    navigate("/profile");
  };

  const saveDraft = () => {
    const drafts = JSON.parse(localStorage.getItem("drafts")) || [];
    drafts.push({
      title,
      description,
      goal,
      deadline,
      category,
      location,
      mediaCount: media.length,
      savedAt: new Date().toISOString(),
    });
    localStorage.setItem("drafts", JSON.stringify(drafts));
    alert("Draft saved ✨");
    clearForm();
    navigate("/profile");
  };

  const cancel = () => {
    if (dirty && !window.confirm("Discard entered data?")) return;
    clearForm();
    navigate(-1);
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setGoal("");
    setDeadline("");
    setCategory("");
    setLocation("");
    setMedia([]);
    setDirty(false);
  };

  return (
    <div className="add-campaign-wrapper">
      <div className="add-campaign-card">
        <h2>Create Your Campaign</h2>
        <p className="subtitle">
          Share your vision and start raising funds for your project
        </p>

        <form onSubmit={publish}>
          <input
            placeholder="Title (max 50 words)"
            value={title}
            maxLength={300}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDirty(true);
            }}
            required
          />

          <div className="form-row">
            <input
              type="number"
              placeholder="Goal Amount (₹)"
              value={goal}
              onChange={(e) => {
                setGoal(e.target.value);
                setDirty(true);
              }}
              required
            />

            <input
              type="date"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                setDirty(true);
              }}
              required
            />
          </div>

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setDirty(true);
            }}
            required
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <input
            placeholder="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setDirty(true);
            }}
            required
          />

          <div className="media-upload">
            <label className="media-box">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMedia}
                hidden
              />
              <div className="media-content">
                <p>Media selected ({media.length}/5)</p>
                <small>(Images will be enabled later)</small>
              </div>
            </label>
          </div>

          <div className="action-buttons">
            <button type="submit" className="primary" disabled={loading}>
              {loading ? "Publishing..." : "Publish"}
            </button>

            <button type="button" className="secondary" onClick={saveDraft}>
              Save Draft
            </button>

            <button type="button" className="danger" onClick={cancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
