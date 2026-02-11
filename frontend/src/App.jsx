import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ProfileSetup from "./pages/ProfileSetup";
import Requests from "./pages/Requests";
import Subscription from "./pages/Subscription";
import ProfilePage from "./pages/ProfilePage";
import AddPost from "./pages/AddPost";
import ManageCampaigns from "./pages/ManageCampaigns";
import Chat from "./pages/Chat";

/* 🔥 ADD THIS IMPORT */
import EditProfile from "./pages/EditProfile";

import AppLayout from "./components/AppLayout";

export default function App() {
  const { user, loading } = useAuth();

  // 🔒 HOLD ROUTER until auth ready
  if (loading) {
    return null; // or loader if you want
  }

  return (
    <Routes>
      {/* ROOT */}
      <Route
        path="/"
        element={
          user ? (
            user.emailVerified ? (
              <Navigate to="/home" />
            ) : (
              <Navigate to="/verify-email" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* VERIFY EMAIL — UNGUARDED */}
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* PROFILE SETUP */}
      <Route
        path="/profile-setup"
        element={user ? <ProfileSetup /> : <Navigate to="/login" />}
      />

      {/* 🔐 PROTECTED APP */}
      <Route
        element={
          user ? (
            user.emailVerified ? (
              <AppLayout />
            ) : (
              <Navigate to="/verify-email" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* 🔥 EDIT PROFILE ROUTE ADDED */}
        <Route path="/edit-profile" element={<EditProfile />} />

        <Route path="/add-post" element={<AddPost />} />
        <Route path="/manage" element={<ManageCampaigns />} />
        <Route path="/chat/:chatId" element={<Chat />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
