import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary, #07111F)',
      color: 'var(--text-primary, #F8FAFC)',
      padding: '24px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, margin: '0 0 12px 0' }}>404</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary, #94A3B8)', marginBottom: '24px' }}>
        Destination not found on this orbit.
      </p>
      <Link
        href="/"
        style={{
          padding: '10px 20px',
          borderRadius: '100px',
          background: '#3B82F6',
          color: '#FFFFFF',
          textDecoration: 'none',
          fontWeight: 700
        }}
      >
        Return to Orbit
      </Link>
    </div>
  );
}
