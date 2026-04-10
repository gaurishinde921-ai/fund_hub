import React from "react";
import Sidebar from "../components/Sidebar";
import "./Dashboard.css";

export default function Dashboard() {
  const role = localStorage.getItem("role");

  // ================= INVESTOR UI =================
  if (role === "investor") {
    return (
      <div className="dashboard-container">
        <Sidebar />

        <div className="dashboard-content">
          <div className="dashboard-header">
            <h2>Investor Dashboard</h2>
          </div>

          <h3 className="welcome">Welcome back, Investor 💰</h3>

          <div className="summary-boxes">
            <div className="box">
              <h3>₹50,000</h3>
              <p>Total Invested</p>
            </div>
            <div className="box">
              <h3>5</h3>
              <p>Startups Funded</p>
            </div>
            <div className="box">
              <h3>₹12,000</h3>
              <p>Returns</p>
            </div>
          </div>

          <div className="main-section">
            <div className="campaigns">
              <h3>Explore Startups 🚀</h3>
              <p>Browse and invest in startups</p>
            </div>

            <div className="donations">
              <h3>Your Investments</h3>
              <p>No investments yet</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= ENTREPRENEUR UI (YOUR EXISTING CODE) =================
  const campaigns = [
    { id: 1, title: "XYZ", raised: 1000, goal: 5000, status: "Active" },
    { id: 2, title: "ABC", raised: 2000, goal: 8000, status: "Pending" },
    { id: 3, title: "PRQ", raised: 10000, goal: 20000, status: "Pending" },
  ];

  const donations = [
    { id: 1, name: "Aditi", amount: 8000 },
    { id: 2, name: "Rahul", amount: 5000 },
    { id: 3, name: "Omkar", amount: 10000 },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Dashboard</h2>
          <div className="user-info">
            <i className="bell">🔔</i>
            <div className="profile-icon">👤</div>
          </div>
        </div>

        <h3 className="welcome">Welcome back, User 👋</h3>

        <div className="summary-boxes">
          <div className="box">
            <h3>10</h3>
            <p>Total Campaigns</p>
          </div>
          <div className="box">
            <h3>₹5,000</h3>
            <p>Total Raised</p>
          </div>
          <div className="box">
            <h3>8</h3>
            <p>Supporters Count</p>
          </div>
        </div>

        <div className="main-section">
          <div className="campaigns">
            <h3>Active Campaigns</h3>
            <table>
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Title</th>
                  <th>Raised / Goal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => (
                  <tr key={c.id}>
                    <td><div className="img-placeholder"></div></td>
                    <td>{c.title}</td>
                    <td>₹{c.raised} / ₹{c.goal}</td>
                    <td>{c.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="donations">
            <h3>Recent Donations</h3>
            {donations.map((d) => (
              <div key={d.id} className="donation-item">
                <div className="donation-img"></div>
                <div>
                  <p><strong>{d.name}</strong></p>
                  <p>₹{d.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-status">
          <h3>Profile Status</h3>
          <div className="status-box">
            <div className="circle">70%</div>
            <div>
              <p>Verification Status: <b>Pending</b></p>
              <button className="complete-btn">Complete Profile</button>
            </div>
          </div>
        </div>

        <div className="progress-graph">
          <h3>Progress</h3>
          <div className="graph-placeholder">📈 Fund vs Days</div>
        </div>
      </div>
    </div>
  );
}