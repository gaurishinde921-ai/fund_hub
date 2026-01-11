import React, { useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./ProfileSetup.css";

export default function ProfileSetup() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    startupName: "",
    category: "",
    mobile: "",
    gender: "",
    address: "",
    pincode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    await setDoc(
      doc(db, "users", user.uid),
      {
        ...form,
        profileCompleted: true, // ✅ THIS IS THE KEY
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    navigate("/home", { replace: true });
  };

  return (
    <div className="ps-wrapper">
      <form className="ps-card" onSubmit={handleSubmit}>
        <h2>Complete Your Profile</h2>

        <input
          name="startupName"
          placeholder="Startup Name"
          onChange={handleChange}
          required
        />

        <select name="category" onChange={handleChange} required>
          <option value="">Select Category</option>
          <option>Food</option>
          <option>E-commerce</option>
          <option>Education</option>
          <option>Fitness</option>
          <option>Beauty</option>
          <option>Tech</option>
          <option>Other</option>
        </select>

        <input
          name="mobile"
          placeholder="Mobile Number"
          onChange={handleChange}
        />

        <select name="gender" onChange={handleChange}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <input
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
        />

        <button type="submit">Save & Continue</button>
      </form>
    </div>
  );
}
