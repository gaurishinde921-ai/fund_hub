import React, { useEffect, useState } from "react";
import {
  sendEmailVerification,
  reload,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();

  const [user, setUser] = useState(auth.currentUser);
  const [displayEmail, setDisplayEmail] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ FIX: Get email from localStorage if available
  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingUserEmail");
    if (storedEmail) {
      setDisplayEmail(storedEmail);
    }
  }, []);

  // 🔐 Watch auth user safely
  useEffect(() => {
    const interval = setInterval(() => {
      const currentUser = auth.currentUser;
      setUser(currentUser);
      
      // If user is logged in, get their email
      if (currentUser) {
        setDisplayEmail(currentUser.email);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // ✅ FIXED: Check localStorage before redirecting to login
  useEffect(() => {
    const pending = localStorage.getItem("pendingVerification");
    
    if (user === null && pending !== "true") {
      const timer = setTimeout(() => {
        if (!auth.currentUser) {
          navigate("/login");
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  const checkVerification = async () => {
    setError("");
    setInfo("Checking verification status...");
    setLoading(true);

    try {
      await reload(auth.currentUser);

      if (auth.currentUser.emailVerified) {
        setInfo("Email verified successfully ✅");

        // ✅ FIX: Clear pending verification flag
        localStorage.removeItem("pendingVerification");
        localStorage.removeItem("pendingUserEmail");

        setTimeout(() => {
          navigate("/select-role");
        }, 1200);
      } else {
        setError("Please verify your email first ❌");
        setInfo("");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async () => {
    setError("");
    setInfo("");

    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setInfo("Verification email resent 📩");
      } else {
        setError("Session expired. Please login to resend.");
      }
    } catch {
      setError("Unable to resend email. Try again later.");
    }
  };

  const logout = async () => {
    localStorage.removeItem("pendingVerification");
    localStorage.removeItem("pendingUserEmail");
    await signOut(auth);
    navigate("/login");
  };

  // ✅ FIX: Show content if we have email from localStorage, even if user is null
  if (!user && !displayEmail) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Verify Your Email</h2>

        <p style={styles.text}>
          We've sent a verification link to:
        </p>

        <p style={styles.email}>{displayEmail}</p>

        <p style={styles.subtext}>
          Please verify your email to continue using FundHub.
        </p>

        {info && <p style={styles.info}>{info}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <button
          style={styles.primaryBtn}
          onClick={checkVerification}
          disabled={loading}
        >
          I've Verified My Email
        </button>

        <button style={styles.secondaryBtn} onClick={resendEmail}>
          Resend Verification Email
        </button>

        <button style={styles.logoutBtn} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #020617, #0f172a)",
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
    margin: "8px 0",
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
    background: "none",
    border: "none",
    color: "#f87171",
    cursor: "pointer",
    fontSize: "13px",
  },
  info: {
    color: "#4ade80",
    marginBottom: "10px",
  },
  error: {
    color: "#f87171",
    marginBottom: "10px",
  },
};