// AuthContext.jsx - DEBUG VERSION
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from '../services/supabase';

console.log('🔄 AuthContext.jsx is loading...'); // Debug log

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  console.log('🔄 AuthProvider is rendering...'); // Debug log
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 AuthProvider useEffect running...'); // Debug log
    
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Getting initial session...'); // Debug log
        const { data: { session } } = await supabase.auth.getSession();
        
        if (isMounted) {
          console.log('🔄 Session loaded:', session?.user?.email); // Debug log
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('🔄 Auth state changed:', session?.user?.email); // Debug log
      if (isMounted) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      console.log('🔄 AuthProvider cleanup...'); // Debug log
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ... rest of your functions (login, signUp, etc.) ...

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

  console.log('🔄 AuthProvider rendering children, context value:', value); // Debug log

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  console.log('🔄 useAuth hook called...'); // Debug log
  
  const context = useContext(AuthContext);
  
  console.log('🔄 useAuth context value:', context); // Debug log
  
  if (context === undefined) {
    console.error('❌ useAuth error: Context is undefined!'); // Debug log
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  console.log('🔄 useAuth returning context successfully'); // Debug log
  return context;
}
