import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./Explore.css";

export default function Explore() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "campaigns"));
      setCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, []);

  return (
    <div className="explore-wrap">
      <h2>Explore Campaigns</h2>

      <div className="grid">
        {campaigns.map(c => (
          <div key={c.id} className="card">
            <h3>{c.title}</h3>
            <p>{c.category}</p>
            <p>₹{c.raised} / ₹{c.goal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
