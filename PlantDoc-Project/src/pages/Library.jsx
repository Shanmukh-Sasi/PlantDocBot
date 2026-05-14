import { useState, useEffect } from 'react';
import '../App.css';

export default function Library() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  // Fetch recent searches from SQLite backend
  useEffect(() => {
    fetchRecentSearches();
  }, []);

  const fetchRecentSearches = async () => {
    try {
      const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const apiUrl = isProd ? '/api' : 'http://127.0.0.1:8000';
      const res = await fetch(`${apiUrl}/api/recent-searches`);
      if (res.ok) {
        const data = await res.json();
        setRecentSearches(data.searches || []);
      }
    } catch (err) {
      console.error("Failed to fetch recent searches:", err);
    }
  };

  const saveSearchTerm = async (term) => {
    if (!term || term.length < 3) return;
    try {
      const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
      const apiUrl = isProd ? '/api' : 'http://127.0.0.1:8000';
      await fetch(`${apiUrl}/api/save-search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ term })
      });
      fetchRecentSearches(); // Refresh history
    } catch (err) {
      console.error("Failed to save search:", err);
    }
  };

  const diseases = [
    { 
      name: "Early Blight", 
      plant: "Tomato / Potato", 
      cause: "Fungal infection (Alternaria solani)",
      symptoms: "Brown spots with concentric rings on lower leaves",
      treatment: "Apply copper-based fungicides or chlorothalonil",
      prevention: "Crop rotation, adequate spacing for airflow, avoid overhead watering"
    },
    { 
      name: "Late Blight", 
      plant: "Tomato / Potato", 
      cause: "Oomycete pathogen (Phytophthora infestans)",
      symptoms: "Dark, water-soaked spots on leaves; white fuzzy growth on undersides",
      treatment: "Immediate application of protective fungicides; remove infected plants",
      prevention: "Plant resistant varieties, destroy volunteer potatoes, avoid prolonged leaf wetness"
    },
    { 
      name: "Powdery Mildew", 
      plant: "Squash / Cherry", 
      cause: "Various fungal species (e.g., Podosphaera)",
      symptoms: "White or gray powdery growth on leaf surfaces and stems",
      treatment: "Apply sulfur or potassium bicarbonate sprays",
      prevention: "Prune for better air circulation, plant in full sun"
    },
    { 
      name: "Apple Scab", 
      plant: "Apple", 
      cause: "Fungal infection (Venturia inaequalis)",
      symptoms: "Olive green to black velvety spots on leaves and fruit",
      treatment: "Apply fungicide sprays proactively during leaf emergence",
      prevention: "Rake and destroy fallen leaves in autumn, prune trees for airflow"
    },
    { 
      name: "Black Rot", 
      plant: "Grape", 
      cause: "Fungal infection (Guignardia bidwellii)",
      symptoms: "Brown leaf lesions with dark borders; shriveled, hard, black mummified grapes",
      treatment: "Apply fungicides early in the season before infection spreads",
      prevention: "Remove all mummified fruit, prune for canopy airflow, weed control"
    },
    { 
      name: "Rust", 
      plant: "Corn", 
      cause: "Fungal infection (Puccinia sorghi)",
      symptoms: "Orange to reddish-brown raised pustules on both upper and lower leaf surfaces",
      treatment: "Fungicides applied early in disease development if severity is high",
      prevention: "Plant rust-resistant corn hybrids"
    }
  ];

  const filteredDiseases = diseases.filter(disease => {
    const term = searchTerm.toLowerCase();
    return (
      disease.name.toLowerCase().includes(term) ||
      disease.plant.toLowerCase().includes(term) ||
      disease.symptoms.toLowerCase().includes(term) ||
      disease.cause.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div className="library-header">
        <h2 className="library-title">Global Disease Database</h2>
        <p style={{ color: '#94a3b8', fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Search our comprehensive reference to identify agricultural pathogens and learn proper treatment protocols.
        </p>

        {/* Search Bar */}
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search by disease, plant, or symptom..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => saveSearchTerm(searchTerm)}
            onKeyPress={(e) => e.key === 'Enter' && saveSearchTerm(searchTerm)}
            className="custom-input"
            style={{ 
              paddingLeft: '3rem', 
              fontSize: '1.1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderColor: 'rgba(52, 211, 153, 0.3)'
            }}
          />
          <svg 
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Recent Searches History */}
        {recentSearches.length > 0 && (
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Recent:</span>
            {recentSearches.map((term, idx) => (
              <button
                key={idx}
                onClick={() => setSearchTerm(term)}
                style={{
                  background: 'rgba(52, 211, 153, 0.08)',
                  border: '1px solid rgba(52, 211, 153, 0.2)',
                  color: 'var(--primary)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(52, 211, 153, 0.15)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(52, 211, 153, 0.08)'}
              >
                {term}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="disease-grid">
        {filteredDiseases.length > 0 ? (
          filteredDiseases.map(d => (
            <div key={d.name} className="glass-card" style={{ padding: '2rem', textAlign: 'left' }}>
              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ color: '#fff', marginBottom: '0.4rem', fontSize: '1.6rem' }}>{d.name}</h3>
                <span style={{ 
                  fontSize: '0.8rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1px', 
                  color: 'var(--primary)', 
                  fontWeight: '700',
                  background: 'rgba(52, 211, 153, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px'
                }}>
                  {d.plant}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Cause</span>
                  <p style={{ color: '#f8fafc', margin: '0.2rem 0 0', fontSize: '1rem' }}>{d.cause}</p>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Symptoms</span>
                  <p style={{ color: '#f8fafc', margin: '0.2rem 0 0', fontSize: '1rem' }}>{d.symptoms}</p>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Treatment</span>
                  <p style={{ color: '#fcd34d', margin: '0.2rem 0 0', fontSize: '1rem', fontWeight: '500' }}>{d.treatment}</p>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>Prevention</span>
                  <p style={{ color: '#34d399', margin: '0.2rem 0 0', fontSize: '1rem' }}>{d.prevention}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
            <p style={{ fontSize: '1.2rem' }}>No diseases found matching "{searchTerm}"</p>
            <button 
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '8px', marginTop: '1rem', cursor: 'pointer' }}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
