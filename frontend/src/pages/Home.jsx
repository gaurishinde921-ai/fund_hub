import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [campaignCount, setCampaignCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadDashboard = async () => {
      // fetch profile
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) setProfile(userSnap.data());

      // fetch campaign count
      const q = query(
        collection(db, "campaigns"),
        where("ownerId", "==", user.uid)
      );
      const snap = await getDocs(q);
      setCampaignCount(snap.size);

      setLoading(false);
    };

    loadDashboard();
  }, [user]);

  if (loading) return null;

  return (
    <div className="dash-wrapper">
      <div className="dash-card">
        <h2>Welcome, {profile?.username || "User"} 👋</h2>

        <div className="stats">
          <div className="stat">
            <h3>{campaignCount}</h3>
            <p>Campaigns</p>
          </div>

          <div className="stat">
            <h3>₹0</h3>
            <p>Funds Raised</p>
          </div>
        </div>

        <div className="actions">
          <a href="/add-post" className="primary">Add Campaign</a>
          <a href="/explore" className="secondary">Explore</a>
        </div>
      </div>
    </div>
  );
}
