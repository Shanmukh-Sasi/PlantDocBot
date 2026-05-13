import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import App from './pages/Diagnose';
import Library from './pages/Library';
import PlantCare from "./pages/Plantcare";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './App.css';

export default function Root() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnose" element={<App />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Placeholder routes for others */}
          <Route path="/plantcare" element={<PlantCare />} />
          <Route path="/about" element={<div style={{ textAlign: 'center', marginTop: '5rem' }}><h2>About PlantDoc AI</h2><p>Built to save harvests worldwide.</p></div>} />
        </Routes>
      </div>

      <footer style={{
        padding: '2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        color: '#64748b',
        fontSize: '0.9rem',
        marginTop: 'auto'
      }}>
        © {new Date().getFullYear()} PlantDoc AI. Advanced botanical diagnosis platform.
      </footer>
    </div>
  );
}
