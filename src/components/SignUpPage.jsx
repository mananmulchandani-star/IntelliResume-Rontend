import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './AuthContext'; // ✅ ADD THIS IMPORT
import "./SignupPage.css";

// ✅ Initialize Supabase client directly in frontend
const supabase = createClient(
  'https://lpgdolynzbgisbqbfwrf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZ2RvbHluemJnaXNicWJmd3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzkzOTAsImV4cCI6MjA3NzgxNTM5MH0.usuPeETruTUTvUDmH18O87qPgHg1xVHfufMqdRHdvBM'
);

function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth(); // ✅ USE THE AUTH CONTEXT
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // ✅ Create user profile in users table
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
        // Return basic profile even if DB insert fails
        return {
          id: userId,
          email: email,
          name: name || email.split('@')[0]
        };
      }
      
      return data;
    } catch (err) {
      console.error('Error in createUserProfile:', err);
      return {
        id: userId,
        email: email,
        name: name || email.split('@')[0]
      };
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
    setSuccess(""); // Clear success message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validate form before submission
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // ✅ USE AUTH CONTEXT FOR SIGNUP (Recommended)
      const result = await signUp(form.email.trim().toLowerCase(), form.password);
      
      if (!result || !result.user) {
        setError("Signup failed - no user data returned");
        return;
      }

      // ✅ CREATE USER PROFILE in users table
      try {
        await createUserProfile(result.user.id, form.email.trim().toLowerCase(), form.name.trim());
        console.log('✅ User profile created successfully');
      } catch (profileError) {
        console.error('Profile creation failed:', profileError);
        // Continue even if profile creation fails
      }

      // ✅ Save user data to localStorage
      const userData = {
        id: result.user.id,
        name: form.name.trim(),
        email: form.email.trim().toLowerCase()
      };

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('loggedInEmail', form.email.trim().toLowerCase());
      
      console.log('✅ Signup successful, profile created:', userData);
      
      // ✅ Show success message and redirect
      setSuccess("Account created successfully! Redirecting to dashboard...");
      
      // ✅ Delay redirect to show success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
      
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Navigate to login
  const goToLogin = () => {
    navigate('/login');
  };

  const goToHome = () => {
    navigate('/');
  };

  const goToAuth = () => {
    navigate('/auth'); // Alternative navigation
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
        <div className="logo-box" onClick={goToHome}>
          <div className="logo-icon-wrapper">
            <div className="logo-orb"></div>
            <span className="logo-text">IR</span>
          </div>
          <span className="site-title">InsightResume</span>
        </div>
        
        {/* Quick Navigation */}
        <div className="header-actions">
          <button className="back-home-btn" onClick={goToHome}>
            ← Home
          </button>
          <button className="login-btn" onClick={goToLogin}>
            Sign In
          </button>
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

          {/* Success Message */}
          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              {success}
            </div>
          )}

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
                <span className="input-icon">👤</span>
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
                  placeholder="Enter your password (min. 6 characters)"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  disabled={loading}
                />
                <span className="input-icon">🔒</span>
              </div>
              <div className="password-hint">
                Must be at least 6 characters long
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
                  <span className="btn-sparkle">✨</span>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Demo Notes */}
          <div className="demo-notes">
            <p>💡 <strong>Demo Tip:</strong> Use any email & password to test</p>
          </div>

          {/* Signup Footer */}
          <div className="signup-footer">
            <span className="signup-footer-text">
              Already have an account?
            </span>
            <button 
              type="button" 
              className="signup-toggle-btn"
              onClick={goToLogin}
              disabled={loading}
            >
              Sign In
            </button>
          </div>

          {/* Alternative Navigation */}
          <div className="alternative-nav">
            <button 
              className="alt-nav-btn"
              onClick={goToAuth}
              disabled={loading}
            >
              Or use combined Login/Signup page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
