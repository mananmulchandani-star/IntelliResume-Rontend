// FAQPage.jsx
import React, { useState } from 'react';
import './FAQPage.css';

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState({});

  // Navigation handlers
  const handleGetStarted = () => {
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

  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  const toggleItem = (category, index) => {
    setOpenItems(prev => ({
      ...prev,
      [`${category}-${index}`]: !prev[`${category}-${index}`]
    }));
  };

  const faqData = {
    general: [
      {
        question: "What is InsightResume?",
        answer: "InsightResume is an AI-powered resume builder that helps professionals create stunning, ATS-friendly resumes. Our platform combines intelligent technology with professional templates to help you land your dream job."
      },
      {
        question: "Is InsightResume free to use?",
        answer: "Yes! InsightResume offers a free plan that includes access to basic templates, AI content suggestions, and resume building features. We also offer premium plans with advanced features like unlimited resumes, premium templates, and enhanced AI capabilities."
      },
      {
        question: "Do I need to create an account?",
        answer: "Yes, creating an account is required to save your resumes and access all features. Your account helps us personalize your experience and securely store your resume data."
      },
      {
        question: "Can I use InsightResume on mobile?",
        answer: "Absolutely! InsightResume is fully responsive and works seamlessly on desktop, tablet, and mobile devices. You can create and edit your resume from anywhere."
      },
      {
        question: "How many resumes can I create?",
        answer: "On our free plan, you can create up to 3 resumes. Premium users get unlimited resume creation and storage."
      }
    ],
    features: [
      {
        question: "How does the AI resume builder work?",
        answer: "Our AI analyzes your input and provides intelligent suggestions for improving your resume content. It helps with professional phrasing, keyword optimization, and ensuring your resume meets industry standards."
      },
      {
        question: "What are ATS-optimized templates?",
        answer: "ATS (Applicant Tracking System) optimized templates are designed to be easily readable by automated resume screening systems. They ensure proper formatting, relevant keywords, and clean structure that helps your resume pass through automated filters."
      },
      {
        question: "Can I customize the templates?",
        answer: "Yes! All our templates are fully customizable. You can change colors, fonts, layouts, and sections to match your personal style and industry requirements."
      },
      {
        question: "Do you offer industry-specific templates?",
        answer: "Yes, we provide templates tailored for different industries including technology, healthcare, finance, marketing, education, and more. Each template is designed with industry best practices in mind."
      },
      {
        question: "How does the real-time analysis work?",
        answer: "Our real-time analysis tool scans your resume as you build it, providing instant feedback on content quality, formatting, keyword optimization, and overall impact. It helps identify areas for improvement immediately."
      }
    ],
    account: [
      {
        question: "How do I reset my password?",
        answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. The link will expire in 24 hours for security reasons."
      },
      {
        question: "Can I delete my account?",
        answer: "Yes, you can delete your account at any time from your account settings. Please note that this will permanently delete all your resumes and data from our system."
      },
      {
        question: "How do I update my profile information?",
        answer: "You can update your profile information, including name, email, and job preferences, from the 'My Profile' section in your account dashboard."
      },
      {
        question: "Is my data secure?",
        answer: "Absolutely. We use enterprise-grade security measures including encryption, secure servers, and regular security audits to protect your personal and resume data."
      },
      {
        question: "Can I export my data?",
        answer: "Yes, you can export your resume data in multiple formats including PDF, Word, and plain text. Premium users also get access to additional export options."
      }
    ],
    technical: [
      {
        question: "What browsers are supported?",
        answer: "InsightResume works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your browser for the best experience."
      },
      {
        question: "Do I need to install any software?",
        answer: "No installation required! InsightResume is a web-based platform that works directly in your browser. No downloads or software installations needed."
      },
      {
        question: "How often is the platform updated?",
        answer: "We regularly update InsightResume with new features, template designs, and improvements. Most updates happen seamlessly without any action required from users."
      },
      {
        question: "Can I use InsightResume offline?",
        answer: "Currently, InsightResume requires an internet connection to function as it's a cloud-based platform. However, you can download your completed resumes for offline use."
      },
      {
        question: "What should I do if I encounter technical issues?",
        answer: "If you experience any technical issues, please contact our support team at support@insightresume.in. Include details about the issue and your browser information for faster resolution."
      }
    ],
    billing: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through our payment partners."
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer: "Yes, you can cancel your subscription at any time from your account settings. Your premium features will remain active until the end of your billing period."
      },
      {
        question: "Do you offer refunds?",
        answer: "We offer a 14-day money-back guarantee for all premium plans. If you're not satisfied with our service, contact us within 14 days of purchase for a full refund."
      },
      {
        question: "How does the free trial work?",
        answer: "Our free trial gives you full access to premium features for 7 days. No credit card required to start the trial. You can cancel anytime during the trial period."
      },
      {
        question: "Can I switch between plans?",
        answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes take effect immediately, and we'll prorate any differences in billing."
      }
    ]
  };

  const categories = [
    { id: 'general', name: 'General', icon: '❓', count: faqData.general.length },
    { id: 'features', name: 'Features', icon: '⚡', count: faqData.features.length },
    { id: 'account', name: 'Account', icon: '👤', count: faqData.account.length },
    { id: 'technical', name: 'Technical', icon: '💻', count: faqData.technical.length },
    { id: 'billing', name: 'Billing', icon: '💳', count: faqData.billing.length }
  ];

  return (
    <div className="faq-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Header */}
      <header className="faq-header">
        <div className="header-content">
          <div className="logo" onClick={handleHomeClick}>
            <div className="logo-icon">IR</div>
            <div className="logo-text">InsightResume</div>
          </div>
          <nav className="nav-links">
            <button className="nav-link" onClick={handleHomeClick}>Home</button>
            <button className="nav-link" onClick={handleFeaturesClick}>Features</button>
            <button className="nav-link" onClick={handleAboutClick}>About</button>
            <button className="nav-link" onClick={handleContactClick}>Contact</button>
            <button className="get-started-btn" onClick={handleGetStarted}>
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="faq-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">💡</span>
            Frequently Asked Questions
          </div>
          <h1 className="hero-title">How Can We Help You?</h1>
          <p className="hero-subtitle">
            Find quick answers to common questions about InsightResume. 
            Can't find what you're looking for? Contact our support team.
          </p>
          
          {/* Search Bar */}
          <div className="search-container">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search for answers..." 
                className="search-input"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="faq-content">
        <div className="faq-container">
          {/* Categories Sidebar */}
          <div className="categories-sidebar">
            <h3>Categories</h3>
            <div className="category-list">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="question-count">{category.count}</span>
                </button>
              ))}
            </div>

            {/* Quick Help */}
            <div className="quick-help">
              <h4>Still Need Help?</h4>
              <p>Can't find the answer you're looking for? Our support team is here to help.</p>
              <div className="help-buttons">
                <button className="help-btn primary" onClick={handleContactClick}>
                  <span className="btn-icon">💬</span>
                  Contact Support
                </button>
                <button className="help-btn secondary" onClick={handleGetStarted}>
                  <span className="btn-icon">🚀</span>
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="faq-main">
            <div className="category-header">
              <h2>
                <span className="category-icon-large">
                  {categories.find(cat => cat.id === activeCategory)?.icon}
                </span>
                {categories.find(cat => cat.id === activeCategory)?.name} Questions
              </h2>
              <p>Common questions about {categories.find(cat => cat.id === activeCategory)?.name.toLowerCase()} aspects of InsightResume</p>
            </div>

            <div className="faq-items">
              {faqData[activeCategory].map((item, index) => (
                <div 
                  key={index}
                  className={`faq-item ${openItems[`${activeCategory}-${index}`] ? 'active' : ''}`}
                >
                  <div 
                    className="faq-question"
                    onClick={() => toggleItem(activeCategory, index)}
                  >
                    <span className="question-text">{item.question}</span>
                    <span className="toggle-icon">
                      {openItems[`${activeCategory}-${index}`] ? '−' : '+'}
                    </span>
                  </div>
                  {openItems[`${activeCategory}-${index}`] && (
                    <div className="faq-answer">
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Still Have Questions */}
            <div className="still-questions">
              <div className="questions-content">
                <h3>Still have questions?</h3>
                <p>We're here to help you get the most out of InsightResume</p>
                <div className="action-buttons">
                  <button className="action-btn primary" onClick={handleContactClick}>
                    <span className="btn-icon">📧</span>
                    Email Support
                  </button>
                  <button className="action-btn secondary" onClick={() => window.open('/help', '_blank')}>
                    <span className="btn-icon">📚</span>
                    Visit Help Center
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="faq-cta">
        <div className="cta-container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Create Your Perfect Resume?</h2>
            <p className="cta-subtitle">
              Join thousands of professionals who have transformed their careers with InsightResume
            </p>
            <div className="cta-buttons">
              <button className="cta-btn-primary" onClick={handleGetStarted}>
                <span className="btn-sparkle">✨</span>
                Start Building Now
                <span className="btn-arrow">→</span>
              </button>
              <button className="cta-btn-secondary" onClick={handleFeaturesClick}>
                <span className="btn-icon">👀</span>
                View Features
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="faq-footer">
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
              <li><button onClick={handleFeaturesClick}>Features</button></li>
              <li><button onClick={handleAboutClick}>About</button></li>
              <li><button>FAQ</button></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3>Support</h3>
            <ul>
              <li><button onClick={handleContactClick}>Contact</button></li>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
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
          <p>&copy; 2025 InsightResume. All rights reserved. We're here to help you succeed.</p>
        </div>
      </footer>
    </div>
  );
};

export default FAQPage;
