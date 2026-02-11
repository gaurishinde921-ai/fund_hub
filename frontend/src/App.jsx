import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ProfileSetup from "./pages/ProfileSetup";
import Requests from "./pages/Requests";
import Subscription from "./pages/Subscription";
import ProfilePage from "./pages/ProfilePage";
import AddPost from "./pages/AddPost";
import ManageCampaigns from "./pages/ManageCampaigns";
import Chat from "./pages/Chat";
import AppLayout from "./components/AppLayout";
import Payment from "./pages/Payment";




export default function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {/* ROOT */}
      <Route path="/" element={<Navigate to={user ? "/home" : "/login"} />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* PROFILE SETUP */}
      <Route
        path="/profile-setup"
        element={user ? <ProfileSetup /> : <Navigate to="/login" />}
      />
      <Route path="/payment" element={<Payment />} />
      {/* 🔥 APP LAYOUT (Sidebar + Protected Pages) */}
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/subscriptions" element={<Subscription />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/manage" element={<ManageCampaigns />} />
        <Route path="/chat/:chatId" element={<Chat />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
