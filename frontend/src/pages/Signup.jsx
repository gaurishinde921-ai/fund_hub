import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,                 // 🔥 ADDED
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create account (Firebase auto-login happens here)
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // 2️⃣ Send verification email
      await sendEmailVerification(res.user);

      // 3️⃣ Save user in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        username,
        email,
        emailVerified: false,
        profileCompleted: false,
        subscription: "free",
        createdAt: new Date(),
      });

      // 🔥 4️⃣ IMPORTANT FIX
      // Logout user immediately so NO site access without verification
      await signOut(auth);

      // 5️⃣ Redirect only to verify page
      navigate("/verify-email");

    } catch (err) {
      setError("Email already in use or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* 🔐 PASSWORD */}
        <div className="password-field">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPass((p) => !p)}
            aria-label="Toggle password visibility"
          >
            {showPass ? EyeIcon : EyeOffIcon}
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

/* ICONS */
const EyeIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
      stroke="white"
      strokeWidth="2"
    />
    <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" />
  </svg>
);

const EyeOffIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.81 21.81 0 0 1 5.06-7.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a21.78 21.78 0 0 1-3.17 4.35" />
    <path d="M14.12 14.12a3 3 0 0 1-4.24-4.24" />
    <path d="M1 1l22 22" />
  </svg>
);
