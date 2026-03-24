import { Routes, Route, Navigate } from "react-router-dom";

import Requests from "./pages/Requests";
<<<<<<< HEAD



export default function App() {
=======
import Subscription from "./pages/Subscription";
import ProfilePage from "./pages/ProfilePage";
import AddPost from "./pages/AddPost";
import ManageCampaigns from "./pages/ManageCampaigns";
import Chat from "./pages/Chat";
import Payment from "./pages/Payment";

import AppLayout from "./components/AppLayout";

export default function App() {

  const { user, loading } = useAuth();

  if (loading) return null;
>>>>>>> 99b4aecbc576cf233252d134f25c8a3ef5e4c22b

  return (

    <Routes>
<<<<<<< HEAD
=======

      {/* ROOT */}
      <Route
        path="/"
        element={<Navigate to={user ? "/home" : "/login"} />}
      />
>>>>>>> 99b4aecbc576cf233252d134f25c8a3ef5e4c22b

      {/* 🚀 Directly show the Requests page */}

<<<<<<< HEAD
      <Route path="/" element={<Requests />} />
=======
      {/* PROFILE SETUP */}
      <Route
        path="/profile-setup"
        element={user ? <ProfileSetup /> : <Navigate to="/login" />}
      />

      {/* PROTECTED APP (SIDEBAR LAYOUT) */}
      <Route element={user ? <AppLayout /> : <Navigate to="/login" />}>

        <Route path="/home" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/subscriptions" element={<Subscription />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/add-post" element={<AddPost />} />
        <Route path="/manage" element={<ManageCampaigns />} />
        <Route path="/chat/:chatId" element={<Chat />} />

        {/* PAYMENT PAGE */}
        <Route path="/payment" element={<Payment />} />

      </Route>
>>>>>>> 99b4aecbc576cf233252d134f25c8a3ef5e4c22b

      <Route path="*" element={<Navigate to="/" />} />

    </Routes>

  );

}