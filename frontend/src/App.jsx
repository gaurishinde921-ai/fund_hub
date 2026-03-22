import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

/* AUTH PAGES */
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Landing from "./pages/Landing";

/* NEW ROLE FLOW */
import SelectRole from "./pages/SelectRole";
import EntrepreneurSetup from "./pages/setup/EntrepreneurSetup";
import InvestorSetup from "./pages/setup/InvestorSetup";

/* MAIN APP */
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
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  
  // State to track if we should actually show the spinner
  const [shouldShowSpinner, setShouldShowSpinner] = useState(false);

  useEffect(() => {
    let timer;
    if (authLoading) {
      // ⏳ Only show spinner if loading takes more than 300ms
      timer = setTimeout(() => {
        setShouldShowSpinner(true);
      }, 300);
    } else {
      setShouldShowSpinner(false);
    }

    return () => clearTimeout(timer);
  }, [authLoading]);

  // If Auth is still working but hasn't hit the 300ms threshold, show a blank background
  // This prevents the "flash" of a spinner on fast connections
  if (authLoading && !shouldShowSpinner) {
    return <div style={{ backgroundColor: "#0a0a0f", minHeight: "100vh" }} />;
  }

  if (shouldShowSpinner) {
    return (
      <div className="global-spinner-overlay">
        <style>
          {`
            .global-spinner-overlay {
              position: fixed;
              top: 0; left: 0; width: 100%; height: 100%;
              background-color: #0a0a0f;
              display: flex; flex-direction: column;
              justify-content: center; align-items: center;
              z-index: 10000;
            }
            .loading-ring {
              width: 40px; height: 40px;
              border: 4px solid rgba(255, 255, 255, 0.1);
              border-top: 4px solid #ff0000;
              border-radius: 50%;
              animation: spin-animation 0.8s linear infinite;
            }
            @keyframes spin-animation {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div className="loading-ring"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        element={
          user ? (
            user.emailVerified ? (
              <AppLayout />
            ) : (
              location.pathname !== "/verify-email" && <Navigate to="/verify-email" replace />
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
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}