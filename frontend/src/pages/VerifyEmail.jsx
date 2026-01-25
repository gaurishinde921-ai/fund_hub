import React, { useEffect, useState } from "react";
import {
  sendEmailVerification,
  signOut,
  reload,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.emailVerified) {
      navigate("/profile-setup");
    } else {
      setChecking(false);
    }
  }, [navigate]);

  const checkVerification = async () => {
    setError("");
    setInfo("Checking verification status...");

    try {
      await reload(auth.currentUser);

      if (auth.currentUser.emailVerified) {
        navigate("/profile-setup");
      } else {
        setInfo("");
        setError("Email not verified yet. Please check your inbox.");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  const resendVerification = async () => {
    setError("");
    setInfo("");

    try {
      await sendEmailVerification(auth.currentUser);
      setInfo("Verification email resent 📩");
    } catch (err) {
      setError("Unable to resend verification email.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (checking) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify Your Email</h2>

        <p style={styles.text}>
          We’ve sent a verification link to:
        </p>

        <p style={styles.email}>{auth.currentUser.email}</p>

        <p style={styles.subtext}>
          Please verify your email to continue using FundHub.
        </p>

        {info && <p style={styles.info}>{info}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <button style={styles.primaryBtn} onClick={checkVerification}>
          I’ve Verified My Email
        </button>

        <button style={styles.secondaryBtn} onClick={resendVerification}>
          Resend Email
        </button>

        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    width: "420px",
    background: "#020617",
    padding: "34px",
    borderRadius: "14px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
    textAlign: "center",
  },
  title: {
    color: "#fff",
    marginBottom: "14px",
  },
  text: {
    color: "#cbd5f5",
    fontSize: "14px",
  },
  email: {
    color: "#38bdf8",
    fontWeight: "600",
    margin: "8px 0 12px",
    wordBreak: "break-all",
  },
  subtext: {
    color: "#94a3b8",
    fontSize: "13px",
    marginBottom: "20px",
  },
  primaryBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "10px",
  },
  secondaryBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "transparent",
    color: "#cbd5f5",
    cursor: "pointer",
    marginBottom: "10px",
  },
  logoutBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "#f87171",
    cursor: "pointer",
