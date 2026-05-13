export default function Home() {
  return (
    <div style={{ textAlign: 'center', paddingTop: '6rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1.1', background: 'linear-gradient(90deg, #fff, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Empowering farmers with AI diagnostics
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '3rem', lineHeight: '1.6' }}>
        Instantly identify crop diseases using advanced computer vision.<br/>
        Upload a photo, get expert treatment recommendations, and save your harvest.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <a href="/diagnose" style={{
          background: 'var(--primary)',
          color: '#022c22',
          padding: '1rem 2rem',
          borderRadius: '50px',
          fontWeight: '700',
          textDecoration: 'none',
          fontSize: '1.1rem',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 20px rgba(52, 211, 153, 0.3)'
        }}>Start Diagnosis System</a>

        <a href="/library" style={{
          background: 'rgba(255,255,255,0.05)',
          color: '#fff',
          padding: '1rem 2rem',
          borderRadius: '50px',
          fontWeight: '600',
          border: '1px solid rgba(255,255,255,0.1)',
          textDecoration: 'none',
          fontSize: '1.1rem',
          transition: 'all 0.2s ease'
        }}>Browse Disease Library &rarr;</a>
      </div>
    </div>
  );
}
