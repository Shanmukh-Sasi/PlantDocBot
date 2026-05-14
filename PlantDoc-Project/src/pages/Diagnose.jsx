import { useState } from "react";
import "../App.css";
import { RECOMMENDATIONS } from "../recommendations";

const SENTIMENT_DESCRIPTIONS = {
  "POSITIVE": "Your description indicates a healthy outlook or positive observation about the plant's condition. This suggests the environment and care are likely appropriate.",
  "NEGATIVE": "The description suggests potential issues, distress, or undesirable symptoms. You may want to check for pests, soil moisture, or nutrient deficiencies.",
  "NEUTRAL": "The description appears neutral, neither strongly positive nor negative about the plant's current state."
};

// SVG Icon Components
const IconLeaf = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const IconMessage = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const IconClipboard = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const IconXCircle = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const IconCheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    const isProd = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
    const apiUrl = isProd ? '/api' : 'http://127.0.0.1:8000';

    if (!file && !text) {
      alert("Please upload an image or enter text.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (text) formData.append("text", text);

    try {
      const res = await fetch(`${apiUrl}/predict`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Prediction failed.");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      if (err.message === "Failed to fetch") {
        alert("Connection Error: Mixed Content blocked. Please allow insecure content or use HTTPS for the backend.");
      } else {
        alert(`Prediction Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const isRejected = result?.image_prediction === 'Not a plant leaf image';

  return (
    <div className="container" style={{ padding: '4rem 1rem' }}>
      <header className="library-header">
        <h1 className="library-title">AI Diagnosis System</h1>
        <p className="hero-subtitle">Upload a photo or describe symptoms for instant analysis</p>
      </header>

      <main className="main-content" style={{ margin: '0 auto' }}>
        <div className="glass-card">
          <div className="card-icon"><IconLeaf /></div>
          <h2 className="card-title">Image Analysis</h2>
          <input
            type="file"
            accept="image/*"
            className="custom-input"
            onChange={(e) => setFile(e.target.files[0])}
            id="image-upload"
          />
          <p className="label" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            Supported: JPG, PNG, WEBP
          </p>
        </div>

        <div className="glass-card">
          <div className="card-icon"><IconMessage /></div>
          <h2 className="card-title">Symptom Description</h2>
          <textarea
            className="custom-textarea"
            placeholder="e.g. Yellow spots on tomato leaves..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <p className="label" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            Optional: Describe what you see
          </p>
        </div>
      </main>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
        <button
          className="predict-btn"
          onClick={handlePredict}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Run AI Diagnosis"}
        </button>
      </div>

      {result && (
        <section className="result-container" style={{ margin: '4rem auto 0', maxWidth: '900px' }}>
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div className="diagnosis-header">
              <IconClipboard />
              <h2>Diagnosis Report</h2>
            </div>

            {isRejected && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1.2rem'
              }}>
                <IconXCircle />
                <div>
                  <p style={{ color: '#f87171', fontWeight: '700', fontSize: '1rem', margin: 0 }}>Invalid Input</p>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.2rem' }}>The image provided is not recognized as a plant leaf.</p>
                </div>
              </div>
            )}

            <div className="results-grid">
              {result.image_prediction && !isRejected && (
                <div className="stat-item" style={{
                  background: 'rgba(52, 211, 153, 0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1.5rem'
                }}>
                  <span className="label"><IconCheckCircle /> Condition</span>
                  <span className="value" style={{ color: 'var(--primary)', display: 'block', fontSize: '1.4rem', margin: '0.5rem 0' }}>
                    {result.image_prediction.replace(/_/g, ' ')}
                  </span>
                  <div style={{ marginTop: '1rem' }}>
                    <span className="label">Confidence</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem' }}>
                      <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${(result.image_confidence * 100)}%`, height: '100%', background: 'var(--primary)', borderRadius: '10px' }} />
                      </div>
                      <span className="value" style={{ fontSize: '0.9rem' }}>{(result.image_confidence * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {result.text_prediction && (
                <div className="stat-item" style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  padding: '1.5rem'
                }}>
                  <span className="label">Text Analysis</span>
                  <span className="value" style={{ 
                    color: result.text_prediction === 'NEGATIVE' ? '#f87171' : '#34d399',
                    display: 'block', margin: '0.5rem 0' 
                  }}>
                    {result.text_prediction}
                  </span>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {SENTIMENT_DESCRIPTIONS[result.text_prediction] || "Symptom analysis complete."}
                  </p>
                </div>
              )}
            </div>

            {result.image_prediction && !isRejected && (
              <div className="recommendation-box" style={{ marginTop: '2rem' }}>
                <span className="label" style={{ color: 'var(--primary)', fontWeight: '700' }}>
                  <IconShield /> Treatment Plan
                </span>
                <p className="rec-text" style={{ marginTop: '0.8rem' }}>
                  {RECOMMENDATIONS[result.image_prediction] || "Consult a local specialist for specific care."}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
