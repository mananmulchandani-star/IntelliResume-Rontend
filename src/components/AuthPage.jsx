import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createClient } from '@supabase/supabase-js';
import './AuthPage.css';

const supabase = createClient(
  'https://lpgdolynzbgisbqbfwrf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZ2RvbHluemJnaXNicWJmd3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzkzOTAsImV4cCI6MjA3NzgxNTM5MH0.usuPeETruTUTvUDmH18O87qPgHg1xVHfufMqdRHdvBM'
);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // ✅ LOGIN: Direct Supabase login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          setError(error.message);
        } else {
          // ✅ Get or create user profile
          let userProfile = await getUserProfile(data.user.id);
          
          if (!userProfile) {
            // If no profile exists, create one
            userProfile = await createUserProfile(data.user.id, data.user.email);
          }

          localStorage.setItem('token', data.session.access_token);
          localStorage.setItem('user', JSON.stringify(userProfile));
          
          login(userProfile, data.session.access_token);
          navigate('/app');
        }
      } else {
        // ✅ SIGNUP: Direct Supabase signup
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          setError(error.message);
        } else {
          // ✅ Create user profile in users table
          await createUserProfile(data.user.id, formData.email, formData.name);
          
          // Auto-login after successful signup
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });

          if (loginError) {
            setError('Account created but login failed. Please try logging in.');
          } else {
            const userProfile = {
              id: loginData.user.id,
              email: loginData.user.email,
              name: formData.name
            };

            localStorage.setItem('token', loginData.session.access_token);
            localStorage.setItem('user', JSON.stringify(userProfile));
            
            login(userProfile, loginData.session.access_token);
            navigate('/app');
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get user profile from users table
  const getUserProfile = async (userId) => {
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
  };

  // ✅ Create user profile in users table
  const createUserProfile = async (userId, email, name = '') => {
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
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            className="toggle-link" 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;