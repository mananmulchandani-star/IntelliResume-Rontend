import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabase';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      console.log('✅ User already logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (location.state?.selectedTemplate) {
      setIsLogin(false);
    }
  }, [location.state]);

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    
    if (!formData.password) {
      setError('Please enter your password');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (!isLogin && !formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        console.log('🔄 Attempting login...');
        const result = await login(formData.email, formData.password);
        
        if (!result || !result.user || !result.user.id) {
          throw new Error('Login failed: No user data received');
        }

        let userProfile = await getUserProfile(result.user.id);
        
        if (!userProfile) {
          console.log('🔄 Creating user profile...');
          userProfile = await createUserProfile(result.user.id, result.user.email);
        }

        if (result.session && result.session.access_token) {
          localStorage.setItem('token', result.session.access_token);
          localStorage.setItem('user', JSON.stringify(userProfile));
          localStorage.setItem('loggedInEmail', formData.email.trim().toLowerCase());
          
          console.log('✅ Login successful, redirecting to dashboard');
          setSuccess('Login successful! Redirecting...');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          throw new Error('Login successful but no session token received');
        }
      } else {
        console.log('🔄 Attempting signup...');
        const result = await signUp(formData.email, formData.password);
        
        if (result && result.user) {
          await createUserProfile(result.user.id, formData.email, formData.name);
          
          setSuccess('Account created successfully! Please check your email for confirmation link.');
          setError('');
          
          setTimeout(() => {
            setIsLogin(true);
            setFormData(prev => ({ ...prev, password: '', name: '' }));
          }, 2000);
          
        } else {
          throw new Error('Signup failed: No user data received');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setSuccess('');
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.log('No user profile found:', error.message);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  const createUserProfile = async (userId, email, name = '') => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            email: email,
            name: name || email.split('@')[0],
            created_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error.message);
        return {
          id: userId,
          email: email,
          name: name || email.split('@')[0]
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return {
        id: userId,
        email: email,
        name: name || email.split('@')[0]
      };
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address to reset password');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await resetPassword(formData.email);
      setSuccess('Password reset email sent! Please check your inbox.');
    } catch (error) {
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="auth-page">
      {/* Background Elements */}
      <div className="auth-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
      </div>

      {/* Header */}
      <header className="auth-header">
        <div className="logo-box" onClick={handleBackToHome}>
          <div className="logo-icon-wrapper">
            <div className="logo-orb"></div>
            <span className="logo-text">IR</span>
          </div>
          <span className="site-title">InsightResume</span>
        </div>
      </header>

      {/* Main Auth Container */}
      <div className="auth-container">
        <div className="auth-card-modern">
          <div className="auth-card-header">
            <div className="auth-badge">
              <span className="badge-dot"></span>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </div>
            <h1 className="auth-title">
              {isLogin ? 'Sign In' : 'Get Started'}
            </h1>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Sign in to continue building your career' 
                : 'Join thousands of professionals landing dream jobs'
              }
            </p>
          </div>

          {/* Template Selection Info */}
          {location.state?.selectedTemplate && (
            <div className="template-info">
              <div className="template-icon">🎨</div>
              <div className="template-text">
                <p><strong>Selected Template: {location.state.selectedTemplate}</strong></p>
                <p>Complete signup to start building your resume!</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {success}
            </div>
          )}

          {/* Social Login (Login Only) */}
          {isLogin && (
            <>
              <div className="social-login">
                <button className="social-btn" type="button" disabled={loading}>
                  <span className="social-icon">🔍</span>
                  Continue with Google
                </button>
                <button className="social-btn" type="button" disabled={loading}>
                  <span className="social-icon">💼</span>
                  Continue with LinkedIn
                </button>
              </div>

              <div className="divider">
                <span>or continue with email</span>
              </div>
            </>
          )}

          {/* Auth Form */}
          <form className="auth-form" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="input-icon">👤</span>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="input-icon">📧</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  minLength={6}
                />
                <span className="input-icon">🔒</span>
              </div>
              <div className="password-hint">Must be at least 6 characters</div>
            </div>

            {/* Remember Me & Forgot Password (Login Only) */}
            {isLogin && (
              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input type="checkbox" className="checkbox-input" />
                  <span className="checkbox-label">Remember me</span>
                </label>
                <button 
                  type="button" 
                  className="forgot-password"
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`auth-submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading && <span className="submit-spinner"></span>}
              <span className="btn-shine"></span>
              {loading 
                ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                : (isLogin ? 'Sign In' : 'Create Account')
              }
            </button>
          </form>

          {/* Auth Footer */}
          <div className="auth-footer">
            <p className="auth-footer-text">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="auth-toggle-btn"
                onClick={() => !loading && setIsLogin(!isLogin)}
                disabled={loading}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Demo Notes */}
          <div className="demo-notes">
            <p>💡 <strong>Demo Tip:</strong> Use any email & password (6+ characters) to test the app</p>
          </div>
        </div>

        {/* Feature Highlights (Login Only) */}
        {isLogin && (
          <div className="login-features">
            <div className="feature-highlight">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Builder</h3>
              <p>Smart suggestions and professional phrasing tailored to your industry</p>
            </div>
            <div className="feature-highlight">
              <div className="feature-icon">🎨</div>
              <h3>Modern Templates</h3>
              <p>Professionally designed templates that pass ATS and impress recruiters</p>
            </div>
            <div className="feature-highlight">
              <div className="feature-icon">⚡</div>
              <h3>Instant Optimization</h3>
              <p>Real-time feedback and optimization tips as you build your resume</p>
            </div>
          </div>
        )}
      </div>

      {/* Embedded CSS */}
      <style jsx>{`
        :root {
          --primary-blue: #2563eb;
          --blue-gradient: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
          --blue-glow: 0 0 50px rgba(37, 99, 235, 0.15);
          --text-primary: #0f172a;
          --text-secondary: #475569;
          --text-muted: #64748b;
          --bg-primary: #ffffff;
          --bg-secondary: #f8fafc;
          --bg-gradient: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
          --shadow-soft: 0 4px 24px rgba(0, 0, 0, 0.06);
          --shadow-medium: 0 8px 40px rgba(0, 0, 0, 0.12);
          --shadow-large: 0 20px 60px rgba(0, 0, 0, 0.15);
          --border-light: rgba(255, 255, 255, 0.2);
          --border-soft: rgba(226, 232, 240, 0.8);
          --error-color: #ef4444;
          --error-bg: #fef2f2;
          --success-color: #10b981;
          --success-bg: #f0fdf4;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .auth-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
          background: var(--bg-gradient);
          color: var(--text-primary);
        }

        /* Animated Background */
        .auth-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          background: var(--blue-gradient);
          opacity: 0.03;
          animation: float 8s ease-in-out infinite;
        }

        .orb-1 {
          width: 400px;
          height: 400px;
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 300px;
          height: 300px;
          bottom: -50px;
          right: -50px;
          animation-delay: 2s;
        }

        .orb-3 {
          width: 200px;
          height: 200px;
          top: 50%;
          left: 60%;
          animation-delay: 4s;
        }

        .floating-shape {
          position: absolute;
          border-radius: 20px;
          background: var(--blue-gradient);
          opacity: 0.02;
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 150px;
          height: 150px;
          top: 20%;
          right: 10%;
          animation-delay: 1s;
        }

        .shape-2 {
          width: 100px;
          height: 100px;
          bottom: 30%;
          left: 10%;
          animation-delay: 3s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        /* Header */
        .auth-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          padding: 1.5rem 3rem;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border-soft);
          z-index: 100;
        }

        .logo-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .logo-box:hover {
          transform: translateX(-5px);
        }

        .logo-icon-wrapper {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-orb {
          position: absolute;
          width: 100%;
          height: 100%;
          background: var(--blue-gradient);
          border-radius: 12px;
          animation: orbGlow 3s ease-in-out infinite;
        }

        @keyframes orbGlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .logo-text {
          position: relative;
          color: white;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .site-title {
          font-size: 1.5rem;
          font-weight: 800;
          background: var(--blue-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Main Auth Container */
        .auth-container {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 4rem;
          align-items: center;
          min-height: 100vh;
          padding: 8rem 3rem 3rem 3rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Modern Auth Card */
        .auth-card-modern {
          background: white;
          border-radius: 24px;
          padding: 3rem;
          box-shadow: var(--shadow-large);
          border: 1px solid var(--border-soft);
          backdrop-filter: blur(20px);
          animation: slideInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          max-width: 440px;
          width: 100%;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-card-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(37, 99, 235, 0.1);
          color: var(--primary-blue);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: var(--primary-blue);
          border-radius: 50%;
          animation: blink 2s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0.3; }
        }

        .auth-title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          background: var(--blue-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.5;
        }

        /* Template Info */
        .template-info {
          background: rgba(37, 99, 235, 0.05);
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .template-icon {
          font-size: 1.5rem;
        }

        .template-text {
          flex: 1;
        }

        .template-text p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }

        .template-text p:first-child {
          color: var(--primary-blue);
          font-weight: 600;
        }

        .template-text p:last-child {
          color: var(--text-secondary);
        }

        /* Messages */
        .error-message {
          background: var(--error-bg);
          color: var(--error-color);
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .success-message {
          background: var(--success-bg);
          color: var(--success-color);
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .error-icon, .success-icon {
          font-size: 1.1rem;
        }

        /* Social Login */
        .social-login {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1.5rem;
          border: 1px solid var(--border-soft);
          border-radius: 12px;
          background: white;
          color: var(--text-primary);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .social-btn:hover:not(:disabled) {
          border-color: var(--primary-blue);
          transform: translateY(-1px);
          box-shadow: var(--shadow-soft);
        }

        .social-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .social-icon {
          font-size: 1.1rem;
        }

        /* Divider */
        .divider {
          position: relative;
          text-align: center;
          margin: 2rem 0;
          color: var(--text-muted);
          font-size: 0.9rem;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: var(--border-soft);
        }

        .divider span {
          background: white;
          padding: 0 1rem;
          position: relative;
        }

        /* Form Styles */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .input-wrapper {
          position: relative;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 1px solid var(--border-soft);
          border-radius: 12px;
          font-size: 1rem;
          background: var(--bg-secondary);
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary-blue);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          background: white;
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          font-size: 1.1rem;
        }

        .password-hint {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.25rem;
        }

        /* Form Options */
        .form-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0.5rem 0;
        }

        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          border: 1px solid var(--border-soft);
          cursor: pointer;
        }

        .checkbox-label {
          font-size: 0.9rem;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .forgot-password {
          background: none;
          border: none;
          color: var(--primary-blue);
          font-size: 0.9rem;
          cursor: pointer;
          text-decoration: underline;
          font-family: inherit;
        }

        .forgot-password:hover:not(:disabled) {
          color: #1e40af;
        }

        .forgot-password:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Submit Button */
        .auth-submit-btn {
          position: relative;
          background: var(--blue-gradient);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1rem;
          overflow: hidden;
          font-family: inherit;
        }

        .auth-submit-btn:hover:not(.loading):not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--blue-glow);
        }

        .auth-submit-btn.loading, .auth-submit-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
          transform: none !important;
        }

        .submit-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.5s ease;
        }

        .auth-submit-btn:hover .btn-shine {
          left: 100%;
        }

        /* Auth Footer */
        .auth-footer {
          text-align: center;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-soft);
        }

        .auth-footer-text {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .auth-toggle-btn {
          background: none;
          border: none;
          color: var(--primary-blue);
          font-weight: 600;
          cursor: pointer;
          margin-left: 0.5rem;
          text-decoration: underline;
          font-family: inherit;
        }

        .auth-toggle-btn:hover:not(:disabled) {
          color: #1e40af;
        }

        .auth-toggle-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Demo Notes */
        .demo-notes {
          background: rgba(37, 99, 235, 0.05);
          border-radius: 12px;
          padding: 1rem;
          margin-top: 1.5rem;
          text-align: center;
        }

        .demo-notes p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin: 0;
        }

        /* Feature Highlights */
        .login-features {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 400px;
        }

        .feature-highlight {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 20px;
          box-shadow: var(--shadow-soft);
          border: 1px solid var(--border-soft);
          transition: all 0.3s ease;
        }

        .feature-highlight:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-medium);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-highlight h3 {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
        }

        .feature-highlight p {
          color: var(--text-secondary);
          line-height: 1.5;
          font-size: 0.9rem;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .auth-container {
            grid-template-columns: 1fr;
            justify-items: center;
            gap: 3rem;
          }
          
          .login-features {
            max-width: 440px;
            flex-direction: row;
            flex-wrap: wrap;
          }
          
          .feature-highlight {
            flex: 1;
            min-width: 200px;
          }
        }

        @media (max-width: 768px) {
          .auth-header {
            padding: 1rem 1.5rem;
          }
          
          .auth-container {
            padding: 6rem 1.5rem 2rem 1.5rem;
          }
          
          .auth-card-modern {
            padding: 2rem;
          }
          
          .auth-title {
            font-size: 1.75rem;
          }
          
          .social-login {
            flex-direction: column;
          }
          
          .form-options {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }
        }

        @media (max-width: 480px) {
          .auth-card-modern {
            padding: 1.5rem;
          }
          
          .auth-title {
            font-size: 1.5rem;
          }
          
          .feature-highlight {
            min-width: 100%;
          }
          
          .login-features {
            flex-direction: column;
          }
        }

        /* Focus States for Accessibility */
        .form-input:focus,
        .social-btn:focus,
        .auth-submit-btn:focus,
        .auth-toggle-btn:focus,
        .forgot-password:focus {
          outline: 2px solid var(--primary-blue);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
