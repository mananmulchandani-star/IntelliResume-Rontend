import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";

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

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let users = JSON.parse(localStorage.getItem("users") || "[]");
      const signupEmail = form.email.trim().toLowerCase();

      if (users.some(u => u.email === signupEmail)) {
        setError("Email already registered. Please sign in.");
        setLoading(false);
        return;
      }
      
      users.push({
        name: form.name.trim(),
        email: signupEmail,
        password: form.password
      });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("resume_user", JSON.stringify({
        name: form.name.trim(),
        email: signupEmail
      }));
      localStorage.setItem("loggedInEmail", signupEmail);
      setLoading(false);
      navigate("/Dashboard");
    }, 1000);
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