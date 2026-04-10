import React, { useEffect, useRef } from "react";
import "./Landing.css";
import { Link } from "react-router-dom";

export default function Landing() {
  const revealRefs = useRef([]);
  revealRefs.current = [];

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Triggers animation when entering viewport, resets when leaving
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          } else {
            entry.target.classList.remove("reveal-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    revealRefs.current.forEach((ref) => observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-wrap">
      {/* Background Decor */}
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>

      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-left">
            <h1 className="reveal-item" ref={addToRefs} style={{"--d": "0.1s"}}>
              Fund Your Dreams, <br />
              <span>Fuel Your Future 🚀</span>
            </h1>
            <p className="reveal-item" ref={addToRefs} style={{"--d": "0.2s"}}>
              FundHub is a modern crowdfunding platform where ideas meet
              opportunity. Whether you're building a startup, funding education,
              or supporting a social cause — FundHub helps you raise funds.
            </p>
            <div className="hero-actions reveal-item" ref={addToRefs} style={{"--d": "0.3s"}}>
              <Link to="/signup" className="btn-primary">
                Start Your Campaign →
              </Link>
              <Link to="/explore" className="btn-outline">
                Browse Projects
              </Link>
            </div>
          </div>

          <div className="hero-right reveal-item" ref={addToRefs} style={{"--d": "0.4s"}}>
            <div className="image-card">
              <img
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786"
                alt="FundHub Workspace"
              />
              <div className="image-badge">FUEL YOUR CREATION</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE FUNDHUB ================= */}
      <section className="section-container">
        <div className="section-header reveal-item" ref={addToRefs}>
          <h2>Why Choose FundHub?</h2>
          <p>Everything you need to launch, manage, and grow successful campaigns.</p>
        </div>

        <div className="grid-4-col">
          {[
            { icon: "🎯", title: "Goal-Focused", text: "Set transparent targets and track donations live." },
            { icon: "🤝", title: "Community Driven", text: "Build trust and support from people who believe in you." },
            { icon: "🔐", title: "Secure Transactions", text: "Safe, encrypted, and reliable payment infrastructure." },
            { icon: "📈", title: "Growth & Insights", text: "Analytics and tools to maximize your campaign reach." }
          ].map((item, idx) => (
            <div key={idx} className="feature-card reveal-item" ref={addToRefs} style={{"--d": `${idx * 0.15}s`}}>
              <div className="card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= WHO WE SUPPORT ================= */}
      <section className="section-container">
        <div className="section-header reveal-item" ref={addToRefs}>
          <h2>Who We Support</h2>
          <p>FundHub empowers diverse creators and communities globally.</p>
        </div>

        <div className="grid-5-col">
          {["Startups", "Small Business", "Students", "Creators", "Social Causes"].map((item, index) => (
            <div key={index} className="support-tag-card reveal-item" ref={addToRefs} style={{"--d": `${index * 0.1}s`}}>
              <h4>{item}</h4>
              <p>Empowering {item.toLowerCase()} to reach their potential.</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="final-cta">
        <div className="cta-content reveal-item" ref={addToRefs}>
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of creators and supporters making dreams come true on FundHub.</p>
          
          <div className="cta-button-group">
            <Link to="/signup" className="btn-primary">
              Create Account
            </Link>
            <Link to="/login" className="btn-outline">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}