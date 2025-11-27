import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// AdSense Component
const AdSenseAd = ({ adSlot, adFormat = 'auto', style = {} }) => {
  useEffect(() => {
    if (!window.adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1522324464144333';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1522324464144333"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

function Homepage() {
  const navigate = useNavigate();
  const [showTemplates, setShowTemplates] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // Navigate directly to auth page
  const handleAuthRedirect = () => {
    navigate('/auth');
  };

  // Navigate to auth with signup state
  const handleSignupRedirect = () => {
    navigate('/auth', { state: { initialTab: 'signup' } });
  };

  // Navigate to auth with login state
  const handleLoginRedirect = () => {
    navigate('/auth', { state: { initialTab: 'login' } });
  };

  const handleViewTemplates = () => {
    setShowTemplates(true);
  };

  const closeTemplates = () => {
    setShowTemplates(false);
  };

  const handleTemplateSelect = (templateName) => {
    navigate('/auth', { state: { initialTab: 'signup', selectedTemplate: templateName } });
  };

  // Responsive styles
  const styles = {
    homepage: {
      minHeight: '100vh',
      opacity: isVisible ? 1 : 0,
      transform: `translateY(${isVisible ? 0 : '20px'})`,
      transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
      background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundElements: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: -1
    },
    floatingShape: {
      position: 'absolute',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      opacity: 0.03,
      animation: 'float 6s ease-in-out infinite'
    },
    modernHeader: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      zIndex: 1000,
      padding: isMobile ? '0.75rem 0' : '1rem 0'
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: isMobile ? '0 1rem' : '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    logoBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    logoOrb: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      borderRadius: '12px',
      animation: 'orbGlow 3s ease-in-out infinite'
    },
    authButtons: {
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'center'
    },
    loginBtn: {
      background: 'transparent',
      color: '#475569',
      padding: isMobile ? '0.5rem 1rem' : '0.6rem 1.25rem',
      border: '1px solid rgba(226, 232, 240, 0.8)',
      borderRadius: '8px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: isMobile ? '0.8rem' : '0.9rem'
    },
    signupBtn: {
      background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
      color: 'white',
      padding: isMobile ? '0.5rem 1rem' : '0.6rem 1.25rem',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: isMobile ? '0.8rem' : '0.9rem'
    },
    nav: {
      display: isMobile ? 'none' : 'flex',
      gap: '2rem'
    }
  };

  return (
    <div style={styles.homepage}>
      {/* Animated Background Elements */}
      <div style={styles.backgroundElements}>
        <div style={{...styles.floatingShape, width: isMobile ? '150px' : '300px', height: isMobile ? '150px' : '300px', top: '10%', left: '5%'}}></div>
        <div style={{...styles.floatingShape, width: isMobile ? '100px' : '200px', height: isMobile ? '100px' : '200px', top: '60%', right: '10%', animationDelay: '2s'}}></div>
        <div style={{...styles.floatingShape, width: isMobile ? '75px' : '150px', height: isMobile ? '75px' : '150px', bottom: '20%', left: '20%', animationDelay: '4s'}}></div>
        <div style={{...styles.floatingShape, width: isMobile ? '125px' : '250px', height: isMobile ? '125px' : '250px', top: '30%', right: '20%', animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <header style={styles.modernHeader}>
        <div style={styles.headerContent}>
          <div style={styles.logoBox}>
            <div style={{position: 'relative', width: isMobile ? '32px' : '40px', height: isMobile ? '32px' : '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={styles.logoOrb}></div>
              <span style={{position: 'relative', color: 'white', fontWeight: 800, fontSize: isMobile ? '0.8rem' : '0.9rem'}}>IR</span>
            </div>
            <span style={{fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              InsightResume
            </span>
          </div>
          
          <nav style={styles.nav}>
            <a href="#features" style={{color: '#475569', textDecoration: 'none', fontWeight: 500, transition: 'all 0.3s ease'}}>Features</a>
            <a href="#templates" style={{color: '#475569', textDecoration: 'none', fontWeight: 500, transition: 'all 0.3s ease'}}>Templates</a>
            <a href="#about" style={{color: '#475569', textDecoration: 'none', fontWeight: 500, transition: 'all 0.3s ease'}}>About</a>
          </nav>

          {/* Updated Auth Buttons */}
          <div style={styles.authButtons}>
            <button 
              style={styles.loginBtn}
              onClick={handleLoginRedirect}
            >
              {isMobile ? 'Login' : 'Sign In'}
            </button>
            <button 
              style={styles.signupBtn}
              onClick={handleSignupRedirect}
            >
              {isMobile ? 'Start' : 'Get Started'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main style={{paddingTop: isMobile ? '80px' : '100px', minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
        <div style={{
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: isMobile ? '0 1rem' : '0 2rem', 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: isMobile ? '2rem' : '4rem', 
          alignItems: 'center'
        }}>
          {/* Left Content */}
          <div style={{textAlign: isMobile ? 'center' : 'left'}}>
            <div style={{
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: 'rgba(37, 99, 235, 0.1)', 
              color: '#2563eb', 
              padding: '0.5rem 1rem', 
              borderRadius: '20px', 
              fontSize: isMobile ? '0.8rem' : '0.9rem', 
              fontWeight: 600, 
              marginBottom: isMobile ? '1.5rem' : '2rem'
            }}>
              <span style={{width: '6px', height: '6px', background: '#2563eb', borderRadius: '50%'}}></span>
              AI-Powered Resume Builder
            </div>

            <h1 style={{
              fontSize: isMobile ? '2.5rem' : '3.5rem', 
              fontWeight: 800, 
              lineHeight: 1.1, 
              marginBottom: isMobile ? '1rem' : '1.5rem'
            }}>
              <span style={{display: 'block', color: '#0f172a'}}>Craft Resumes That</span>
              <span style={{background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                Get You <span style={{position: 'relative'}}>Hired</span>
              </span>
            </h1>

            <p style={{
              fontSize: isMobile ? '1rem' : '1.2rem', 
              color: '#475569', 
              lineHeight: 1.6, 
              marginBottom: isMobile ? '2rem' : '2.5rem'
            }}>
              Transform your career story into a compelling resume with AI-powered insights, 
              modern templates, and professional guidance—all in one platform.
            </p>

            <div style={{
              display: 'flex', 
              gap: '1rem', 
              marginBottom: isMobile ? '2rem' : '3rem',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'stretch' : 'flex-start'
            }}>
              <button 
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', 
                  color: 'white', 
                  padding: isMobile ? '1rem 1.5rem' : '1.25rem 2.5rem', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontSize: isMobile ? '1rem' : '1.1rem', 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem', 
                  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.12)'
                }}
                onClick={handleSignupRedirect}
              >
                <span>🚀</span>
                Start Building Free
              </button>
              
              <button 
                style={{
                  background: 'white', 
                  color: '#0f172a', 
                  padding: isMobile ? '1rem 1.5rem' : '1.25rem 2rem', 
                  border: '1px solid rgba(226, 232, 240, 0.8)', 
                  borderRadius: '12px', 
                  fontSize: isMobile ? '1rem' : '1.1rem', 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem', 
                  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
                }}
                onClick={handleViewTemplates}
              >
                <span>👁️</span>
                Browse Templates
              </button>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex', 
              gap: isMobile ? '1rem' : '2rem',
              justifyContent: isMobile ? 'space-around' : 'flex-start',
              flexWrap: 'wrap'
            }}>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#2563eb', marginBottom: '0.25rem'}}>10K+</div>
                <div style={{fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#64748b', fontWeight: 500}}>Resumes Created</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#2563eb', marginBottom: '0.25rem'}}>95%</div>
                <div style={{fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#64748b', fontWeight: 500}}>Success Rate</div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 800, color: '#2563eb', marginBottom: '0.25rem'}}>2min</div>
                <div style={{fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#64748b', fontWeight: 500}}>Average Time</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          {!isMobile && (
            <div style={{
              position: 'relative', 
              height: '500px', 
              background: 'rgba(255,255,255,0.5)', 
              borderRadius: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center'
            }}>
              <div style={{textAlign: 'center', color: '#64748b'}}>
                <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🎨</div>
                <p>Template Preview</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* AdSense Banner Ad after Hero Section */}
      <AdSenseAd 
        adSlot="1234567890" 
        style={{ 
          margin: isMobile ? '2rem 1rem' : '3rem 2rem',
          textAlign: 'center',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      />

      {/* Features Section */}
      <section style={{padding: isMobile ? '4rem 1rem' : '8rem 2rem', background: 'white'}}>
        <div style={{
          textAlign: 'center', 
          maxWidth: '600px', 
          margin: '0 auto 4rem auto',
          padding: isMobile ? '0 1rem' : '0'
        }}>
          <h2 style={{
            fontSize: isMobile ? '2rem' : '2.5rem', 
            fontWeight: 800, 
            marginBottom: '1rem', 
            background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent'
          }}>
            Why Choose InsightResume?
          </h2>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.1rem', 
            color: '#475569'
          }}>
            Everything you need to create a job-winning resume
          </p>
        </div>

        <div style={{
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: isMobile ? '1.5rem' : '2rem', 
          maxWidth: '1000px', 
          margin: '0 auto',
          padding: isMobile ? '0 1rem' : '0'
        }}>
          {[
            { emoji: '🤖', title: 'AI-Powered Content', desc: 'Smart suggestions and professional phrasing tailored to your industry' },
            { emoji: '🎨', title: 'Modern Templates', desc: 'Professionally designed templates that pass ATS and impress recruiters' },
            { emoji: '⚡', title: 'Instant Optimization', desc: 'Real-time feedback and optimization tips as you build your resume' }
          ].map((feature, index) => (
            <div key={index} style={{
              background: 'white', 
              padding: isMobile ? '2rem 1.5rem' : '2.5rem 2rem', 
              borderRadius: '20px', 
              textAlign: 'center', 
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)', 
              border: '1px solid rgba(226, 232, 240, 0.8)', 
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                width: isMobile ? '60px' : '80px', 
                height: isMobile ? '60px' : '80px', 
                background: 'rgba(37, 99, 235, 0.1)', 
                borderRadius: '50%', 
                margin: '0 auto 1.5rem auto', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: isMobile ? '1.5rem' : '2rem'
              }}>
                {feature.emoji}
              </div>
              <h3 style={{
                fontSize: isMobile ? '1.2rem' : '1.4rem', 
                fontWeight: 700, 
                marginBottom: '1rem', 
                color: '#0f172a'
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: '#475569', 
                lineHeight: 1.6,
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* AdSense Rectangle Ad after Features */}
        <AdSenseAd 
          adSlot="0987654321" 
          adFormat="rectangle"
          style={{ 
            margin: isMobile ? '3rem 1rem' : '4rem auto',
            textAlign: 'center',
            maxWidth: '300px',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        />
      </section>

      {/* CTA Section */}
      <section style={{
        padding: isMobile ? '4rem 1rem' : '6rem 2rem', 
        background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', 
        color: 'white', 
        textAlign: 'center'
      }}>
        <div>
          <h2 style={{
            fontSize: isMobile ? '2rem' : '2.5rem', 
            fontWeight: 800, 
            marginBottom: '1rem'
          }}>
            Ready to Transform Your Career?
          </h2>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.2rem', 
            opacity: 0.9, 
            marginBottom: '2rem', 
            maxWidth: '500px', 
            marginLeft: 'auto', 
            marginRight: 'auto'
          }}>
            Join thousands of professionals who landed their dream jobs with InsightResume
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center'
          }}>
            <button 
              style={{
                background: 'white', 
                color: '#2563eb', 
                padding: isMobile ? '1rem 2rem' : '1.25rem 3rem', 
                border: 'none', 
                borderRadius: '12px', 
                fontSize: isMobile ? '1rem' : '1.1rem', 
                fontWeight: 700, 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem'
              }}
              onClick={handleSignupRedirect}
            >
              <span>🎯</span>
              Create Your Resume Now
            </button>
            <button 
              style={{
                background: 'transparent', 
                color: 'white', 
                padding: isMobile ? '1rem 2rem' : '1.25rem 2rem', 
                border: '1px solid rgba(255, 255, 255, 0.3)', 
                borderRadius: '12px', 
                fontSize: isMobile ? '1rem' : '1.1rem', 
                fontWeight: 600, 
                cursor: 'pointer'
              }}
              onClick={handleLoginRedirect}
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer with AdSense */}
      <footer style={{
        background: '#0f172a', 
        color: 'white', 
        padding: isMobile ? '3rem 1rem 2rem 1rem' : '4rem 2rem 2rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr auto', 
          gap: isMobile ? '2rem' : '4rem', 
          marginBottom: '2rem'
        }}>
          <div>
            <div style={styles.logoBox}>
              <div style={{
                position: 'relative', 
                width: isMobile ? '32px' : '40px', 
                height: isMobile ? '32px' : '40px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <div style={styles.logoOrb}></div>
                <span style={{position: 'relative', color: 'white', fontWeight: 800, fontSize: isMobile ? '0.8rem' : '0.9rem'}}>IR</span>
              </div>
              <span style={{
                fontSize: isMobile ? '1.2rem' : '1.5rem', 
                fontWeight: 800, 
                color: 'white'
              }}>
                InsightResume
              </span>
            </div>
            <p style={{color: '#94a3b8', marginTop: '0.5rem', fontSize: isMobile ? '0.9rem' : '1rem'}}>
              Crafting career success stories
            </p>
          </div>
          
          <div style={{
            display: 'flex', 
            gap: isMobile ? '2rem' : '3rem',
            justifyContent: isMobile ? 'space-between' : 'flex-end'
          }}>
            <div>
              <h4 style={{color: 'white', marginBottom: '1rem', fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1rem'}}>Product</h4>
              <a href="#features" style={{display: 'block', color: '#94a3b8', textDecoration: 'none', marginBottom: '0.5rem', fontSize: isMobile ? '0.8rem' : '0.9rem'}}>Features</a>
              <a href="#templates" style={{display: 'block', color: '#94a3b8', textDecoration: 'none', marginBottom: '0.5rem', fontSize: isMobile ? '0.8rem' : '0.9rem'}}>Templates</a>
              <a href="#pricing" style={{display: 'block', color: '#94a3b8', textDecoration: 'none', marginBottom: '0.5rem', fontSize: isMobile ? '0.8rem' : '0.9rem'}}>Pricing</a>
            </div>
            <div>
              <h4 style={{color: 'white', marginBottom: '1rem', fontWeight: 600, fontSize: isMobile ? '0.9rem' : '1rem'}}>Support</h4>
              <button 
                onClick={handleLoginRedirect}
                style={{display: 'block', background: 'none', border: 'none', color: '#94a3b8', textDecoration: 'none', marginBottom: '0.5rem', fontSize: isMobile ? '0.8rem' : '0.9rem', cursor: 'pointer', textAlign: 'left'}}
              >
                Sign In
              </button>
              <button 
                onClick={handleSignupRedirect}
                style={{display: 'block', background: 'none', border: 'none', color: '#94a3b8', textDecoration: 'none', marginBottom: '0.5rem', fontSize: isMobile ? '0.8rem' : '0.9rem', cursor: 'pointer', textAlign: 'left'}}
              >
                Get Started
              </button>
              <a href="#contact" style={{display: 'block', color: '#94a3b8', textDecoration: 'none', marginBottom: '0.5rem', fontSize: isMobile ? '0.8rem' : '0.9rem'}}>Contact</a>
            </div>
          </div>
        </div>

        {/* Footer AdSense Banner */}
        <AdSenseAd 
          adSlot="1122334455" 
          style={{ 
            margin: '2rem auto',
            textAlign: 'center',
            maxWidth: '728px',
            borderRadius: '8px',
            overflow: 'hidden'
          }}
        />
        
        <div style={{
          maxWidth: '1200px', 
          margin: '0 auto', 
          paddingTop: '2rem', 
          borderTop: '1px solid #334155', 
          textAlign: 'center', 
          color: '#94a3b8',
          fontSize: isMobile ? '0.8rem' : '0.9rem'
        }}>
          <span>Crafted with 💙 by M</span>
        </div>
      </footer>

      {/* Templates Modal */}
      {showTemplates && (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0, 0, 0, 0.8)', 
          backdropFilter: 'blur(10px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 2000, 
          padding: isMobile ? '1rem' : '2rem'
        }}>
          <div style={{
            background: 'white', 
            borderRadius: '24px', 
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)', 
            width: '100%', 
            maxWidth: '1000px', 
            maxHeight: '90vh', 
            overflowY: 'auto'
          }}>
            <div style={{
              padding: isMobile ? '2rem 1.5rem 1rem 1.5rem' : '3rem 3rem 1rem 3rem', 
              textAlign: 'center', 
              borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
              position: 'relative'
            }}>
              <h2 style={{
                fontSize: isMobile ? '1.8rem' : '2.2rem', 
                fontWeight: 800, 
                marginBottom: '0.5rem', 
                background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent'
              }}>
                Choose Your Style
              </h2>
              <p style={{
                color: '#475569', 
                fontSize: isMobile ? '0.9rem' : '1.1rem'
              }}>
                Select a template that matches your personality and industry
              </p>
              <button 
                style={{
                  position: 'absolute', 
                  top: isMobile ? '1rem' : '1.5rem', 
                  right: isMobile ? '1rem' : '1.5rem', 
                  background: '#f1f5f9', 
                  border: 'none', 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  cursor: 'pointer', 
                  fontSize: '1.2rem'
                }}
                onClick={closeTemplates}
              >
                ×
              </button>
            </div>
            
            <div style={{
              display: 'grid', 
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: isMobile ? '1rem' : '1.5rem', 
              padding: isMobile ? '1.5rem 1.5rem 2rem 1.5rem' : '2rem 3rem 3rem 3rem'
            }}>
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
                  style={{
                    background: 'white', 
                    padding: isMobile ? '1.5rem 1rem' : '2rem 1.5rem', 
                    borderRadius: '16px', 
                    textAlign: 'center', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s ease', 
                    border: '1px solid rgba(226, 232, 240, 0.8)'
                  }}
                  onClick={() => handleTemplateSelect(template.name)}
                >
                  <div style={{
                    width: isMobile ? '60px' : '80px', 
                    height: isMobile ? '60px' : '80px', 
                    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', 
                    borderRadius: '16px', 
                    margin: '0 auto 1.5rem auto', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: isMobile ? '1.5rem' : '2rem'
                  }}>
                    {template.emoji}
                  </div>
                  <h3 style={{
                    fontSize: isMobile ? '1.1rem' : '1.2rem', 
                    fontWeight: 700, 
                    marginBottom: '0.5rem', 
                    color: '#0f172a'
                  }}>
                    {template.title}
                  </h3>
                  <p style={{
                    color: '#475569', 
                    fontSize: isMobile ? '0.8rem' : '0.9rem', 
                    lineHeight: 1.4
                  }}>
                    {template.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes orbGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

export default Homepage;
