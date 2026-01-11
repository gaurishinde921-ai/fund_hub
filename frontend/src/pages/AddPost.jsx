import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import "./AddPost.css";

export default function AddPost() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    goal: "",
    category: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    await addDoc(collection(db, "campaigns"), {
      ...form,
      goal: Number(form.goal),
      raised: 0,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });

    navigate("/explore");
  };

  return (
    <div className="add-wrapper">
      <form className="add-card" onSubmit={handleSubmit}>
        <h2>Create Campaign</h2>

        <input name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input name="goal" type="number" placeholder="Goal Amount" onChange={handleChange} required />

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

        <button type="submit">Publish</button>
      </form>
    </div>
  );
}
