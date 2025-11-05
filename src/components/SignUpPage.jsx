import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import "./SignupPage.css";

// ✅ Initialize Supabase client directly in frontend
const supabase = createClient(
  'https://lpgdolynzbgisbqbfwrf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZ2RvbHluemJnaXNicWJmd3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzkzOTAsImV4cCI6MjA3NzgxNTM5MH0.usuPeETruTUTvUDmH18O87qPgHg1xVHfufMqdRHdvBM'
);

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ DIRECT Supabase signup - NO CORS issues!
      const { data, error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase()
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        // ✅ Save user data to localStorage
        localStorage.setItem('user', JSON.stringify({
          id: data.user?.id,
          name: form.name.trim(),
          email: form.email.trim().toLowerCase()
        }));
        localStorage.setItem('loggedInEmail', form.email.trim().toLowerCase());
        
        console.log('✅ Signup successful:', data);
        
        // Navigate to dashboard
        navigate("/Dashboard");
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      {/* Animated Background */}
      <div className="signup-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      {/* Header */}
      <header className="signup-header">
        <div className="logo-box" onClick={() => navigate('/')}>
          <div className="logo-icon-wrapper">
            <div className="logo-orb"></div>
            <span className="logo-text">IR</span>
          </div>
          <span className="site-title">InsightResume</span>
        </div>
      </header>

      {/* Main Signup Container */}
      <div className="signup-container">
        {/* Signup Card */}
        <div className="signup-card-modern">
          {/* Card Header */}
          <div className="signup-card-header">
            <div className="signup-badge">
              <span className="badge-dot"></span>
              Join Us Today
            </div>
            <h1 className="signup-title">
              Create Your Account
            </h1>
            <p className="signup-subtitle">
              Start building your professional resume in minutes
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <span className="input-icon"></span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <span className="input-icon"></span>
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
                  value={form.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <span className="input-icon"></span>
              </div>
            </div>

            <button 
              type="submit" 
              className={`signup-submit-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="submit-spinner"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span className="btn-sparkle"></span>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Signup Footer */}
          <div className="signup-footer">
            <span className="signup-footer-text">
              Already have an account?
            </span>
            <button 
              type="button" 
              className="signup-toggle-btn"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;