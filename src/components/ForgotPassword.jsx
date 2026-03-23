import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setMessage('');
      
      await resetPassword(email);
      setMessage('Check your email for password reset instructions!');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      {/* Animated Background */}
      <div className="forgot-password-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
      </div>

      {/* Header */}
      <header className="forgot-password-header">
        <div className="logo-box" onClick={() => window.location.href = '/'}>
          <div className="logo-icon-wrapper">
            <div className="logo-orb"></div>
            <span className="logo-text">IR</span>
          </div>
          <span className="site-title">InsightResume</span>
        </div>
      </header>

      {/* Main Container */}
      <div className="forgot-password-container">
        <div className="forgot-password-card-modern">
          {/* Card Header */}
          <div className="forgot-password-card-header">
            <div className="forgot-password-badge">
              <span className="badge-dot"></span>
              Reset Password
            </div>
            <h1 className="forgot-password-title">
              Reset Your Password
            </h1>
            <p className="forgot-password-subtitle">
              Enter your email and we'll send you a password reset link
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className="success-message">
              <span className="error-icon">✅</span>
              {message}
            </div>
          )}
          
          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form className="forgot-password-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
                <span className="input-icon">📧</span>
              </div>
            </div>

            <button 
              type="submit" 
              className={`forgot-password-submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="submit-spinner"></div>
                  Sending Reset Link...
                </>
              ) : (
                <>
                  <span className="btn-sparkle">✨</span>
                  Send Reset Link
                  <span className="btn-shine"></span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="forgot-password-footer">
            <span className="forgot-password-footer-text">
              Remember your password?
            </span>
            <Link to="/login" className="forgot-password-toggle-btn">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
