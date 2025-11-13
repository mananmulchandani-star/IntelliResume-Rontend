import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabase';
import './AuthPage.css';

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

  // ✅ ALL HOOKS AT TOP LEVEL
  const { login, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      console.log('✅ User already logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // ✅ Check if we're coming from template selection
  useEffect(() => {
    if (location.state?.selectedTemplate) {
      // If template was selected, show signup form by default
      setIsLogin(false);
    }
  }, [location.state]);

  // ✅ Form validation
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

    // Basic email validation
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

    // ✅ Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // ✅ LOGIN
        console.log('🔄 Attempting login...');
        const result = await login(formData.email, formData.password);
        
        if (!result || !result.user || !result.user.id) {
          throw new Error('Login failed: No user data received');
        }

        // ✅ Get or create user profile
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
          
          // ✅ Delay redirect to show success message
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          throw new Error('Login successful but no session token received');
        }
      } else {
        // ✅ SIGNUP
        console.log('🔄 Attempting signup...');
        const result = await signUp(formData.email, formData.password);
        
        if (result && result.user) {
          // ✅ Create user profile
          await createUserProfile(result.user.id, formData.email, formData.name);
          
          // If template was selected, pass it to the next page
          const templateData = location.state?.selectedTemplate;
          
          setSuccess('Account created successfully! Please check your email for confirmation link.');
          setError('');
          
          // ✅ Auto-switch to login form after successful signup
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

  // ✅ Get user profile from users table
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
    } catch (error) {
      console.error('Error creating user profile:', error);
      return {
        id: userId,
        email: email,
        name: name || email.split('@')[0]
      };
    }
  };

  // ✅ Forgot password handler
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
    // Clear messages when user starts typing
    setError('');
    setSuccess('');
  };

  // ✅ Navigate back to home
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        {/* Back to Home Button */}
        <button 
          className="back-home-btn"
          onClick={handleBackToHome}
          disabled={loading}
        >
          ← Back to Home
        </button>

        {/* Show template selection info if coming from homepage */}
        {location.state?.selectedTemplate && (
          <div className="template-info">
            <div className="template-icon">🎨</div>
            <div className="template-text">
              <p><strong>Selected Template: {location.state.selectedTemplate}</strong></p>
              <p>Complete signup to start building your resume!</p>
            </div>
          </div>
        )}
        
        <h2>{isLogin ? 'Welcome Back' : 'Create Your Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to your account' : 'Join thousands of professionals'}
        </p>
        
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
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
            />
            <div className="password-hint">Must be at least 6 characters</div>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`auth-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {isLogin ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="toggle-link" 
              onClick={() => !loading && setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>

        {isLogin && (
          <div className="forgot-password">
            <span 
              className="toggle-link"
              onClick={() => !loading && handleForgotPassword()}
            >
              Forgot your password?
            </span>
          </div>
        )}

        {/* Demo notes */}
        <div className="demo-notes">
          <p>💡 <strong>Demo Tip:</strong> Use any email & password (6+ characters) to test the app</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
