import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // ✅ LOGIN: Use AuthContext login with SAFE data access
        const result = await login(formData.email, formData.password);
        
        // ✅ SAFE: Check if result and user exist
        if (!result || !result.user || !result.user.id) {
          throw new Error('Login failed: No user data received');
        }

        // ✅ SAFE: Get user profile with error handling
        let userProfile = await getUserProfile(result.user.id);
        
        if (!userProfile) {
          // If no profile exists, create one
          userProfile = await createUserProfile(result.user.id, result.user.email);
        }

        // ✅ SAFE: Check if session exists
        if (result.session && result.session.access_token) {
          localStorage.setItem('token', result.session.access_token);
          localStorage.setItem('user', JSON.stringify(userProfile));
          navigate('/dashboard');
        } else {
          throw new Error('Login successful but no session token received');
        }
      } else {
        // ✅ SIGNUP: Use AuthContext signUp with SAFE data access
        const result = await signUp(formData.email, formData.password);
        
        // ✅ SAFE: Check if user exists in result
        if (result && result.user) {
          // ✅ Create user profile in users table
          await createUserProfile(result.user.id, formData.email, formData.name);
          
          // Show success message for email confirmation
          setError('Check your email for confirmation link! You can login after confirming your email.');
          setIsLogin(true); // Switch to login form
          setFormData(prev => ({ ...prev, password: '' })); // Clear password
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
            name: name || email.split('@')[0], // Use email prefix if no name
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

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        {error && (
          <div className={`message ${error.includes('Check your email') ? 'success-message' : 'error-message'}`}>
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
              placeholder="Email"
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
              isLogin ? 'Login' : 'Sign Up'
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
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>

        {/* Forgot password link */}
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
      </div>
    </div>
  );
};

export default AuthPage;
