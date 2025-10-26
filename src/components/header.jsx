import React from "react";
import { useNavigate } from "react-router-dom";
const styles = {
  appHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.3rem 2.3rem',
    background: 'transparent',
    borderBottom: '1px solid var(--border-subtle)',
    color: 'white',
    fontWeight: 800,
    fontFamily: "'Inter', sans-serif"
  },
  logo: { fontSize: '2rem', fontWeight: 'bold', color: 'white', textDecoration: 'none', letterSpacing: 0.6 },
  rightNav: { display: 'flex', alignItems: 'center', gap: '1.1rem', color: 'white' },
  button: {
    padding: '0.7rem 1.6rem',
    borderRadius: '50px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    backgroundColor: 'var(--primary-accent)',
    color: 'white'
  },
  login: { color: 'white', background: 'none', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }
};
export default function Header() {
  const navigate = useNavigate();
  return (
    <header style={styles.appHeader}>
      <span style={styles.logo}>IntelliResume</span>
      <div style={styles.rightNav}>
        <button style={styles.login} onClick={() => navigate('/auth')}>Login</button>
        <button style={styles.button} onClick={() => navigate('/auth')}>Get Started</button>
      </div>
    </header>
  );
}
