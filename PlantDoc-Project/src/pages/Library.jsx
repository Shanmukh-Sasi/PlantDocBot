import { useState } from 'react';
import '../App.css';

export default function Library() {
  const [searchTerm, setSearchTerm] = useState('');

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
    <div style={{ maxWidth: '1100px', margin: '4rem auto', padding: '0 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2.8rem', marginBottom: '1rem', color: '#fff' }}>Global Disease Database</h2>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
          Search our comprehensive reference to identify agricultural pathogens and learn proper treatment protocols.
        </p>

        {/* Search Bar */}
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Search by disease, plant, or symptom (e.g., 'blight', 'tomato', 'spots')..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '2rem' }}>
        {filteredDiseases.length > 0 ? (
          filteredDiseases.map(d => (
            <div key={d.name} className="glass-card" style={{ padding: '2rem', textAlign: 'left', animation: 'none' }}>
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
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Cause</span>
                  <p style={{ color: '#f8fafc', margin: '0.2rem 0 0', fontSize: '1rem' }}>{d.cause}</p>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Symptoms</span>
                  <p style={{ color: '#f8fafc', margin: '0.2rem 0 0', fontSize: '1rem' }}>{d.symptoms}</p>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Treatment</span>
                  <p style={{ color: '#fcd34d', margin: '0.2rem 0 0', fontSize: '1rem' }}>{d.treatment}</p>
                </div>
                <div>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold' }}>Prevention</span>
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
              style={{ background: 'none', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '4px', marginTop: '1rem', cursor: 'pointer' }}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
