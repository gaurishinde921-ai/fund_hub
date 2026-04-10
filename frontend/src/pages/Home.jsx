import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, doc, getDoc, limit } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data States
  const [myCampaigns, setMyCampaigns] = useState([]);      
  const [trendingCampaigns, setTrending] = useState([]);   
  const [suggestions, setSuggestions] = useState([]);      
  const [stats, setStats] = useState({ primary: 0, secondary: 0, tertiary: 0 });

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;
        
        const myData = userSnap.data();
        setUserRole(myData.role);
        setProfile(myData);

        if (myData.role === "entrepreneur") {
          const q = query(collection(db, "campaigns"), where("ownerId", "==", user.uid));
          const snap = await getDocs(q);
          const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setMyCampaigns(docs);
          
          const totalRaised = docs.reduce((sum, c) => sum + (Number(c.raised) || 0), 0);
          setStats({ 
            primary: docs.length, 
            secondary: totalRaised, 
            tertiary: docs.filter(c => c.status === "published").length 
          });

          const suggestQ = query(collection(db, "users"), where("role", "==", "investor"), limit(5));
          const suggestSnap = await getDocs(suggestQ);
          setSuggestions(suggestSnap.docs.map(d => ({ id: d.id, ...d.data() })).filter(m => m.uid !== user.uid));
        } else {
          const trendQ = query(collection(db, "campaigns"), where("status", "==", "published"), limit(6));
          const trendSnap = await getDocs(trendQ);
          setTrending(trendSnap.docs.map(d => ({ id: d.id, ...d.data() })));
          
          // Investor Stats
          setStats({ primary: 0, secondary: 0, tertiary: 12 }); 

          const suggestQ = query(collection(db, "campaigns"), where("category", "==", myData.preferredIndustry || ""), limit(4));
          const suggestSnap = await getDocs(suggestQ);
          setSuggestions(suggestSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [user]);

  const firstName = profile?.fullName ? profile.fullName.split(' ')[0] : (profile?.username || 'User');

  // Exact Spinner Match
  if (loading) return (
    <div className={`loader-wrap ${userRole}-theme`}>
      <div className="loading-circle"></div>
    </div>
  );

  return (
    <div className={`home-container ${userRole}-theme`}>
      
      <header className="home-hero">
        <div className="hero-text">
          <h1>Welcome back, {firstName} 👋</h1>
          <p>{userRole === "investor" ? "Discover startups worth investing in today." : "Ready to grow your startup today?"}</p>
        </div>
        <button className="nav-action-btn" onClick={() => navigate(userRole === "investor" ? "/explore" : "/add-post")}>
          {userRole === "investor" ? "🔍 Explore Ideas" : "+ New Campaign"}
        </button>
      </header>

      {/* Stats Spread */}
      <div className="stats-grid-container">
        <div className="stat-card-new">
          <span className="stat-label-new">{userRole === "investor" ? "Total Invested" : "Total Campaigns"}</span>
          <h2 className="stat-value-new">{userRole === "investor" ? `₹${stats.primary}` : stats.primary}</h2>
          <div className="stat-indicator" />
        </div>
        <div className="stat-card-new">
          <span className="stat-label-new">{userRole === "investor" ? "Active Stakes" : "Funds Raised"}</span>
          <h2 className="stat-value-new">{userRole === "investor" ? stats.secondary : `₹${stats.secondary}`}</h2>
          <div className="stat-indicator" />
        </div>
        <div className="stat-card-new">
          <span className="stat-label-new">{userRole === "investor" ? "Watchlist" : "Active Campaigns"}</span>
          <h2 className="stat-value-new">{stats.tertiary}</h2>
          <div className="stat-indicator" />
        </div>
      </div>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>{userRole === "investor" ? "Suggested Startups ⭐" : "Potential Investors 🤝"}</h2>
        </div>
        <div className="suggestion-scroller">
          {suggestions.map(item => (
            <div key={item.id} className="modern-mini-card">
              <div className="mini-card-top">
  <div className="avatar-circle">
    {/* Use profileURL if it exists, otherwise show initial letter */}
    {item.profileURL ? (
      <img src={item.profileURL} alt={item.username} />
    ) : (
      <span>{item.username?.charAt(0).toUpperCase()}</span>
    )}
  </div>
  
  <div className="mini-info">
    <h4>{item.fullName || item.username}</h4>
    <p>{item.category || item.preferredIndustry || "General"}</p>
  </div>
</div>
              <button className="mini-action-btn" onClick={() => navigate(userRole === "investor" ? "/explore" : `/chat/${item.uid}`)}>
                {userRole === "investor" ? "View Details" : "Connect Now"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header">
          <h2>{userRole === "investor" ? "Trending Campaigns" : "Your Campaigns"}</h2>
          <span className="view-all-link" onClick={() => navigate("/explore")}>View All →</span>
        </div>
        <div className="standard-grid">
          {(userRole === "investor" ? trendingCampaigns : myCampaigns).map(c => (
            <div key={c.id} className="featured-card">
              <img src={c.mediaUrls?.[0] || "placeholder.jpg"} alt="cap" className="featured-img" />
              <div className="featured-body">
                <h3>{c.title}</h3>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${Math.min((c.raised/c.goal)*100, 100)}%` }} />
                </div>
                <div className="featured-footer">
                  <p>₹{c.raised} <span>of ₹{c.goal}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="upgrade-section">
  <div className="upgrade-content">
    <h3>Need more visibility? 🚀</h3>
    <p>Upgrade your plan to boost campaigns and unlock premium features.</p>
  </div>
  <button 
    className="upgrade-plan-btn" 
    onClick={() => navigate('/subscriptions')}
  >
    Upgrade Plan
  </button>
</section>
    </div>
  );
}