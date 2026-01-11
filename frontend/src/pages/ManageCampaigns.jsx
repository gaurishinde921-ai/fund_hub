import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

export default function ManageCampaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const q = query(
        collection(db, "campaigns"),
        where("ownerId", "==", user.uid)
      );
      const snap = await getDocs(q);
      setCampaigns(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    load();
  }, [user]);

  const remove = async (id) => {
    await deleteDoc(doc(db, "campaigns", id));
    setCampaigns(campaigns.filter(c => c.id !== id));
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>My Campaigns</h2>

      {campaigns.map(c => (
        <div key={c.id} style={{ marginBottom: 12 }}>
          <strong>{c.title}</strong>
          <button onClick={() => remove(c.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
