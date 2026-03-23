// Navbar.jsx - Shared navbar used across all public pages
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ darkBg = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [location.pathname]);

  const navbarClass = [
    'ir-navbar',
    scrolled ? 'scrolled' : 'top',
    darkBg ? 'dark-bg' : ''
  ].filter(Boolean).join(' ');

  const navLinks = [
    { label: 'Features', path: '/features' },
    { label: 'About', path: '/about' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={navbarClass} role="navigation" aria-label="Main navigation">
      <div className="ir-navbar-inner">
        {/* Logo */}
        <button
          className="ir-logo-link"
          onClick={() => navigate('/')}
          aria-label="InsightResume Home"
        >
          <div className="ir-logo-orb">
            <div className="ir-logo-bg" />
            <div className="ir-logo-shine" />
            <div className="ir-logo-glow" />
            <span className="ir-logo-text-orb">IR</span>
          </div>
          <span className={`ir-logo-name${darkBg ? ' white' : ''}`}>
            InsightResume
          </span>
        </button>

        {/* Desktop Nav Links */}
        <ul className="ir-nav-links" role="list">
          {navLinks.map(({ label, path }) => (
            <li key={path}>
              <button
                className={`ir-nav-link${isActive(path) ? ' active' : ''}`}
                onClick={() => navigate(path)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="ir-auth-buttons">
          <button className="ir-btn-ghost" onClick={() => navigate('/auth')}>
            Sign In
          </button>
          <button className="ir-btn-primary" onClick={() => navigate('/auth')}>
            Get Started
          </button>
        </div>

        {/* Hamburger for mobile */}
        <button
          className={`ir-hamburger${mobileOpen ? ' open' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`ir-mobile-menu${mobileOpen ? ' open' : ''}`} role="menu">
        {navLinks.map(({ label, path }) => (
          <button
            key={path}
            className={`ir-mobile-link${isActive(path) ? ' active' : ''}`}
            onClick={() => navigate(path)}
          >
            {label}
          </button>
        ))}
        <div className="ir-mobile-divider" />
        <div className="ir-mobile-auth">
          <button className="ir-mobile-link" onClick={() => navigate('/auth')}>
            Sign In
          </button>
          <button
            className="ir-btn-primary"
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
            onClick={() => navigate('/auth')}
          >
            Get Started Free
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
