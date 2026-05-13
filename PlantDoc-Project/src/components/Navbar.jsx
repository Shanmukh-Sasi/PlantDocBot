import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const IconLeaf = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    setLoggedIn(status === "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setLoggedIn(false);
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.2rem 4rem",
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
          color: "#fff",
        }}
      >
        <div style={{ color: "var(--primary)" }}>
          <IconLeaf />
        </div>
        <span
          style={{
            fontSize: "1.4rem",
            fontWeight: "800",
            letterSpacing: "-0.5px",
          }}
        >
          PlantDoc
          <span style={{ color: "var(--primary)", fontWeight: "400" }}>
            .ai
          </span>
        </span>
      </Link>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/diagnose" className="nav-link">Diagnose</Link>
        <Link to="/library" className="nav-link">Disease Library</Link>
        <Link to="/Plantcare" className="nav-link">Plant Care</Link>
        <Link to="/about" className="nav-link">About</Link>

        {!loggedIn ? (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "1px solid var(--primary)",
              color: "var(--primary)",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}