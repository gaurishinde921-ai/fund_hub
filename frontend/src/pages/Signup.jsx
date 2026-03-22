import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
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

  /* ================= HANDLERS ================= */

  const handleUsernameChange = (e) => {
    // Blocks spaces instantly and forces lowercase
    const val = e.target.value.toLowerCase().replace(/\s+/g, "");
    setUsername(val);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      // Update Auth Profile for immediate UI reflection
      await updateProfile(user, { displayName: username });

      await sendEmailVerification(user);

      // Save to Firestore with empty fields for Onboarding Check
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: email,
        fullName: "",        
        bio: "",             
        profilePic: "",      
        coverPic: "",        
        emailVerified: false,
        profileCompleted: false,
        subscription: "free",
        createdAt: serverTimestamp(),
      });

      localStorage.setItem("pendingVerification", "true");
      navigate("/verify-email");

    } catch (err) {
      console.error(err);
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSignup}>
        <h2>Create Account</h2>

        <div className="input-group">
          <input
            type="text"
            // UPDATED PROFESSIONAL PLACEHOLDER
            placeholder="Username (e.g. startup_founder)"
            value={username}
            onChange={handleUsernameChange}
            pattern="^[a-z0-9_.]+$"
            title="Usernames can only contain lowercase letters, numbers, underscores, and dots. No spaces allowed."
            required
          />
          {username && (
            <small className="handle-preview">
              Your profile link: fundhub.com/@{username}
            </small>
          )}
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
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

        <button type="submit" disabled={loading} className="signup-btn">
          {loading ? "Creating..." : "Create Account"}
        </button>

        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}