import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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

        const campaignSnap = await getDocs(collection(db, "campaigns"));
        const data = campaignSnap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }));
        setCampaigns(data);

        const uniqueCats = Array.from(
          new Set(data.map(c => c.category).filter(Boolean))
        );
        setCategories(["All", ...uniqueCats]);

        const usersSnap = await getDocs(collection(db, "users"));
        const map = {};
        usersSnap.docs.forEach(d => {
          map[d.id] = d.data().username || "Unknown";
        });
        setUsersMap(map);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 300);
      }
    };

    load();
  }, []);

  useEffect(() => {
    const esc = e => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const filteredCampaigns = campaigns.filter(c => {
    const q = searchQuery.toLowerCase();

    const matchesSearch =
      c.title?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      usersMap[c.ownerId]?.toLowerCase().includes(q);

    const matchesCategory =
      activeCategory === "All" || c.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="explore-wrap">
      {/* FIXED HEADER */}
      <div className="explore-header">
        <h2>Explore Campaigns</h2>

        <div className="category-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SCROLL BODY */}
      <div className="explore-body">
        <div className="grid">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card skeleton">
                <div className="sk-cover" />
              </div>
            ))}

          {!loading &&
            filteredCampaigns.map(c => {
              const percent =
                c.goal > 0 ? Math.min((c.raised / c.goal) * 100, 100) : 0;

              return (
                <div
                  key={c.id}
                  className="card fade-in"
                  onClick={() => setSelected(c)}
                >
                  <div className="cover-placeholder" />
                  <span className="badge">{c.category}</span>

                  <h3>{c.title}</h3>

                  <p className="owner">
                    by {usersMap[c.ownerId] || "Unknown"}
                  </p>

                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="amount">
                    ₹{c.raised} / ₹{c.goal}
                  </p>

                  <button
                    className="cta"
                    onClick={e => {
                      e.stopPropagation();
                      setSelected(c);
                    }}
                  >
                    View Campaign
                  </button>
                </div>
              );
            })}
        </div>
      </div>

      {/* MODAL */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setSelected(null)}>✕</button>

            {/* FIXED: badge is NOT replacing close button */}
            <span className="badge modal-badge">
              {selected.category}
            </span>

            <h3>{selected.title}</h3>

            <p className="owner">
              by {usersMap[selected.ownerId] || "Unknown"}
            </p>

            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${
                    selected.goal > 0
                      ? Math.min((selected.raised / selected.goal) * 100, 100)
                      : 0
                  }%`,
                }}
              />
            </div>

            <p className="amount">
              ₹{selected.raised} / ₹{selected.goal}
            </p>

            <p className="desc">{selected.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
