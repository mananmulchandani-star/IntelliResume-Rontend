// AuthContext.jsx - COMPLETELY FIXED VERSION
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from '../services/supabase';

console.log('🔄 AuthContext.jsx is loading...');

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  console.log('🔄 AuthProvider is rendering...');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔄 AuthProvider useEffect running...');
    
    let isMounted = true;
    let subscription;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Getting initial session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          if (isMounted) {
            setError(sessionError.message);
            setLoading(false);
          }
          return;
        }
        
        if (isMounted) {
          console.log('🔄 Session loaded:', session?.user?.email);
          setUser(session?.user ?? null);
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        console.error('Error in initializeAuth:', error);
        if (isMounted) {
          setError(error.message);
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // ✅ SAFE SUBSCRIPTION SETUP
    try {
      const { data: authListener, error: listenerError } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('🔄 Auth state changed:', session?.user?.email);
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
          setError(null);
        }
      });

      if (listenerError) {
        console.error('Error setting up auth listener:', listenerError);
        if (isMounted) {
          setError(listenerError.message);
          setLoading(false);
        }
      } else {
        subscription = authListener?.subscription;
      }
    } catch (error) {
      console.error('Error in auth listener setup:', error);
      if (isMounted) {
        setError(error.message);
        setLoading(false);
      }
    }

    return () => {
      console.log('🔄 AuthProvider cleanup...');
      isMounted = false;
      
      // ✅ SAFE UNSUBSCRIBE
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error('Error unsubscribing auth listener:', error);
        }
      }
    };
  }, []);

  const value = {
    user,
    loading,
    error,
    login: async (email, password) => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        
        if (loginError) {
          throw new Error(loginError.message);
        }
        
        // ✅ SAFE: Check if data exists before accessing properties
        if (data && data.user) {
          setUser(data.user);
        } else {
          console.warn('Login successful but no user data received');
        }
        
        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    signUp: async (email, password) => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: signupError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
        });
        
        if (signupError) {
          throw new Error(signupError.message);
        }
        
        // ✅ Don't set user here - wait for email confirmation
        console.log('Signup successful, waiting for email confirmation');
        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    resetPassword: async (email) => {
      try {
        setLoading(true);
        setError(null);
        const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`,
        });
        
        if (resetError) {
          throw new Error(resetError.message);
        }
        
        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    logout: async () => {
      try {
        setLoading(true);
        setError(null);
        const { error: logoutError } = await supabase.auth.signOut();
        
        if (logoutError) {
          throw new Error(logoutError.message);
        }
        
        setUser(null);
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    clearError: () => setError(null)
  };

  console.log('🔄 AuthProvider rendering children, context value:', { 
    user: value.user?.email, 
    loading: value.loading,
    hasError: !!value.error
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  console.log('🔄 useAuth hook called...');
  
  const context = useContext(AuthContext);
  
  console.log('🔄 useAuth context value:', context ? 'Context available' : 'Context undefined');
  
  if (context === undefined) {
    console.error('❌ useAuth error: Context is undefined!');
    console.trace('Stack trace for context error');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  console.log('🔄 useAuth returning context successfully');
  return context;
}
