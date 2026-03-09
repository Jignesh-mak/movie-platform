import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px' }}>
    <div style={{ fontSize: 120, lineHeight: 1, marginBottom: 16, opacity: 0.15, fontFamily: 'var(--font-display)', letterSpacing: 8 }}>404</div>
    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, letterSpacing: 3, marginBottom: 12 }}>PAGE NOT FOUND</h1>
    <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>The page you're looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn-primary">← Back to Home</Link>
  </div>
);

export default NotFoundPage;
