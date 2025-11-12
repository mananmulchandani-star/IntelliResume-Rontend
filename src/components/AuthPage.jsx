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

  // ✅ ALL HOOKS AT TOP LEVEL
  const { login, signUp, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Check if we're coming from template selection
  useEffect(() => {
    if (location.state?.selectedTemplate) {
      // If template was selected, show signup form by default
      setIsLogin(false);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // ✅ LOGIN
        const result = await login(formData.email, formData.password);
        
        if (!result || !result.user || !result.user.id) {
          throw new Error('Login failed: No user data received');
        }

        let userProfile = await getUserProfile(result.user.id);
        
        if (!userProfile) {
          userProfile = await createUserProfile(result.user.id, result.user.email);
        }

        if (result.session && result.session.access_token) {
          localStorage.setItem('token', result.session.access_token);
          localStorage.setItem('user', JSON.stringify(userProfile));
          navigate('/dashboard');
        } else {
          throw new Error('Login successful but no session token received');
        }
      } else {
        // ✅ SIGNUP
        const result = await signUp(formData.email, formData.password);
        
        if (result && result.user) {
          await createUserProfile(result.user.id, formData.email, formData.name);
          
          // If template was selected, pass it to the next page
          const templateData = location.state?.selectedTemplate;
          
          setError('Check your email for confirmation link! You can login after confirming your email.');
          setIsLogin(true);
          setFormData(prev => ({ ...prev, password: '' }));
          
          // Optional: You can navigate directly to editor with template data
          // if you want to skip email confirmation for demo
          // navigate('/editor', { state: { template: templateData } });
        } else {
          throw new Error('Signup failed: No user data received');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred. Please try again.');
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
    try {
      await resetPassword(formData.email);
      setError('Password reset email sent! Check your inbox.');
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
  };

  // ✅ Quick navigation to signup (for when user clicks "Get Started")
  const handleQuickSignup = () => {
    setIsLogin(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        {/* Show template selection info if coming from homepage */}
        {location.state?.selectedTemplate && (
          <div className="template-info">
            <p>🎨 Selected Template: <strong>{location.state.selectedTemplate}</strong></p>
            <p>Complete signup to start building your resume!</p>
          </div>
        )}
        
        <h2>{isLogin ? 'Welcome Back' : 'Create Your Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Sign in to your account' : 'Join thousands of professionals'}
        </p>
        
        {error && (
          <div className={`message ${error.includes('Check your email') || error.includes('sent') ? 'success-message' : 'error-message'}`}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`auth-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
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

        {/* Demo quick action */}
        <div className="demo-notes">
          <p>💡 <strong>Demo Tip:</strong> Use any email & password (6+ chars) to test</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
