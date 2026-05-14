import React from "react";
import "../App.css";

const IconWater = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2C12 2 6 9 6 13a6 6 0 0 0 12 0c0-4-6-11-6-11z" />
  </svg>
);

const IconSun = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

const IconLeaf = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4 2 8 0 5.5-4.8 10-10 10z" />
  </svg>
);

const IconBug = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M8 9h8M9 3l1 2M15 3l-1 2M6 13h12M7 17h10" />
    <rect x="8" y="7" width="8" height="10" rx="4" />
  </svg>
);

const tips = [
  {
    icon: <IconWater />,
    title: "Watering Guide",
    desc: "Water plants early in the morning. Avoid overwatering to prevent root rot and fungal infections.",
  },
  {
    icon: <IconSun />,
    title: "Sunlight Needs",
    desc: "Most crops need 6–8 hours of sunlight daily for healthy growth and strong immunity.",
  },
  {
    icon: <IconLeaf />,
    title: "Soil Health",
    desc: "Use nutrient-rich soil and maintain balanced pH levels for better plant growth.",
  },
  {
    icon: <IconBug />,
    title: "Pest Prevention",
    desc: "Inspect leaves regularly and use neem oil or eco-friendly pest control methods.",
  },
];

const PlantCare = () => {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="library-header">
        <h2 className="library-title">Plant Care Guide</h2>
        <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '1rem auto 3rem' }}>
          Essential care practices to keep your crops healthy and productive.
        </p>
      </div>

      <div className="disease-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {tips.map((tip, index) => (
          <div key={index} className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{ color: "var(--primary)", marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              {tip.icon}
            </div>
            <h3 style={{ color: "white", fontSize: "1.3rem", marginBottom: "1rem" }}>
              {tip.title}
            </h3>
            <p style={{ color: "#94a3b8", lineHeight: "1.6", fontSize: "1rem" }}>
              {tip.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantCare;