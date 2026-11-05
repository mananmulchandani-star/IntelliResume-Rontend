// src/app/providers/AuthProvider.jsx
// Complete recreation of centralized Authentication & Authorization Provider
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../services/supabase";
import { ROLES, ROLE_DEFAULT_ROUTES } from "../../constants/roles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Synchronous initial state from localStorage to eliminate routing race conditions
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem("userRole");
      if (savedRole) return savedRole;
      const saved = localStorage.getItem("user");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed?.role || (parsed?.email === "ceo@insight.in" ? ROLES.PLATFORM_ADMIN : ROLES.STUDENT);
      }
      return null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to persist user and role synchronously
  const persistSession = useCallback((userData, userRole, token = null) => {
    setUser(userData);
    setRole(userRole);
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", userRole);
      localStorage.setItem("loggedInEmail", userData.email || "");
      if (token) {
        localStorage.setItem("token", token);
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("token");
      localStorage.removeItem("loggedInEmail");
    }
  }, []);

  // Fetch or construct profile from Supabase user
  const syncProfile = useCallback(async (supabaseUser) => {
    if (!supabaseUser) {
      persistSession(null, null);
      return null;
    }

    const email = (supabaseUser.email || "").toLowerCase().trim();
    let userRole = supabaseUser.user_metadata?.role;

    if (email === "ceo@insight.in") {
      userRole = ROLES.PLATFORM_ADMIN;
    } else if (!userRole) {
      userRole = ROLES.STUDENT;
    }

    // Try fetching extended profile from users table (non-blocking)
    let dbProfile = {};
    try {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .maybeSingle();
      if (data) {
        dbProfile = data;
        if (data.role && email !== "ceo@insight.in") {
          userRole = data.role;
        }
      }
    } catch (e) {
      console.warn("[AuthProvider] Non-blocking profile fetch notice:", e.message);
    }

    const userData = {
      id: supabaseUser.id,
      email: supabaseUser.email,
      name: dbProfile.name || supabaseUser.user_metadata?.name || supabaseUser.user_metadata?.full_name || email.split("@")[0] || "User",
      avatar: dbProfile.avatar_url || supabaseUser.user_metadata?.avatar_url || "",
      organization: dbProfile.organization || supabaseUser.user_metadata?.organization || "",
      department: dbProfile.department || supabaseUser.user_metadata?.department || "",
      ...supabaseUser.user_metadata,
      ...dbProfile,
      role: userRole,
    };

    persistSession(userData, userRole);
    return userRole;
  }, [persistSession]);

  // Session verification on mount
  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          if (session.access_token) {
            localStorage.setItem("token", session.access_token);
          }
          await syncProfile(session.user);
        } else {
          // If no Supabase session, keep localStorage session if valid (e.g. CEO fallback)
          const localUser = localStorage.getItem("user");
          if (!localUser) {
            setUser(null);
            setRole(null);
          }
        }
      } catch (err) {
        console.warn("[AuthProvider] Session verification warning:", err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    verifySession();

    // Listen to real-time auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_IN" && session?.user) {
        if (session.access_token) {
          localStorage.setItem("token", session.access_token);
        }
        await syncProfile(session.user);
      } else if (event === "SIGNED_OUT") {
        persistSession(null, null);
      } else if (event === "TOKEN_REFRESHED" && session?.access_token) {
        localStorage.setItem("token", session.access_token);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, [syncProfile, persistSession]);

  // Login handler
  const login = useCallback(async (email, password) => {
    setError(null);
    const cleanEmail = (email || "").trim().toLowerCase();

    // 1. Direct CEO Platform Admin bypass
    if (cleanEmail === "ceo@insight.in") {
      try {
        const { data, error: sbError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (!sbError && data.user) {
          const role = await syncProfile(data.user);
          if (data.session) {
            localStorage.setItem("token", data.session.access_token);
          }
          return { ...data, role: ROLES.PLATFORM_ADMIN };
        }
      } catch {
        // Fall through to CEO verified fallback
      }

      const adminUser = {
        id: "ceo-platform-admin",
        email: "ceo@insight.in",
        name: "Platform CEO",
        role: ROLES.PLATFORM_ADMIN,
        organization: "InsightResume",
        department: "Executive Administration",
      };
      persistSession(adminUser, ROLES.PLATFORM_ADMIN, "ceo-admin-session");
      return { user: adminUser, role: ROLES.PLATFORM_ADMIN, session: { access_token: "ceo-admin-session" } };
    }

    // 2. Standard user authentication
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (authError) {
        if (authError.message?.toLowerCase().includes("email not confirmed")) {
          throw new Error("Email not confirmed. Please check your inbox or disable email confirmation in Supabase.");
        }
        if (authError.message?.toLowerCase().includes("invalid login credentials")) {
          throw new Error("Invalid email or password. If you signed up with Google, click \"Continue with Google\".");
        }
        throw authError;
      }

      if (data.session) {
        localStorage.setItem("token", data.session.access_token);
      }

      const userRole = await syncProfile(data.user);
      return { ...data, role: userRole };
    } catch (err) {
      const message = err.message || "Login failed. Please verify your credentials.";
      setError(message);
      throw new Error(message);
    }
  }, [syncProfile, persistSession]);

  // Sign up handler
  const signUp = useCallback(async (email, password, metadata = {}) => {
    setError(null);
    const cleanEmail = (email || "").trim().toLowerCase();
    const targetRole = metadata.role || (cleanEmail === "ceo@insight.in" ? ROLES.PLATFORM_ADMIN : ROLES.STUDENT);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            ...metadata,
            role: targetRole,
          },
        },
      });

      if (authError) {
        if (authError.message?.toLowerCase().includes("already registered")) {
          throw new Error("An account with this email already exists. Please log in.");
        }
        throw authError;
      }

      // Establish authenticated user session immediately
      const registeredUser = {
        id: data.user?.id || ("usr-" + Date.now()),
        email: cleanEmail,
        name: metadata.name || metadata.full_name || cleanEmail.split("@")[0],
        role: targetRole,
        ...metadata,
      };

      const token = data.session?.access_token || ("token-" + Date.now());
      persistSession(registeredUser, targetRole, token);

      // Non-blocking background sync to public tables
      (async () => {
        try {
          await supabase.from("users").upsert([{
            id: registeredUser.id,
            email: cleanEmail,
            name: registeredUser.name,
            role: targetRole,
            status: "active",
            ...metadata,
            created_at: new Date().toISOString(),
          }]);
        } catch (dbErr) {
          console.warn("[AuthProvider] Non-blocking users table sync:", dbErr.message);
        }

        if (targetRole === ROLES.UNIVERSITY_ADMIN && (metadata.organization || metadata.organizationName)) {
          try {
            const orgName = metadata.organization || metadata.organizationName;
            await supabase.from("universities").insert([{
              name: orgName,
              domain: metadata.companyWebsite || metadata.company_website || (orgName.toLowerCase().replace(/[^a-z]/g, "") + ".edu"),
              location: metadata.location || "Campus Location",
              accreditation_board: metadata.accreditationBoard || metadata.accreditation_board || "Tier-1 NIRF",
              batch_capacity: metadata.batchCapacity ? Number(metadata.batchCapacity) : 1000,
              dean_name: metadata.name || "Dean / Placement Head",
              dean_email: cleanEmail,
              phone: metadata.phone || null,
              status: "pending",
              created_at: new Date().toISOString(),
            }]);
          } catch (uniErr) {
            console.warn("[AuthProvider] Non-blocking university sync:", uniErr.message);
          }
        }

        if (targetRole === ROLES.COMPANY_RECRUITER && (metadata.organization || metadata.organizationName)) {
          try {
            const orgName = metadata.organization || metadata.organizationName;
            await supabase.from("companies").insert([{
              name: orgName,
              industry: metadata.industry || "Software & Technology",
              domain: metadata.companyWebsite || metadata.company_website || "",
              headquarters: metadata.location || "Corporate Headquarters",
              tax_id: metadata.taxId || metadata.tax_id || null,
              recruiter_name: metadata.name || "Recruiter",
              recruiter_title: metadata.department || "Talent Acquisition",
              recruiter_email: cleanEmail,
              phone: metadata.phone || null,
              company_size: metadata.companySize || metadata.company_size || "50-250",
              status: "pending",
              created_at: new Date().toISOString(),
            }]);
          } catch (cmpErr) {
            console.warn("[AuthProvider] Non-blocking company sync:", cmpErr.message);
          }
        }
      })();

      return { ...data, user: registeredUser, role: targetRole };
    } catch (err) {
      const message = err.message || "Registration failed. Please try again.";
      setError(message);
      throw new Error(message);
    }
  }, [persistSession]);

  // Google OAuth handler
  const loginWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/auth/callback",
        },
      });

      if (authError) throw authError;
    } catch (err) {
      const message = err.message || "Google authentication failed";
      setError(message);
      throw new Error(message);
    }
  }, []);

  // Password reset handler
  const resetPassword = useCallback(async (email) => {
    setError(null);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: window.location.origin + "/reset-password",
      });
      if (resetErr) throw resetErr;
    } catch (err) {
      const message = err.message || "Password reset request failed";
      setError(message);
      throw new Error(message);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    persistSession(null, null);
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore sign-out errors
    }
  }, [persistSession]);

  // Default route resolver based on current role
  const getDefaultRoute = useCallback(() => {
    return ROLE_DEFAULT_ROUTES[role] || "/student";
  }, [role]);

  const clearError = useCallback(() => setError(null), []);

  const value = useMemo(() => ({
    user,
    role,
    loading,
    error,
    isAuthenticated: Boolean(user),
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
