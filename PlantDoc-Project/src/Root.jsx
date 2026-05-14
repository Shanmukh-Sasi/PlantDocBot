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
    <div className="root-layout">
      <Navbar />

      <main className="content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/diagnose" element={<App />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/plantcare" element={<PlantCare />} />
          <Route path="/about" element={
            <div className="container" style={{ textAlign: 'center', paddingTop: '6rem' }}>
              <h2 className="library-title">About PlantDoc AI</h2>
              <p className="hero-subtitle" style={{ maxWidth: '600px', margin: '1rem auto' }}>
                PlantDoc AI is a state-of-the-art agricultural diagnostics platform. 
                Using advanced deep learning models, we help farmers and gardening enthusiasts 
                identify plant diseases instantly from just a photograph.
              </p>
              <div className="glass-card" style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem' }}>
                <p style={{ color: 'var(--primary)', fontWeight: '600' }}>Our Mission</p>
                <p style={{ color: '#94a3b8', marginTop: '0.5rem' }}>To empower farmers worldwide with accessible technology to protect their harvests and ensure food security.</p>
              </div>
            </div>
          } />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <p>© {new Date().getFullYear()} PlantDoc AI. Advanced botanical diagnosis platform.</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.7, fontSize: '0.8rem' }}>Developed for sustainable agriculture.</p>
        </div>
      </footer>
    </div>
  );
}
