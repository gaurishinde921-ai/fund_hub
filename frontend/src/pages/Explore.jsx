import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useOutletContext } from "react-router-dom";
import "./Explore.css";

export default function Explore() {
  const [campaigns, setCampaigns] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [selected, setSelected] = useState(null);

  const [categories, setCategories] = useState(["All"]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const outlet = useOutletContext();
  const searchQuery = outlet?.searchQuery || "";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const q = query(collection(db, "campaigns"), where("status", "==", "published"));
        const campaignSnap = await getDocs(q);
        const data = campaignSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setCampaigns(data);

        const uniqueCats = Array.from(new Set(data.map(c => c.category).filter(Boolean)));
        setCategories(["All", ...uniqueCats]);

        const usersSnap = await getDocs(collection(db, "users"));
        const map = {};
        usersSnap.docs.forEach(d => { map[d.id] = d.data().username || "Unknown"; });
        setUsersMap(map);
      } catch (err) {
        console.error(err);
      } finally {
        // Keeps spinner visible for a split second to avoid flickering on fast connections
        setTimeout(() => setLoading(false), 400);
      }
    };
    load();
  }, []);

  const filteredCampaigns = campaigns.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = c.title?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q) || usersMap[c.ownerId]?.toLowerCase().includes(q);
    const matchesCategory = activeCategory === "All" || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="explore-wrap">
      <div className="explore-header">
        <h2>Explore Campaigns</h2>
        <div className="category-bar">
          {categories.map(cat => (
            <button key={cat} className={`cat-btn ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="explore-body">
        {loading ? (
          /* CONTEXTUAL LOADING: Spinner only appears where data belongs */
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px',
            width: '100%' 
          }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid" style={{ paddingTop: '20px' }}>
            {filteredCampaigns.map(c => {
              const percent = c.goal > 0 ? Math.min((c.raised / c.goal) * 100, 100) : 0;
              const image = (c.mediaUrls && c.mediaUrls.length > 0) ? c.mediaUrls[0] : "https://via.placeholder.com/300x180?text=No+Image";

              return (
                <div key={c.id} className="card" onClick={() => setSelected(c)} style={{ position: 'relative', overflow: 'visible' }}>
                  
                  {c.category && (
  <span style={{
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#ff0000',
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: 'bold',
    zIndex: 5,
    boxShadow: '0 2px 8px rgba(255,0,0,0.4)',
    whiteSpace: 'nowrap'
  }}>
    {c.category}
  </span>
)}
                  <div className="cover-placeholder" style={{ height: '180px', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
                    <img
                       src={image}
                       alt="campaign"
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       onError={(e) => {
                       e.target.src = "https://via.placeholder.com/300x180?text=No+Image";
                       }}
                     />
                  </div>

                  <div className="card-info" style={{ padding: '15px' }}>
                    <h3>{c.title}</h3>
                    <p className="owner">by {usersMap[c.ownerId] || "Unknown"}</p>
                    <div className="progress"><div className="progress-bar" style={{ width: `${percent}%` }} /></div>
                    <p className="amount">₹{c.raised || 0} / ₹{c.goal || 0}</p>
                    <button className="cta">View Campaign</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>✕</button>
            <span className="badge modal-badge" style={{ backgroundColor: '#ff0000' }}>{selected.category}</span>
            <div className="cover-placeholder" style={{ height: '300px', width: '100%', marginTop: '10px' }}>
              <img src={selected.mediaUrls?.[0] || "https://via.placeholder.com/600x400"} alt="campaign" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h3>{selected.title}</h3>
            <p className="amount">₹{selected.raised || 0} / ₹{selected.goal || 0}</p>
            <p className="desc">{selected.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}