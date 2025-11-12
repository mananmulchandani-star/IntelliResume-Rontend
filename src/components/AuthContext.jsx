// AuthContext.jsx - FIXED VERSION
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from '../services/supabase';

console.log('🔄 AuthContext.jsx is loading...');

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  console.log('🔄 AuthProvider is rendering...');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider useEffect running...');
    
    let isMounted = true;
    let subscription;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Getting initial session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (isMounted) {
          console.log('🔄 Session loaded:', session?.user?.email);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // ✅ SAFE SUBSCRIPTION SETUP
    try {
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log('🔄 Auth state changed:', session?.user?.email);
        if (isMounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

      subscription = authListener?.subscription;
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      if (isMounted) {
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
    login: async (email, password) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      setUser(data.user);
      return data;
    },
    signUp: async (email, password) => {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw new Error(error.message);
      return data;
    },
    resetPassword: async (email) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      if (error) throw new Error(error.message);
      return data;
    },
    logout: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      setUser(null);
    }
  };

  console.log('🔄 AuthProvider rendering children, context value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  console.log('🔄 useAuth hook called...');
  
  const context = useContext(AuthContext);
  
  console.log('🔄 useAuth context value:', context);
  
  if (context === undefined) {
    console.error('❌ useAuth error: Context is undefined!');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  console.log('🔄 useAuth returning context successfully');
  return context;
}
