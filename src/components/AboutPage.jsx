// AboutPage.jsx
import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  // Navigation handlers
  const handleGetStarted = () => {
    window.location.href = '/auth';
  };

  const handleLogin = () => {
    window.location.href = '/auth';
  };

  const handleHomeClick = () => {
    window.location.href = '/';
  };

  const handleFeaturesClick = () => {
    window.location.href = '/features';
  };

  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  return (
    <div className="about-page">
      {/* Header */}
      <header className="about-header">
        <div className="header-content">
          <div className="logo" onClick={handleHomeClick}>
            <div className="logo-icon">IR</div>
            <div className="logo-text">InsightResume</div>
          </div>
          <nav className="nav-links">
            <button className="nav-link" onClick={handleHomeClick}>Home</button>
            <button className="nav-link" onClick={handleFeaturesClick}>Features</button>
            <button className="nav-link active">About</button>
            <button className="nav-link" onClick={handleContactClick}>Contact</button>
            <button className="get-started-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1 className="hero-title">About InsightResume</h1>
          <p className="hero-subtitle">
            Empowering job seekers with AI-powered tools to create professional resumes 
            that stand out in today's competitive job market.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="mission-container">
          <div className="mission-content">
            <h2 className="mission-title">Our Mission</h2>
            <p className="mission-text">
              At InsightResume, we believe that every professional deserves a resume that 
              truly represents their skills, experience, and potential. Our mission is to 
              democratize access to professional resume building tools, making it easy for 
              anyone to create a compelling resume that gets noticed by employers.
            </p>
            <p className="mission-text">
              We combine cutting-edge AI technology with industry best practices to help 
              job seekers at every career level—from fresh graduates to seasoned executives— 
              present their stories in the most impactful way possible.
            </p>
          </div>
          <div className="mission-stats">
            <div className="stat">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Resumes Created</div>
            </div>
            <div className="stat">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Industries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Why Choose InsightResume?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3 className="feature-title">AI-Powered Insights</h3>
              <p className="feature-description">
                Our intelligent algorithms analyze your content and provide real-time 
                suggestions to improve your resume's impact and readability.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">ATS Optimized</h3>
              <p className="feature-description">
                Every resume is optimized to pass through Applicant Tracking Systems 
                while maintaining a human-friendly design.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Quick & Easy</h3>
              <p className="feature-description">
                Create a professional resume in minutes, not hours. Our intuitive 
                interface guides you through the process step by step.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3 className="feature-title">Industry Specific</h3>
              <p className="feature-description">
                Tailored templates and content suggestions for different industries 
                and job roles to maximize relevance.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure & Private</h3>
              <p className="feature-description">
                Your data is protected with enterprise-grade security. We never share 
                your personal information with third parties.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3 className="feature-title">Always Updated</h3>
              <p className="feature-description">
                We continuously update our platform with the latest resume trends and 
                hiring practices to keep you ahead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="story-container">
          <div className="story-content">
            <h2 className="story-title">Our Story</h2>
            <p className="story-text">
              InsightResume was born from a simple observation: too many qualified professionals 
              struggle to present their skills effectively on paper. We saw brilliant people 
              with incredible potential being overlooked because their resumes didn't do them justice.
            </p>
            <p className="story-text">
              Our team of career coaches, HR professionals, and technology experts came together 
              to create a solution that would level the playing field. We wanted to make professional 
              resume building accessible to everyone, regardless of their budget or technical skills.
            </p>
            <p className="story-text">
              Today, we're proud to have helped thousands of job seekers land their dream jobs, 
              and we're committed to continuing our mission of empowering careers through technology.
            </p>
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="values-section">
        <div className="values-container">
          <h2 className="values-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3 className="value-title">Excellence</h3>
              <p className="value-description">
                We strive for excellence in everything we do, from our AI algorithms to 
                our user experience design.
              </p>
            </div>
            <div className="value-card">
              <h3 className="value-title">Innovation</h3>
              <p className="value-description">
                We continuously innovate to provide cutting-edge tools that give our 
                users a competitive advantage.
              </p>
            </div>
            <div className="value-card">
              <h3 className="value-title">Accessibility</h3>
              <p className="value-description">
                We believe professional resume building should be accessible to everyone, 
                regardless of their background or experience.
              </p>
            </div>
            <div className="value-card">
              <h3 className="value-title">Privacy</h3>
              <p className="value-description">
                We respect our users' privacy and are committed to protecting their 
                personal and professional information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your Career?</h2>
          <p className="cta-subtitle">
            Join thousands of professionals who have discovered the power of a well-crafted resume. 
            Start your journey with InsightResume today.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn-primary" onClick={handleGetStarted}>
              Start Building Now
            </button>
            <button className="cta-btn-secondary" onClick={handleFeaturesClick}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
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
            <h3>Company</h3>
            <ul>
              <li><button onClick={handleHomeClick}>Home</button></li>
              <li><button onClick={handleFeaturesClick}>Features</button></li>
              <li><button>About</button></li>
              <li><button onClick={handleContactClick}>Contact</button></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3>Legal</h3>
            <ul>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h3>Contact Info</h3>
            <p>
              <i className="fas fa-envelope"></i>
              <a href="mailto:accounts@insightresume.in">accounts@insightresume.in</a>
            </p>
            <p>
              <i className="fas fa-headset"></i>
              <a href="mailto:support@insightresume.in">support@insightresume.in</a>
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 InsightResume. All rights reserved. Crafted with ❤️ for job seekers worldwide.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
