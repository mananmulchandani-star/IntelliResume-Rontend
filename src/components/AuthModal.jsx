import React, { useState } from "react";
import { createClient } from '@supabase/supabase-js';

// ✅ Initialize Supabase client
const supabase = createClient(
  'https://lpgdolynzbgisbqbfwrf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwZ2RvbHluemJnaXNicWJmd3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzkzOTAsImV4cCI6MjA3NzgxNTM5MH0.usuPeETruTUTvUDmH18O87qPgHg1xVHfufMqdRHdvBM'
);

function AuthModal({ onClose, onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(""); // Clear error when user types
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
    } catch (err) {
      console.error('Error in createUserProfile:', err);
      return {
        id: userId,
        email: email,
        name: name || email.split('@')[0]
      };
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // ✅ Validation
    if (!formData.email.trim() || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (mode === "signup" && !formData.name.trim()) {
      setError("Please enter your full name");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      if (mode === "signup") {
        // ✅ Sign up logic
        const { data, error } = await supabase.auth.signUp({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          options: {
            data: {
              name: formData.name.trim(),
              email: formData.email.trim().toLowerCase()
            }
          }
        });

        if (error) {
          setError(error.message);
          return;
        }

        if (!data.user) {
          setError("Signup failed - no user data returned");
          return;
        }

        // ✅ Create user profile
        await createUserProfile(data.user.id, formData.email.trim().toLowerCase(), formData.name.trim());

        // ✅ Auto-login after signup
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });

        if (loginError) {
          console.log('Auto-login failed, but account created');
        }

        // ✅ Save user data
        const userData = {
          id: data.user?.id || loginData?.user?.id,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase()
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('loggedInEmail', formData.email.trim().toLowerCase());
        
        if (loginData?.session?.access_token) {
          localStorage.setItem('token', loginData.session.access_token);
        }

        console.log('✅ Signup successful');
        onAuthSuccess?.(userData);

      } else {
        // ✅ Login logic
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });

        if (error) {
          setError(error.message);
          return;
        }

        if (!data.user || !data.session) {
          setError("Login failed - no user data returned");
          return;
        }

        // ✅ Get user profile
        let userProfile = null;
        try {
          const { data: profileData } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
          userProfile = profileData;
        } catch (profileErr) {
          console.warn('Profile fetch failed:', profileErr);
        }

        // ✅ Save to localStorage
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          name: userProfile?.name || data.user.user_metadata?.name || formData.email.split('@')[0]
        }));
        localStorage.setItem('loggedInEmail', formData.email.trim().toLowerCase());

        console.log('✅ Login successful');
        onAuthSuccess?.({
          id: data.user.id,
          email: data.user.email,
          name: userProfile?.name || data.user.user_metadata?.name || formData.email.split('@')[0]
        });
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(`${mode === "signup" ? "Signup" : "Login"} failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Reset form when switching modes
  const switchMode = (newMode) => {
    setMode(newMode);
    setFormData({ name: "", email: "", password: "" });
    setError("");
  };

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(20,22,35,0.65)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "var(--card-bg, #1a1f33)",
        borderRadius: "2rem",
        padding: "3rem 2.5rem",
        width: "420px",
        maxWidth: "90vw",
        position: "relative",
        boxShadow: "0 8px 32px rgba(50,50,90,0.18)",
        zIndex: 1000,
        color: "var(--text-light, #f7f8fa)"
      }}>
        {/* Close Button */}
        <button 
          style={{ 
            background: "none", 
            border: "none", 
            position: "absolute", 
            right: 20, 
            top: 20, 
            fontSize: 24, 
            color: "#888", 
            cursor: "pointer",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "background 0.2s"
          }} 
          onClick={onClose}
          onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.1)"}
          onMouseLeave={(e) => e.target.style.background = "none"}
        >×</button>

        {/* Mode Toggle */}
        <div style={{ display: "flex", marginBottom: "2.2rem", gap: "8px" }}>
          <button 
            style={{
              flex: 1, 
              padding: "0.6rem 0", 
              borderRadius: "0.6rem",
              background: mode === "login" ? "var(--primary-accent, #3b82f6)" : "#23283b",
              color: mode === "login" ? "var(--text-light, #f7f8fa)" : "var(--text-dark, #888)",
              border: "none", 
              cursor: "pointer", 
              fontWeight: 600,
              transition: "all 0.2s"
            }} 
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button 
            style={{
              flex: 1, 
              padding: "0.6rem 0", 
              borderRadius: "0.6rem",
              background: mode !== "login" ? "var(--primary-accent, #3b82f6)" : "#23283b",
              color: mode !== "login" ? "var(--text-light, #f7f8fa)" : "var(--text-dark, #888)",
              border: "none", 
              cursor: "pointer", 
              fontWeight: 600,
              transition: "all 0.2s"
            }} 
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#ef4444",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            marginBottom: "1.5rem",
            fontSize: "0.9rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <input 
              style={inputStyle}
              name="name"
              placeholder="Full Name" 
              value={formData.name}
              onChange={handleInputChange}
              disabled={loading}
            />
          )}
          <input 
            style={inputStyle}
            name="email"
            type="email"
            placeholder="Email" 
            value={formData.email}
            onChange={handleInputChange}
            disabled={loading}
          />
          <input 
            style={inputStyle}
            name="password"
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={handleInputChange}
            disabled={loading}
            minLength="6"
          />
          
          <button 
            style={{
              ...submitStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <div style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid transparent",
                  borderTop: "2px solid currentColor",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}></div>
                {mode === "signup" ? "Creating Account..." : "Signing In..."}
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <span>✨</span>
                {mode === "signup" ? "Create Account" : "Sign In"}
              </div>
            )}
          </button>
        </form>

        {/* Back to Home */}
        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button 
            style={{
              background: "none", 
              border: "none",
              color: "var(--primary-accent, #3b82f6)", 
              fontSize: "0.9rem", 
              cursor: "pointer",
              textDecoration: "underline",
              opacity: 0.8
            }} 
            onClick={onClose}
            disabled={loading}
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* CSS for spinner animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%", 
  marginBottom: "1.3rem", 
  padding: "0.9rem", 
  fontSize: "1rem",
  borderRadius: "0.5rem", 
  border: "1.5px solid var(--border-subtle, #2d3748)", 
  background: "#1a1f33", 
  color: "#f7f8fa",
  boxSizing: "border-box"
};

const submitStyle = {
  width: "100%", 
  padding: "1rem 0", 
  fontSize: "1rem", 
  fontWeight: 600, 
  background: "var(--primary-accent, #3b82f6)",
  color: "#f7f8fa", 
  border: "none", 
  borderRadius: "0.7rem", 
  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)", 
  cursor: "pointer",
  transition: "all 0.2s"
};

export default AuthModal;
