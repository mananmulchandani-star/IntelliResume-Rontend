import React from 'react';
import { FaRocket, FaFileAlt, FaAtom } from 'react-icons/fa';

const styles = {
  section: { padding: '80px 20px', textAlign: 'center' },
  heroSection: { paddingTop: '120px', color: 'white' },
  aiBadge: { display: 'inline-flex', alignItems: 'center', backgroundColor: 'rgba(106, 90, 205, 0.2)', borderRadius: '20px', padding: '8px 15px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 'bold', color: '#a394f2' },
  headline: { fontSize: '4.5rem', fontWeight: 'bold', marginBottom: '15px', lineHeight: '1.1', color: 'white' },
  highlightText: { color: 'var(--primary-color)' },
  subheadline: { fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px auto' },
  ctaButtonContainer: { display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '80px' },
  ctaButton: { backgroundColor: 'var(--secondary-color)', color: 'white', padding: '15px 35px', fontSize: '1.1rem', fontWeight: 'bold', border: 'none', borderRadius: '50px', cursor: 'pointer', textDecoration: 'none', boxShadow: '0 4px 20px rgba(0, 123, 255, 0.4)' },
  viewSampleButton: { backgroundColor: 'transparent', border: '2px solid white', color: 'white', padding: '15px 35px', fontSize: '1.1rem', fontWeight: 'bold', borderRadius: '50px', cursor: 'pointer', textDecoration: 'none' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1100px', margin: '50px auto 0 auto', textAlign: 'left' },
  featureCard: { backgroundColor: 'var(--bg-card)', padding: '30px', borderRadius: '12px', border: '1px solid var(--border-subtle)' },
  featureIcon: { fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '15px' },
  featureTitle: { fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginBottom: '10px' },
  featureDescription: { fontSize: '1rem', color: 'var(--text-dark)', lineHeight: '1.6' },
  statsContainer: { display: 'flex', justifyContent: 'space-around', maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap', padding: '60px 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' },
  statItem: { flex: '1', minWidth: '200px', margin: '15px' },
  statNumber: { fontSize: '3.5rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '5px' },
  statLabel: { fontSize: '1.1rem', color: 'var(--text-dark)' },
  readyToBuildSection: { padding: '60px 40px', background: 'var(--bg-card)', borderRadius: '15px', maxWidth: '900px', margin: '80px auto', border: '1px solid var(--border-subtle)' },
  readyHeadline: { fontSize: '2.5rem', color: 'white', marginBottom: '20px' },
  footer: { padding: '40px 20px', color: 'var(--text-dark)', fontSize: '0.9rem', borderTop: '1px solid var(--border-subtle)' }
};

function Hero() {
  return (
    <>
      <div style={styles.heroSection}>
        <div style={styles.aiBadge}><FaAtom style={{ marginRight: '8px' }} /> AI-Powered Resume Builder</div>
        <h1 style={styles.headline}>Build Your Dream Resume <br /><span style={styles.highlightText}>In Minutes, Not Hours</span></h1>
        <p style={styles.subheadline}>Create professional, ATS-friendly resumes with AI-powered content suggestions. Stand out from the crowd with stunning templates and smart recommendations.</p>
        <div style={styles.ctaButtonContainer}>
          <a href="/generate" style={styles.ctaButton}>Get Started Free &rarr;</a>
          <a href="#samples" style={styles.viewSampleButton}>View Sample</a>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Why Choose IntelliResume?</h2>
        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}><FaAtom style={styles.featureIcon} /><h3 style={styles.featureTitle}>AI-Powered Content</h3><p style={styles.featureDescription}>Get intelligent suggestions to improve your resume content.</p></div>
          <div style={styles.featureCard}><FaFileAlt style={styles.featureIcon} /><h3 style={styles.featureTitle}>Beautiful Templates</h3><p style={styles.featureDescription}>Choose from a variety of professional templates.</p></div>
          <div style={styles.featureCard}><FaRocket style={styles.featureIcon} /><h3 style={styles.featureTitle}>Instant Export</h3><p style={styles.featureDescription}>Download your resume as a high-quality PDF.</p></div>
        </div>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statItem}><div style={styles.statNumber}>10K+</div><div style={styles.statLabel}>Active Users</div></div>
        <div style={styles.statItem}><div style={styles.statNumber}>50K+</div><div style={styles.statLabel}>Resumes Created</div></div>
        <div style={styles.statItem}><div style={styles.statNumber}>95%</div><div style={styles.statLabel}>Success Rate</div></div>
      </div>

      <div style={styles.section}>
        <div style={styles.readyToBuildSection}>
          <h2 style={styles.readyHeadline}>Ready to Build Your Perfect Resume?</h2>
          <p style={styles.subheadline}>Join thousands of professionals who've landed their dream jobs.</p>
          <a href="/generate" style={styles.ctaButton}>Start Building Now &rarr;</a>
        </div>
      </div>

      <footer style={styles.footer}>&copy; 2025 IntelliResume. All rights reserved.</footer>
    </>
  );
}

export default Hero;