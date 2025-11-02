import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Homepage.css";

function Homepage() {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAuthRedirect = () => {
    navigate('/auth');
  };

  const handleViewTemplates = () => {
    setShowTemplates(true);
  };

  const closeTemplates = () => {
    setShowTemplates(false);
  };

  const handleTemplateSelect = (templateName) => {
    navigate('/auth', { state: { selectedTemplate: templateName } });
  };

  return (
    <div className={`homepage ${isVisible ? 'visible' : ''}`}>
      {/* Animated Background Elements */}
      <div className="background-elements">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Header */}
      <header className="homepage-header modern-header">
        <div className="header-content">
          <div className="logo-box">
            <div className="logo-icon-wrapper">
              <div className="logo-orb"></div>
              <span className="logo-text">IR</span>
            </div>
            <span className="site-title">InsightResume</span>
          </div>
          
          <nav className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#templates" className="nav-link">Templates</a>
            <a href="#about" className="nav-link">About</a>
          </nav>

          <button 
            className="get-started-btn modern-btn" 
            onClick={handleAuthRedirect}
          >
            <span className="btn-sparkle">✨</span>
            Get Started
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="homepage-main">
        <div className="hero-container">
          {/* Left Content */}
          <div className="hero-content">
            <div className="badge">
              <span className="badge-dot"></span>
              AI-Powered Resume Builder
            </div>

            <h1 className="hero-title">
              <span className="title-line">Craft Resumes That</span>
              <span className="title-gradient">
                Get You <span className="text-underline">Hired</span>
              </span>
            </h1>

            <p className="hero-description">
              Transform your career story into a compelling resume with AI-powered insights, 
              modern templates, and professional guidance—all in one platform.
            </p>

            <div className="hero-buttons">
              <button 
                className="cta-primary modern-btn" 
                onClick={handleAuthRedirect}
              >
                <span className="btn-sparkle">🚀</span>
                Start Building Free
                <div className="btn-shine"></div>
              </button>
              
              <button 
                className="cta-secondary modern-btn" 
                onClick={handleViewTemplates}
              >
                <span className="btn-icon">👁️</span>
                Browse Templates
              </button>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Resumes Created</div>
              </div>
              <div className="stat">
                <div className="stat-number">95%</div>
                <div className="stat-label">Success Rate</div>
              </div>
              <div className="stat">
                <div className="stat-number">2min</div>
                <div className="stat-label">Average Time</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-header"></div>
              <div className="card-content">
                <div className="content-line"></div>
                <div className="content-line short"></div>
                <div className="content-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
            <div className="floating-card card-2">
              <div className="card-header"></div>
              <div className="card-content">
                <div className="content-line short"></div>
                <div className="content-line"></div>
                <div className="content-line short"></div>
              </div>
            </div>
            <div className="floating-card card-3">
              <div className="card-header"></div>
              <div className="card-content">
                <div className="content-line"></div>
                <div className="content-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Why Choose InsightResume?</h2>
          <p>Everything you need to create a job-winning resume</p>
        </div>

        <div className="features-grid-modern">
          <div className="feature-modern">
            <div className="feature-icon-wrapper">
              <div className="feature-orb"></div>
              <span className="feature-emoji">🤖</span>
            </div>
            <h3>AI-Powered Content</h3>
            <p>Smart suggestions and professional phrasing tailored to your industry</p>
            <div className="feature-highlight"></div>
          </div>

          <div className="feature-modern">
            <div className="feature-icon-wrapper">
              <div className="feature-orb"></div>
              <span className="feature-emoji">🎨</span>
            </div>
            <h3>Modern Templates</h3>
            <p>Professionally designed templates that pass ATS and impress recruiters</p>
            <div className="feature-highlight"></div>
          </div>

          <div className="feature-modern">
            <div className="feature-icon-wrapper">
              <div className="feature-orb"></div>
              <span className="feature-emoji">⚡</span>
            </div>
            <h3>Instant Optimization</h3>
            <p>Real-time feedback and optimization tips as you build your resume</p>
            <div className="feature-highlight"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Transform Your Career?</h2>
          <p>Join thousands of professionals who landed their dream jobs with InsightResume</p>
          <button className="cta-final modern-btn" onClick={handleAuthRedirect}>
            <span className="btn-sparkle">🎯</span>
            Create Your Resume Now
            <div className="btn-pulse"></div>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="modern-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo-box">
              <div className="logo-icon-wrapper">
                <div className="logo-orb"></div>
                <span className="logo-text">IR</span>
              </div>
              <span className="site-title">InsightResume</span>
            </div>
            <p>Crafting career success stories</p>
          </div>
          
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#templates">Templates</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <span className="made-with">Crafted with 💙 by M</span>
        </div>
      </footer>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="templates-overlay-modern">
          <div className="templates-modal-modern">
            <div className="modal-header">
              <h2>Choose Your Style</h2>
              <p>Select a template that matches your personality and industry</p>
              <button className="close-btn-modern" onClick={closeTemplates}>
                <span>×</span>
              </button>
            </div>
            
            <div className="templates-grid-modern">
              {[
                { name: 'modern', title: 'Modern', desc: 'Clean, contemporary design', emoji: '💎' },
                { name: 'professional', title: 'Professional', desc: 'Classic corporate style', emoji: '👔' },
                { name: 'creative', title: 'Creative', desc: 'For design roles', emoji: '🎨' },
                { name: 'minimal', title: 'Minimal', desc: 'Simple and elegant', emoji: '⚪' },
                { name: 'executive', title: 'Executive', desc: 'Senior level sophistication', emoji: '🏢' },
                { name: 'tech', title: 'Tech', desc: 'Modern tech industry focus', emoji: '💻' }
              ].map((template) => (
                <div 
                  key={template.name}
                  className="template-card-modern" 
                  onClick={() => handleTemplateSelect(template.name)}
                >
                  <div className="template-preview-modern">
                    <div className="template-emoji">{template.emoji}</div>
                    <div className="template-glow"></div>
                  </div>
                  <h3>{template.title}</h3>
                  <p>{template.desc}</p>
                  <div className="template-hover-effect"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;