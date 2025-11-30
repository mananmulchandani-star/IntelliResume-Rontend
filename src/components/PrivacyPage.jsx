// PrivacyPage.jsx
import React from 'react';
import './PrivacyPage.css';

const PrivacyPage = () => {
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

  return (
    <div className="privacy-page">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Header */}
      <header className="privacy-header">
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
      <section className="privacy-hero">
        <div className="hero-content">
          <h1 className="hero-title">Privacy Policy</h1>
          <p className="hero-subtitle">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <div className="last-updated">
            Last updated: December 2025
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="privacy-content">
        <div className="privacy-container">
          <div className="privacy-nav">
            <h3>Quick Navigation</h3>
            <ul>
              <li><a href="#information-collection">Information We Collect</a></li>
              <li><a href="#information-use">How We Use Information</a></li>
              <li><a href="#information-sharing">Information Sharing</a></li>
              <li><a href="#data-security">Data Security</a></li>
              <li><a href="#your-rights">Your Rights</a></li>
              <li><a href="#cookies">Cookies</a></li>
              <li><a href="#changes">Policy Changes</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div className="privacy-main">
            <div className="privacy-section" id="introduction">
              <h2>Introduction</h2>
              <p>
                InsightResume ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how your personal information is collected, used, and disclosed by InsightResume.
              </p>
              <p>
                This Privacy Policy applies to our website, products, and services (collectively, "Services"). 
                By using our Services, you agree to the collection and use of information in accordance with this policy.
              </p>
            </div>

            <div className="privacy-section" id="information-collection">
              <h2>Information We Collect</h2>
              
              <h3>Personal Information</h3>
              <p>When you use our Services, we may collect the following types of information:</p>
              <ul>
                <li><strong>Account Information:</strong> Name, email address, phone number, and password when you create an account</li>
                <li><strong>Resume Data:</strong> Work experience, education, skills, projects, and other professional information</li>
                <li><strong>Profile Information:</strong> Job preferences, career objectives, and professional summary</li>
                <li><strong>Communication Data:</strong> Messages, feedback, and support requests</li>
                <li><strong>Payment Information:</strong> Billing details for premium services (processed securely by our payment providers)</li>
              </ul>

              <h3>Automatically Collected Information</h3>
              <p>We automatically collect certain information when you use our Services:</p>
              <ul>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent, and other engagement metrics</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, and device type</li>
                <li><strong>Location Data:</strong> General geographic location based on IP address</li>
                <li><strong>Cookies and Tracking:</strong> Information from cookies and similar technologies</li>
              </ul>
            </div>

            <div className="privacy-section" id="information-use">
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect for the following purposes:</p>
              <ul>
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our resume building services</li>
                <li><strong>Personalization:</strong> To customize your experience and provide relevant content</li>
                <li><strong>Communication:</strong> To send service updates, security alerts, and support messages</li>
                <li><strong>Analytics:</strong> To understand how our Services are used and improve user experience</li>
                <li><strong>Security:</strong> To protect against fraud, abuse, and security threats</li>
                <li><strong>Legal Compliance:</strong> To comply with legal obligations and enforce our terms</li>
                <li><strong>Research & Development:</strong> To develop new features and improve existing services</li>
              </ul>
            </div>

            <div className="privacy-section" id="information-sharing">
              <h2>Information Sharing and Disclosure</h2>
              <p>We do not sell your personal information to third parties. We may share your information in the following circumstances:</p>
              
              <h3>Service Providers</h3>
              <p>We may share information with trusted service providers who assist us in operating our Services:</p>
              <ul>
                <li>Cloud hosting providers for data storage</li>
                <li>Payment processors for transaction handling</li>
                <li>Analytics services for usage tracking</li>
                <li>Customer support platforms</li>
                <li>Email service providers for communications</li>
              </ul>

              <h3>Legal Requirements</h3>
              <p>We may disclose your information if required by law or in response to:</p>
              <ul>
                <li>Legal processes or governmental requests</li>
                <li>Enforcement of our Terms of Service</li>
                <li>Protection of our rights, property, or safety</li>
                <li>Prevention of fraud or security issues</li>
              </ul>

              <h3>Business Transfers</h3>
              <p>
                In the event of a merger, acquisition, or sale of all or a portion of our assets, 
                your information may be transferred to the new entity.
              </p>
            </div>

            <div className="privacy-section" id="data-security">
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <h3>Security Measures Include:</h3>
              <ul>
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Secure data center facilities</li>
                <li>Regular security training for our team</li>
              </ul>

              <p>
                While we strive to use commercially acceptable means to protect your personal information, 
                no method of transmission over the Internet or electronic storage is 100% secure.
              </p>
            </div>

            <div className="privacy-section" id="your-rights">
              <h2>Your Rights and Choices</h2>
              <p>You have the following rights regarding your personal information:</p>
              
              <h3>Access and Correction</h3>
              <ul>
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request a copy of your data in a portable format</li>
              </ul>

              <h3>Deletion and Restriction</h3>
              <ul>
                <li>Request deletion of your personal information</li>
                <li>Restrict or object to certain processing activities</li>
                <li>Withdraw consent where processing is based on consent</li>
              </ul>

              <h3>Account Management</h3>
              <ul>
                <li>Update your account information through your profile settings</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
              </ul>

              <p>
                To exercise these rights, please contact us at <a href="mailto:privacy@insightresume.in">privacy@insightresume.in</a>. 
                We will respond to your request within 30 days.
              </p>
            </div>

            <div className="privacy-section" id="cookies">
              <h2>Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our Services and hold certain information.
              </p>

              <h3>Types of Cookies We Use</h3>
              <ul>
                <li><strong>Essential Cookies:</strong> Necessary for the website to function properly</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Functionality Cookies:</strong> Enable enhanced functionality and personalization</li>
                <li><strong>Analytics Cookies:</strong> Help us improve our Services through data analysis</li>
              </ul>

              <h3>Cookie Management</h3>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. 
                However, if you do not accept cookies, you may not be able to use some portions of our Services.
              </p>
            </div>

            <div className="privacy-section" id="data-retention">
              <h2>Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes 
                outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
              
              <ul>
                <li><strong>Account Data:</strong> Retained while your account is active and for 30 days after deletion</li>
                <li><strong>Resume Data:</strong> Stored until you delete your account or specific resumes</li>
                <li><strong>Usage Data:</strong> Retained for analytics purposes for up to 2 years</li>
                <li><strong>Communication Data:</strong> Kept for customer service purposes for up to 3 years</li>
              </ul>
            </div>

            <div className="privacy-section" id="international-transfers">
              <h2>International Data Transfers</h2>
              <p>
                Your information may be transferred to and maintained on computers located outside of your state, 
                province, country, or other governmental jurisdiction where the data protection laws may differ.
              </p>
              <p>
                We ensure appropriate safeguards are in place to protect your information when transferred internationally, 
                including standard contractual clauses and adequacy decisions.
              </p>
            </div>

            <div className="privacy-section" id="children">
              <h2>Children's Privacy</h2>
              <p>
                Our Services are not intended for individuals under the age of 16. We do not knowingly collect 
                personal information from children under 16. If you are a parent or guardian and believe your 
                child has provided us with personal information, please contact us.
              </p>
            </div>

            <div className="privacy-section" id="changes">
              <h2>Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by 
                posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              <p>
                We will let you know via email and/or a prominent notice on our Services prior to the change 
                becoming effective and update the "effective date" at the top of this Privacy Policy.
              </p>
              <p>
                You are advised to review this Privacy Policy periodically for any changes. Changes to this 
                Privacy Policy are effective when they are posted on this page.
              </p>
            </div>

            <div className="privacy-section" id="contact">
              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="contact-info">
                <p><strong>Email:</strong> <a href="mailto:privacy@insightresume.in">privacy@insightresume.in</a></p>
                <p><strong>Address:</strong> InsightResume Privacy Team, [Your Company Address]</p>
                <p><strong>Response Time:</strong> We aim to respond to all privacy-related inquiries within 48 hours.</p>
              </div>
            </div>

            <div className="privacy-acknowledgment">
              <p>
                By using InsightResume, you acknowledge that you have read and understood this Privacy Policy 
                and agree to the collection, use, and disclosure of your information as described herein.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="privacy-footer">
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
            <h3>Legal</h3>
            <ul>
              <li><button>Privacy Policy</button></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/cookies">Cookie Policy</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3>Support</h3>
            <ul>
              <li><button onClick={handleContactClick}>Contact Us</button></li>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/faq">FAQ</a></li>
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
          <p>&copy; 2025 InsightResume. All rights reserved. Protecting your privacy is our priority.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPage;
