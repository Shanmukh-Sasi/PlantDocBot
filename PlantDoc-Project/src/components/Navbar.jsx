import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const IconLeaf = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const IconClose = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem("isLoggedIn");
    setLoggedIn(status === "true");
    setIsMenuOpen(false); // Close menu on navigation
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setLoggedIn(false);
    alert("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ color: "var(--primary)" }}>
          <IconLeaf />
        </div>
        <span style={{ fontSize: "1.4rem", fontWeight: "800", letterSpacing: "-0.5px", color: '#fff' }}>
          PlantDoc<span style={{ color: "var(--primary)", fontWeight: "400" }}>.ai</span>
        </span>
      </Link>

      <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <IconClose /> : <IconMenu />}
      </button>

      <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
        <Link to="/diagnose" className={`nav-link ${location.pathname === '/diagnose' ? 'active' : ''}`}>Diagnose</Link>
        <Link to="/library" className={`nav-link ${location.pathname === '/library' ? 'active' : ''}`}>Disease Library</Link>
        <Link to="/Plantcare" className={`nav-link ${location.pathname === '/Plantcare' ? 'active' : ''}`}>Plant Care</Link>
        <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>

        {!loggedIn ? (
          <>
            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
            <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>Register</Link>
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
              fontWeight: "600"
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}