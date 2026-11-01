// src/app/providers/AuthProvider.jsx
// Enterprise Role-Based Authentication Provider via Supabase
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../services/supabase';
import { ROLES, ROLE_DEFAULT_ROUTES } from '../../constants/roles';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real user profile and assigned role from Supabase
  const fetchUserProfile = useCallback(async (supabaseUser) => {
    if (!supabaseUser) {
      setUser(null);
      setRole(null);
      return;
    }

    try {
      // 1. Try to fetch profile from users table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      const userRole = profile?.role || supabaseUser.user_metadata?.role || ROLES.STUDENT;

      const userData = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: profile?.name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || '',
        organization: profile?.organization || supabaseUser.user_metadata?.organization || '',
        department: profile?.department || supabaseUser.user_metadata?.department || '',
        role: userRole,
        ...profile,
      };

      setUser(userData);
      setRole(userRole);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userRole);
      return userRole;
    } catch {
      // 2. Fallback to Supabase auth metadata
      const userRole = supabaseUser.user_metadata?.role || ROLES.STUDENT;
      const userData = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        avatar: supabaseUser.user_metadata?.avatar_url || '',
        organization: supabaseUser.user_metadata?.organization || '',
        department: supabaseUser.user_metadata?.department || '',
        role: userRole,
      };

      setUser(userData);
      setRole(userRole);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userRole);
      return userRole;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted && session?.user) {
          await fetchUserProfile(session.user);
        } else if (mounted) {
          // Check saved session in localStorage for offline resilience
          const savedUser = localStorage.getItem('user');
          const savedRole = localStorage.getItem('userRole');
          if (savedUser && savedRole) {
            try {
              setUser(JSON.parse(savedUser));
              setRole(savedRole);
            } catch {
              setUser(null);
              setRole(null);
            }
          } else {
            setUser(null);
            setRole(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setUser(null);
          setRole(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Listen for real Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRole(null);
          localStorage.removeItem('user');
          localStorage.removeItem('userRole');
          localStorage.removeItem('token');
          localStorage.removeItem('loggedInEmail');
        } else if (event === 'TOKEN_REFRESHED' && session) {
          localStorage.setItem('token', session.access_token);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (data.session) {
        localStorage.setItem('token', data.session.access_token);
      }

      const userRole = await fetchUserProfile(data.user);
      return { ...data, role: userRole };
    } catch (err) {
      const message = err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  }, [fetchUserProfile]);

  const signUp = useCallback(async (email, password, metadata = {}) => {
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (authError) throw authError;

      // Upsert profile in users table
      if (data.user) {
        await supabase.from('users').upsert([{
          id: data.user.id,
          email: data.user.email,
          name: metadata.name || metadata.full_name || '',
          role: metadata.role || ROLES.STUDENT,
          organization: metadata.organization || '',
          department: metadata.department || '',
          created_at: new Date().toISOString(),
        }]);
      }

      return data;
    } catch (err) {
      const message = err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) throw authError;
    } catch (err) {
      const message = err.message || 'Google authentication failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    setError(null);
    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      });

      if (authError) throw authError;
    } catch (err) {
      const message = err.message || 'Password reset failed';
      setError(message);
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    setRole(null);
    setError(null);
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInEmail');
      localStorage.removeItem('insight_demo_persona');
    } catch {
      // ignore
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const getDefaultRoute = useCallback(() => {
    return ROLE_DEFAULT_ROUTES[role] || '/student';
  }, [role]);

  const value = useMemo(() => ({
    user,
    role,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    signUp,
    loginWithGoogle,
    resetPassword,
    logout,
    clearError,
    getDefaultRoute,
  }), [user, role, loading, error, login, signUp, loginWithGoogle, resetPassword, logout, clearError, getDefaultRoute]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
