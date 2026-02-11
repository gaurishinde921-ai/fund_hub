import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function ProfileGuard({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      // 🔴 IMPORTANT: handle NO USER case
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          setProfileCompleted(Boolean(snap.data()?.profileCompleted));
        } else {
          setProfileCompleted(false);
        }
      } catch (err) {
        console.error("ProfileGuard error:", err);
        setProfileCompleted(false);
      } finally {
        setLoading(false); // ✅ ALWAYS end loading
      }
    };

    checkProfile();
  }, [user]);

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "100px" }}>
        Checking profile…
      </div>
    );
  }

  if (!profileCompleted) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
}
