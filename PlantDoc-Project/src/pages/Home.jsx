export default function Home() {
  return (
    <div className="hero-section">
      <h1 className="hero-title">
        Empowering farmers with AI diagnostics
      </h1>
      <p className="hero-subtitle">
        Instantly identify crop diseases using advanced computer vision.<br/>
        Upload a photo, get expert treatment recommendations, and save your harvest.
      </p>
      
      <div className="hero-btns">
        <a href="/diagnose" style={{
          background: 'var(--primary)',
          color: '#022c22',
          padding: '1rem 2.5rem',
          borderRadius: '50px',
          fontWeight: '700',
          fontSize: '1.1rem',
          boxShadow: '0 4px 20px rgba(52, 211, 153, 0.3)'
        }}>Start Diagnosis System</a>

        <a href="/library" style={{
          background: 'rgba(255,255,255,0.05)',
          color: '#fff',
          padding: '1rem 2.5rem',
          borderRadius: '50px',
          fontWeight: '600',
          border: '1px solid rgba(255,255,255,0.1)',
          fontSize: '1.1rem'
        }}>Browse Disease Library &rarr;</a>
      </div>
    </div>
  );
}
