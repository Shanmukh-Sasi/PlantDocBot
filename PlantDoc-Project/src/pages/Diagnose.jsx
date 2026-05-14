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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/predict`, {
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
      console.error(err);
      // Detailed error for Mixed Content (HTTPS -> HTTP)
      if (err.message === "Failed to fetch") {
        alert("Connection Error: The browser is blocking the request to the insecure backend (HTTP) from this secure site (HTTPS).\n\nTo fix this for others, your backend needs an SSL certificate (HTTPS). For now, you can allow 'Insecure content' in your browser settings for this site.");
      } else {
        alert(`Prediction Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const isRejected = result?.image_prediction === 'Not a plant leaf image';

  return (
    <div className="app-container">
      {/* Main Grid */}
      <main className="main-content">
        {/* Image Card */}
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
          <p className="subtitle" style={{ fontSize: '0.85rem' }}>
            Upload a clear plant leaf image for visual detection
          </p>
        </div>

        {/* Text Card */}
        <div className="glass-card">
          <div className="card-icon"><IconMessage /></div>
          <h2 className="card-title">Description Analysis</h2>
          <textarea
            className="custom-textarea"
            placeholder="Describe the plant's health or symptoms..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <p className="subtitle" style={{ fontSize: '0.85rem' }}>
            We'll analyze the sentiment and keywords
          </p>
        </div>
      </main>

      {/* Action */}
      <button
        className="predict-btn"
        onClick={handlePredict}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Run Diagnosis"}
      </button>

      {/* Results */}
      {result && (
        <section className="result-container">
          <div className="glass-card" style={{ animation: 'none' }}>

            {/* Header */}
            <div className="diagnosis-header">
              <IconClipboard />
              <h2>Diagnosis Report</h2>
            </div>

            {/* NON-PLANT REJECTION BANNER */}
            {isRejected && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.10)',
                border: '1px solid rgba(239, 68, 68, 0.45)',
                borderRadius: '10px',
                padding: '1.1rem 1.4rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <IconXCircle />
                <div>
                  <p style={{ color: '#f87171', fontWeight: '700', fontSize: '0.95rem', margin: 0, letterSpacing: '0.02em' }}>
                    Invalid Input — Not a Plant Leaf
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '0.3rem 0 0' }}>
                    The uploaded image does not appear to be a plant leaf. Please provide a clear leaf photograph for accurate diagnosis.
                  </p>
                </div>
              </div>
            )}

            <div className="results-grid">

              {/* Valid Plant Result */}
              {result.image_prediction && !isRejected && (
                <div className="stat-item" style={{
                  background: 'rgba(52, 211, 153, 0.07)',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  borderRadius: '10px',
                  padding: '0.9rem'
                }}>
                  <span className="label">
                    <IconCheckCircle />
                    Detected Condition
                  </span>
                  <span className="value" style={{ color: 'var(--primary)', marginTop: '0.3rem', display: 'block' }}>
                    {result.image_prediction.replace(/_/g, ' ')}
                  </span>
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="label">Visual Confidence</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.3rem' }}>
                      <div style={{
                        flex: 1,
                        height: '6px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '99px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(result.image_confidence * 100).toFixed(0)}%`,
                          height: '100%',
                          background: 'var(--primary)',
                          borderRadius: '99px',
                          transition: 'width 0.6s ease'
                        }} />
                      </div>
                      <span className="value" style={{ fontSize: '0.9rem', minWidth: '48px', textAlign: 'right' }}>
                        {(result.image_confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Text Result */}
              {result.text_prediction && (
                <div className="stat-item">
                  <span className="label">Text Analysis</span>
                  <span className="value" style={{
                    color: result.text_prediction.includes('Symptoms:') || result.text_prediction === 'NEGATIVE' 
                           ? '#f87171' : '#34d399',
                    display: 'block',
                    marginTop: '0.3rem'
                  }}>
                    {result.text_prediction}
                  </span>
                  <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="label">Analysis Confidence</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.3rem' }}>
                      <div style={{
                        flex: 1,
                        height: '6px',
                        background: 'rgba(255,255,255,0.08)',
                        borderRadius: '99px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${(result.text_confidence * 100).toFixed(0)}%`,
                          height: '100%',
                          background: result.text_prediction.includes('Symptoms:') || result.text_prediction === 'NEGATIVE' 
                                      ? '#f87171' : '#34d399',
                          borderRadius: '99px',
                          transition: 'width 0.6s ease'
                        }} />
                      </div>
                      <span className="value" style={{ fontSize: '0.9rem', minWidth: '48px', textAlign: 'right' }}>
                        {(result.text_confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <p className="subtitle" style={{ marginTop: '0.75rem', fontSize: '0.82rem', textAlign: 'left', lineHeight: '1.5' }}>
                    {SENTIMENT_DESCRIPTIONS[result.text_prediction] || "Direct plant symptoms were identified from your description for analysis."}
                  </p>
                </div>
              )}
            </div>

            {/* Expert Recommendation */}
            {result.image_prediction && !isRejected && (
              <div className="recommendation-box">
                <span className="label" style={{ color: 'var(--primary)', fontWeight: '700' }}>
                  <IconShield />
                  Expert Recommendation
                </span>
                <p className="rec-text">
                  {RECOMMENDATIONS[result.image_prediction] || "No specific recommendation found for this condition."}
                </p>
              </div>
            )}

          </div>
        </section>
      )}
    </div>
  );
}
