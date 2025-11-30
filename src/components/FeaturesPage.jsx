// FeaturesPage.jsx
import React, { useState, useEffect } from 'react';
import './FeaturesPage.css';

const FeaturesPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Navigation handlers
  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const handleAboutClick = () => {
    window.location.href = '/about';
  };

  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  useEffect(() => {
    setIsVisible(true);
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      id: 1,
      icon: '🤖',
      title: 'AI-Powered Content Suggestions',
      description: 'Get intelligent writing suggestions tailored to your industry and experience level. Our AI analyzes your input and provides professional phrasing.',
      benefits: ['Smart bullet point generation', 'Industry-specific keywords', 'Professional language optimization', 'Real-time content improvement'],
      color: '#2563eb'
    },
    {
      id: 2,
      icon: '🎯',
      title: 'ATS Optimization',
      description: 'Ensure your resume passes through Applicant Tracking Systems with flying colors. We optimize formatting and keywords automatically.',
      benefits: ['ATS-friendly templates', 'Keyword optimization', 'Format compliance', 'Scanner compatibility'],
      color: '#2563eb'
    },
    {
      id: 3,
      icon: '⚡',
      title: 'One-Click Formatting',
      description: 'Transform your resume with professional layouts in seconds. Choose from multiple modern templates designed by HR experts.',
      benefits: ['Multiple template choices', 'Consistent formatting', 'Professional layouts', 'Easy customization'],
      color: '#2563eb'
    },
    {
      id: 4,
      icon: '🔍',
      title: 'Real-Time Analysis',
      description: 'Get instant feedback on your resume with our comprehensive analysis tool. Identify strengths and areas for improvement.',
      benefits: ['Content scoring', 'Gap identification', 'Impact measurement', 'Improvement suggestions'],
      color: '#2563eb'
    },
    {
      id: 5,
      icon: '💼',
      title: 'Industry-Specific Templates',
      description: 'Choose from templates designed specifically for your industry. Whether tech, healthcare, or finance, we have you covered.',
      benefits: ['Sector-specific designs', 'Role-appropriate layouts', 'Industry standards', 'Customizable elements'],
      color: '#2563eb'
    },
    {
      id: 6,
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Track your resume building progress and get recommendations for completion. Visualize your journey to the perfect resume.',
      benefits: ['Completion metrics', 'Progress indicators', 'Goal tracking', 'Achievement badges'],
      color: '#2563eb'
    }
  ];

  const stats = [
    { number: '98%', label: 'ATS Success Rate' },
    { number: '2min', label: 'Average Build Time' },
    { number: '5+', label: 'Professional Templates' },
    { number: '10K+', label: 'Resumes Created' }
  ];

  return (
    <div className="features-page">
      {/* Animated Background Elements */}
      <div className="animated-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Header */}
      <header className="features-header">
        <div className="header-content">
          <div className="logo" onClick={handleHomeClick}>
            <div className="logo-icon">IR</div>
            <div className="logo-text">InsightResume</div>
          </div>
          <nav className="nav-links">
            <button className="nav-link" onClick={handleHomeClick}>Home</button>
            <button className="nav-link active">Features</button>
            <button className="nav-link" onClick={handleAboutClick}>About</button>
            <button className="nav-link" onClick={handleContactClick}>Contact</button>
            <button className="get-started-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="features-hero">
        <div className="hero-content">
          <div className={`hero-text ${isVisible ? 'fade-in-up' : ''}`}>
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              Powerful Features
            </div>
            <h1 className="hero-title">
              Everything You Need to Create
              <span className="gradient-text"> Outstanding Resumes</span>
            </h1>
            <p className="hero-subtitle">
              Discover how our AI-powered platform transforms resume building with cutting-edge features, 
              intelligent suggestions, and professional templates designed to get you hired.
            </p>
            <div className="hero-buttons">
              <button className="hero-primary-btn" onClick={handleGetStarted}>
                <span className="btn-icon">🚀</span>
                Start Building Free
              </button>
              <button className="hero-secondary-btn" onClick={() => document.getElementById('features-grid').scrollIntoView({ behavior: 'smooth' })}>
                <span className="btn-icon">👇</span>
                Explore Features
              </button>
            </div>
          </div>
          
          {/* Animated Feature Showcase */}
          <div className="feature-showcase">
            <div className="rotating-card">
              <div className="card-inner">
                {features.map((feature, index) => (
                  <div 
                    key={feature.id}
                    className={`feature-card-preview ${index === activeFeature ? 'active' : ''}`}
                    style={{ '--accent-color': feature.color }}
                  >
                    <div className="preview-icon">{feature.icon}</div>
                    <h3 className="preview-title">{feature.title}</h3>
                    <p className="preview-description">{feature.description}</p>
                    <div className="preview-highlight"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Dots */}
            <div className="feature-nav-dots">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`nav-dot ${index === activeFeature ? 'active' : ''}`}
                  onClick={() => setActiveFeature(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-item"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="stat-number">{stat.number}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Features Grid */}
      <section id="features-grid" className="main-features-section">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features for Your Success</h2>
            <p className="section-subtitle">
              Each feature is designed to make resume building faster, smarter, and more effective
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={feature.id}
                className="feature-item"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  '--feature-color': feature.color
                }}
              >
                <div className="feature-icon-wrapper">
                  <div className="feature-icon-bg"></div>
                  <div className="feature-icon">{feature.icon}</div>
                </div>
                
                <h3 className="feature-item-title">{feature.title}</h3>
                <p className="feature-item-description">{feature.description}</p>
                
                <ul className="feature-benefits">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="benefit-item">
                      <span className="benefit-icon">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                
                <div className="feature-hover-effect"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="demo-section">
        <div className="demo-container">
          <div className="demo-content">
            <h2 className="demo-title">See It in Action</h2>
            <p className="demo-subtitle">
              Watch how InsightResume transforms basic information into a professional, ATS-optimized resume
            </p>
            
            <div className="demo-showcase">
              <div className="demo-cards">
                <div className="demo-card input-card">
                  <div className="card-header">
                    <div className="card-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="input-line short"></div>
                    <div className="input-line medium"></div>
                    <div className="input-line long"></div>
                    <div className="input-line short"></div>
                    <div className="input-line medium"></div>
                  </div>
                  <div className="card-label">Your Input</div>
                </div>
                
                <div className="demo-arrow">→</div>
                
                <div className="demo-card output-card">
                  <div className="card-header">
                    <div className="card-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="output-line header"></div>
                    <div className="output-line title"></div>
                    <div className="output-line bullet"></div>
                    <div className="output-line bullet"></div>
                    <div className="output-line bullet"></div>
                  </div>
                  <div className="card-label">Professional Output</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="features-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Transform Your Resume?</h2>
            <p className="cta-subtitle">
              Join thousands of professionals who have landed their dream jobs with InsightResume
            </p>
            <div className="cta-buttons">
              <button className="cta-btn-primary" onClick={handleGetStarted}>
                <span className="btn-sparkle">✨</span>
                Start Your Journey
                <span className="btn-arrow">→</span>
              </button>
              <button className="cta-btn-secondary" onClick={handleContactClick}>
                <span className="btn-icon">💬</span>
                Talk to Experts
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="features-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo" onClick={handleHomeClick}>
              <div className="footer-logo-icon">IR</div>
              <div className="footer-logo-text">InsightResume</div>
            </div>
            <p className="footer-description">
              AI-powered resume builder helping professionals create stunning, 
              ATS-friendly resumes that get noticed by employers.
            </p>
          </div>
          
          <div className="footer-links">
            <h3>Product</h3>
            <ul>
              <li><button onClick={handleHomeClick}>Home</button></li>
              <li><button>Features</button></li>
              <li><button onClick={handleAboutClick}>About</button></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3>Support</h3>
            <ul>
              <li><button onClick={handleContactClick}>Contact</button></li>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Get Started</h3>
            <div className="footer-auth-buttons">
              <button className="footer-auth-btn" onClick={handleGetStarted}>
                Create Resume
              </button>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 InsightResume. All rights reserved. Crafted with ❤️ for job seekers worldwide.</p>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
