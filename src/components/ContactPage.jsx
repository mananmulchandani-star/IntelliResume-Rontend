// ContactPage.jsx
import React, { useState } from 'react';
import './ContactPage.css';

const ContactPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqData = [
    {
      question: "How does the AI resume builder work?",
      answer: "Our AI analyzes your input to suggest optimal wording, format your content professionally, and ensure your resume meets industry standards. It provides real-time suggestions and helps highlight your most relevant skills and experiences."
    },
    {
      question: "Is my data secure with InsightResume?",
      answer: "Absolutely! We use enterprise-grade encryption and follow strict data protection protocols. Your personal information and resumes are stored securely and never shared with third parties without your explicit consent."
    },
    {
      question: "Can I download my resume in different formats?",
      answer: "Yes! InsightResume supports multiple download formats including PDF, Word Document, and plain text. All formats maintain the professional formatting and layout of your resume."
    },
    {
      question: "Do you offer enterprise solutions?",
      answer: "We provide customized enterprise solutions for companies and educational institutions. Contact our accounts team at accounts@insightresume.in to discuss volume pricing, white-label options, and integration possibilities."
    },
    {
      question: "How long does it take to create a resume?",
      answer: "Most users create a professional resume in under 15 minutes using our AI-powered templates and guided process. The platform is designed to be intuitive and efficient."
    },
    {
      question: "Can I edit my resume after creating it?",
      answer: "Yes, you can edit and update your resume anytime. All your data is saved automatically, and you can make changes as your experience grows or for different job applications."
    }
  ];

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

  const handleAboutClick = () => {
    window.location.href = '/about';
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <header className="contact-header">
        <div className="header-content">
          <div className="logo" onClick={handleHomeClick}>
            <div className="logo-icon">IR</div>
            <div className="logo-text">InsightResume</div>
          </div>
          <nav className="nav-links">
            <button className="nav-link" onClick={handleHomeClick}>Home</button>
            <button className="nav-link" onClick={handleFeaturesClick}>Features</button>
            <button className="nav-link" onClick={handleAboutClick}>About</button>
            <button className="nav-link active">Contact</button>
            <button className="nav-link login-btn" onClick={handleLogin}>Login</button>
            <button className="get-started-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-headset"></i> We're Here to Help
          </div>
          <h1 className="hero-title">Get in Touch With Us</h1>
          <p className="hero-subtitle">
            Have questions about our AI-powered resume builder? Need assistance with your account? 
            Our dedicated team is ready to help you create the perfect resume for your career goals.
          </p>
          <div className="hero-buttons">
            <button className="hero-primary-btn" onClick={handleGetStarted}>
              <i className="fas fa-rocket"></i> Start Building Your Resume
            </button>
            <button className="hero-secondary-btn" onClick={handleFeaturesClick}>
              <i className="fas fa-star"></i> Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-header-text">
            <h2 className="contact-main-title">Contact Information</h2>
            <p className="contact-main-subtitle">
              Reach out to us through any of the following channels. We're always happy to help!
            </p>
          </div>
          
          <div className="contact-methods-grid">
            {/* General Inquiries */}
            <div className="contact-method-card">
              <div className="method-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="method-content">
                <h3>General Inquiries</h3>
                <p>For general questions, partnership opportunities, and business inquiries</p>
                <a href="mailto:accounts@insightresume.in" className="email-link">
                  accounts@insightresume.in
                </a>
                <span className="response-time">Response within 24 hours</span>
              </div>
            </div>

            {/* Technical Support */}
            <div className="contact-method-card">
              <div className="method-icon">
                <i className="fas fa-life-ring"></i>
              </div>
              <div className="method-content">
                <h3>Technical Support</h3>
                <p>Need help with your account, billing, or technical issues?</p>
                <a href="mailto:support@insightresume.in" className="email-link">
                  support@insightresume.in
                </a>
                <span className="response-time">Response within 12 hours</span>
              </div>
            </div>

            {/* Executive Contact */}
            <div className="contact-method-card">
              <div className="method-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="method-content">
                <h3>Executive Office</h3>
                <p>Reach out to our leadership team for strategic matters</p>
                <a href="mailto:ceo@insightresume.in" className="email-link">
                  ceo@insightresume.in
                </a>
                <span className="response-time">Response within 48 hours</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="contact-stats-section">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support Available</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">2h</div>
                <div className="stat-label">Avg. First Response</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">98%</div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <div className="stat-label">Human Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">Quick answers to common questions about InsightResume</p>
        </div>
        
        <div className="faq-grid">
          {faqData.map((faq, index) => (
            <div key={index} className="faq-item">
              <div 
                className="faq-question" 
                onClick={() => toggleFaq(index)}
              >
                {faq.question}
                <div className="faq-toggle">
                  {activeFaq === index ? '-' : '+'}
                </div>
              </div>
              {activeFaq === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Create Your Perfect Resume?</h2>
          <p className="cta-subtitle">
            Join thousands of professionals who have landed their dream jobs with resumes created on InsightResume. 
            Start building your career success story today.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn-primary" onClick={handleGetStarted}>
              <i className="fas fa-rocket"></i> Get Started Free
            </button>
            <button className="cta-btn-secondary" onClick={handleFeaturesClick}>
              <i className="fas fa-star"></i> Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="contact-footer">
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
            <div className="footer-auth-buttons">
              <button className="footer-auth-btn" onClick={handleGetStarted}>
                Get Started
              </button>
              <button className="footer-auth-btn secondary" onClick={handleLogin}>
                Login
              </button>
            </div>
          </div>
          
          <div className="footer-links">
            <h3>Company</h3>
            <ul>
              <li><button onClick={handleAboutClick}>About Us</button></li>
              <li><button onClick={handleFeaturesClick}>Features</button></li>
              <li><button>Contact</button></li>
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
            <p>
              <i className="fas fa-clock"></i>
              Mon - Fri: 9:00 AM - 6:00 PM
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

export default ContactPage;
