import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ProfileSetup from "./pages/ProfileSetup";
import Requests from "./pages/Requests";
import Subscription from "./pages/Subscription";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import ProfileGuard from "./components/ProfileGuard";
import { useAuth } from "./context/AuthContext";
import AddPost from "./pages/AddPost";
import ManageCampaigns from "./pages/ManageCampaigns";
import Chat from "./pages/Chat";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/home" />} />

      <Route
        path="/profile-setup"
        element={
          <ProtectedRoute>
            <ProfileSetup />
          </ProtectedRoute>
        }
      />

      <Route
  path="/add-post"
  element={
    <ProtectedRoute>
      <ProfileGuard>
        <AddPost />
      </ProfileGuard>
    </ProtectedRoute>
  }
/>

<Route
  path="/manage"
  element={
    <ProtectedRoute>
      <ProfileGuard>
        <ManageCampaigns />
      </ProfileGuard>
    </ProtectedRoute>
  }
/>

<Route
  path="/chat/:chatId"
  element={
    <ProtectedRoute>
      <ProfileGuard>
        <Chat />
      </ProfileGuard>
    </ProtectedRoute>
  }
/>


      {["/home", "/explore", "/requests", "/subscription", "/profile"].map((p) => (
        <Route
          key={p}
          path={p}
          element={
            <ProtectedRoute>
              <ProfileGuard>
                {p === "/home" ? <Home /> :
                 p === "/explore" ? <Explore /> :
                 p === "/requests" ? <Requests /> :
                 p === "/subscription" ? <Subscription /> :
                 <ProfilePage />}
              </ProfileGuard>
            </ProtectedRoute>
          }
        />
      ))}

      <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
    </Routes>
  );
}
