import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

/* AUTH PAGES */
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Landing from "./pages/Landing";

/* ROLE FLOW */
import SelectRole from "./pages/SelectRole";
import EntrepreneurSetup from "./pages/setup/EntrepreneurSetup";
import InvestorSetup from "./pages/setup/InvestorSetup";

/* MAIN */
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Requests from "./pages/Requests";
import Subscription from "./pages/Subscription";
import ProfilePage from "./pages/ProfilePage";
import AddPost from "./pages/AddPost";
import ManageCampaigns from "./pages/ManageCampaigns";
import Chat from "./pages/Chat";
import EditProfile from "./pages/EditProfile";
import Payment from "./pages/Payment";

/* LAYOUT */
import AppLayout from "./components/AppLayout";

export default function App() {
  const { user, loading } = useAuth();
  const location = useLocation();

  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowSpinner(true), 300);
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  /* LOADING UI */
  if (loading && !showSpinner) return null;

  if (showSpinner) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#0a0a0f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: "4px solid rgba(255,255,255,0.1)",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
      </div>
    );
  }

  return (
    <Routes>

      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/home" />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* ROLE */}
      <Route path="/select-role" element={<SelectRole />} />
      <Route path="/setup/entrepreneur" element={<EntrepreneurSetup />} />
      <Route path="/setup/investor" element={<InvestorSetup />} />

      {/* PROTECTED */}
      <Route
        element={
          user ? (
            user.emailVerified ? (
              <AppLayout />
            ) : (
              <Navigate to="/verify-email" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/subscriptions" element={<Subscription />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/add-post/:id" element={<AddPost />} />
        <Route path="/manage" element={<ManageCampaigns />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/payment" element={<Payment />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}