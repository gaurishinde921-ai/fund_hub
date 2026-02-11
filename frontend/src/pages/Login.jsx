import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // 🔐 If email NOT verified → redirect to VerifyEmail page
      if (!auth.currentUser.emailVerified) {
        await signOut(auth);
        navigate("/verify-email");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      navigate("/home", { replace: true });
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    setInfo("");

    if (!email) {
      setError("Please enter your email first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("Password reset link sent to your email 📩");
    } catch (err) {
      setError("Unable to send reset email. Check email address.");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.card} onSubmit={handleLogin}>
        <h2 style={styles.title}>Login to FundHub</h2>

        {error && <p style={styles.error}>{error}</p>}
        {info && <p style={styles.info}>{info}</p>}

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div style={styles.passwordWrap}>
          <input
            style={styles.input}
            type={showPass ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            style={styles.eyeBtn}
            onClick={() => setShowPass((p) => !p)}
          >
            {showPass ? EyeIcon : EyeOffIcon}
          </button>
        </div>

        <div style={{ textAlign: "right", marginBottom: 12 }}>
          <button
            type="button"
            style={styles.forgot}
            onClick={handleForgotPassword}
          >
            Forgot password?
          </button>
        </div>

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.text}>
          Don’t have an account?{" "}
          <Link to="/signup" style={styles.link}>
            Sign up
          </Link>
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

/* STYLES (unchanged) */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0f172a",
  },
  card: {
    width: "360px",
    padding: "30px",
    borderRadius: "12px",
    background: "#020617",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
  },
  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #334155",
    background: "#020617",
    color: "white",
  },
  passwordWrap: { position: "relative" },
  eyeBtn: {
    position: "absolute",
    right: "10px",
    top: "12px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  forgot: {
    background: "none",
    border: "none",
    color: "#38bdf8",
    cursor: "pointer",
    fontSize: "13px",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "#f87171",
    marginBottom: "10px",
    textAlign: "center",
  },
  info: {
    color: "#4ade80",
    marginBottom: "10px",
    textAlign: "center",
  },
  text: {
    marginTop: "15px",
    textAlign: "center",
    color: "#cbd5f5",
  },
  link: {
    color: "#38bdf8",
    textDecoration: "none",
  },
};
