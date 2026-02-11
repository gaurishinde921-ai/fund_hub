import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,                 // 🔥 ADDED
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
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

<<<<<<< HEAD
      // 2️⃣ Send verification email
      await sendEmailVerification(res.user);

      // 3️⃣ Save user in Firestore
=======
      await sendEmailVerification(res.user);

>>>>>>> cde634fdd847881f995e9f5e7213f87373435980
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        username,
        email,
        emailVerified: false,
        profileCompleted: false,
        subscription: "free",
        createdAt: serverTimestamp(),
      });

<<<<<<< HEAD
      // 🔥 4️⃣ IMPORTANT FIX
      // Logout user immediately so NO site access without verification
      await signOut(auth);

      // 5️⃣ Redirect only to verify page
=======
>>>>>>> cde634fdd847881f995e9f5e7213f87373435980
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

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

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
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

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
