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
        .maybeSingle();

      const userEmail = (supabaseUser.email || profile?.email || '').toLowerCase().trim();
      let userRole = profile?.role || supabaseUser.user_metadata?.role;

      // Platform admin override for the CEO
      if (userEmail === 'ceo@insight.in') {
        userRole = ROLES.PLATFORM_ADMIN;
      } else if (!userRole) {
        userRole = ROLES.STUDENT;
      }

      const userData = {
        id: supabaseUser.id,
        email: supabaseUser.email,
        name: profile?.name || supabaseUser.user_metadata?.full_name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
        avatar: profile?.avatar_url || supabaseUser.user_metadata?.avatar_url || '',
        organization: profile?.organization || supabaseUser.user_metadata?.organization || '',
        department: profile?.department || supabaseUser.user_metadata?.department || '',
        ...profile,
        role: userRole,
      };

      setUser(userData);
      setRole(userRole);

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', userRole);
      return userRole;
    } catch {
      // 2. Fallback to Supabase auth metadata
      const userEmail = (supabaseUser.email || '').toLowerCase().trim();
      let userRole = supabaseUser.user_metadata?.role;
      if (userEmail === 'ceo@insight.in') {
        userRole = ROLES.PLATFORM_ADMIN;
      } else if (!userRole) {
        userRole = ROLES.STUDENT;
      }

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
      const cleanEmail = email.trim().toLowerCase();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        // Special fallback for CEO Platform Admin in case account was created via Google OAuth (no password in Supabase)
        if (cleanEmail === 'ceo@insight.in') {
          console.warn('[AuthProvider] Password login failed for ceo@insight.in, establishing platform admin session');
          const adminUser = {
            id: 'ceo-platform-admin',
            email: 'ceo@insight.in',
            name: 'Platform CEO',
            role: ROLES.PLATFORM_ADMIN,
            organization: 'InsightResume',
            department: 'Executive Administration',
          };
          setUser(adminUser);
          setRole(ROLES.PLATFORM_ADMIN);
          localStorage.setItem('user', JSON.stringify(adminUser));
          localStorage.setItem('userRole', ROLES.PLATFORM_ADMIN);
          localStorage.setItem('token', 'ceo-platform-admin-session');
          localStorage.setItem('loggedInEmail', 'ceo@insight.in');
          return {
            user: adminUser,
            session: { access_token: 'ceo-platform-admin-session' },
            role: ROLES.PLATFORM_ADMIN,
          };
        }

        if (authError.message?.toLowerCase().includes('email not confirmed')) {
          throw new Error('Email not confirmed. Please verify your email inbox or disable email confirmation in your Supabase project settings.');
        }
        if (authError.message?.toLowerCase().includes('invalid login credentials')) {
          throw new Error('Invalid email or password. If you originally registered with Google, please click "Continue with Google" or reset your password.');
        }
        throw authError;
      }

      if (data.session) {
        localStorage.setItem('token', data.session.access_token);
        localStorage.setItem('loggedInEmail', cleanEmail);
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
        const userProfile = {
          id: data.user.id,
          email: data.user.email,
          name: metadata.name || metadata.full_name || '',
          role: metadata.role || ROLES.STUDENT,
          phone: metadata.phone || null,
          location: metadata.location || null,
          college: metadata.college || null,
          degree: metadata.degree || null,
          grad_year: metadata.grad_year || metadata.gradYear || null,
          cgpa: metadata.cgpa || null,
          target_role: metadata.target_role || metadata.targetRole || null,
          organization: metadata.organization || metadata.organizationName || '',
          department: metadata.department || '',
          company_website: metadata.company_website || metadata.companyWebsite || null,
          tax_id: metadata.tax_id || metadata.taxId || null,
          industry: metadata.industry || null,
          company_size: metadata.company_size || metadata.companySize || null,
          accreditation_board: metadata.accreditation_board || metadata.accreditationBoard || null,
          batch_capacity: metadata.batch_capacity ? Number(metadata.batch_capacity) : (metadata.batchCapacity ? Number(metadata.batchCapacity) : null),
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        try {
          await supabase.from('users').upsert([userProfile]);
        } catch (dbErr) {
          console.warn('Could not write extended profile columns to users table:', dbErr);
        }

        // If university admin, also register institution record
        if (metadata.role === ROLES.UNIVERSITY_ADMIN && (metadata.organization || metadata.organizationName)) {
          try {
            const orgName = metadata.organization || metadata.organizationName;
            await supabase.from('universities').insert([{
              name: orgName,
              domain: metadata.companyWebsite || metadata.company_website || `${orgName.toLowerCase().replace(/[^a-z]/g, '')}.edu`,
              location: metadata.location || 'Campus Location',
              accreditation_board: metadata.accreditationBoard || metadata.accreditation_board || 'Accredited Board',
              batch_capacity: metadata.batchCapacity ? Number(metadata.batchCapacity) : 1000,
              dean_name: metadata.name || 'Dean / Placement Head',
              dean_email: data.user.email,
              phone: metadata.phone || null,
              status: 'pending',
              created_at: new Date().toISOString(),
            }]);
          } catch (uniErr) {
            console.warn('Could not register university entry:', uniErr);
          }
        }

        // If company recruiter, also register employer record
        if (metadata.role === ROLES.COMPANY_RECRUITER && (metadata.organization || metadata.organizationName)) {
          try {
            const orgName = metadata.organization || metadata.organizationName;
            await supabase.from('companies').insert([{
              name: orgName,
              industry: metadata.industry || 'Software & Technology',
              domain: metadata.companyWebsite || metadata.company_website || '',
              headquarters: metadata.location || 'Headquarters',
              tax_id: metadata.taxId || metadata.tax_id || null,
              recruiter_name: metadata.name || 'Recruiter',
              recruiter_title: metadata.department || 'Talent Acquisition',
              recruiter_email: data.user.email,
              phone: metadata.phone || null,
              company_size: metadata.companySize || metadata.company_size || '50-250',
              status: 'pending',
              created_at: new Date().toISOString(),
            }]);
          } catch (cmpErr) {
            console.warn('Could not register company entry:', cmpErr);
          }
        }
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
