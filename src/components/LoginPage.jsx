import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Added Link import
import { createClient } from '@supabase/supabase-js';
import './LoginPage.css';

// ✅ Initialize Supabase client directly in frontend
const supabase = createClient(
  'https://lpgdolynzbgisbqbfwrf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZ2RvbHluemJnaXNicWJmd3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzkzOTAsImV4cCI6MjA3NzgxNTM5MH0.usuPeETruTUTvUDmH18O87qPgHg1xVHfufMqdRHdvBM'
);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Add validation before API call
    if (!email.trim() || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // ✅ DIRECT Supabase login - NO backend API calls!
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      if (!data.user || !data.session) {
        setError('Login failed - no user data returned');
        setLoading(false);
        return;
      }

      // ✅ Get user profile from users table with error handling
      let userProfile = null;
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (!profileError) {
          userProfile = profileData;
        } else {
          console.warn('Could not fetch user profile:', profileError.message);
          // Continue without profile data
        }
      } catch (profileErr) {
        console.warn('Profile fetch failed:', profileErr);
      }

      // ✅ Save to localStorage
      localStorage.setItem('token', data.session.access_token);
      localStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        name: userProfile?.name || data.user.user_metadata?.name || email.split('@')[0]
      }));
      localStorage.setItem('loggedInEmail', email.trim().toLowerCase());

      console.log('✅ Login successful:', {
        userId: data.user.id,
        email: data.user.email
      });

      // ✅ Navigate to dashboard
      navigate('/dashboard');
      
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fixed navigation handlers
  const goToHome = () => {
    navigate('/');
  };

  const goToSignup = () => {
    navigate('/signup');
  };

  // ✅ UPDATED: Navigate to forgot password page
  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="login-page">
      {/* Animated Background */}
      <div className="login-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="login-header">
        <div className="logo-box" onClick={goToHome}>
          <div className="logo-icon-wrapper">
            <div className="logo-orb"></div>
            <span className="logo-text">IR</span>
          </div>
          <span className="site-title">InsightResume</span>
        </div>
      </header>

      {/* Main Login Container */}
      <div className="login-container">
        {/* Login Card */}
        <div className="login-card-modern">
          {/* Card Header */}
          <div className="login-card-header">
            <div className="login-badge">
              <span className="badge-dot"></span>
              Welcome Back
            </div>
            <h1 className="login-title">
              Sign In to Your Account
            </h1>
            <p className="login-subtitle">
              Enter your credentials to access your resume dashboard
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="login-form" onSubmit={handleSubmit}>
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

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  minLength="6"
                />
                <span className="input-icon">🔒</span>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-wrapper">
                <input type="checkbox" className="checkbox-input" />
                <span className="checkbox-label">Remember me</span>
              </label>
              <button 
                type="button" 
                className="forgot-password"
                onClick={handleForgotPassword} // ✅ Now navigates to forgot password page
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            <button 
              type="submit" 
              className={`login-submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="submit-spinner"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <span className="btn-sparkle">✨</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Login Footer */}
          <div className="login-footer">
            <span className="login-footer-text">
              Don't have an account?
            </span>
            <button 
              type="button" 
              className="login-toggle-btn"
              onClick={goToSignup}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
