// src/features/auth/components/AuthGuard.jsx
// Enterprise Role-Based Access Control (RBAC) Guard
import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ROLE_PERMISSIONS, ROLE_LABELS, ROLE_DEFAULT_ROUTES } from '../../../constants/roles';
import { Button } from '../../../components/ui';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

/**
 * AuthGuard provides strict, ironclad protection for each workspace:
 * - Unauthenticated users are redirected to /login
 * - Students CANNOT access University, Recruiter, or Admin portals
 * - Recruiters CANNOT access Student, University, or Admin portals
 * - University admins CANNOT access Student, Recruiter, or Admin portals
 * - Cross-role access triggers a dedicated 403 Access Denied screen
 */
export default function AuthGuard({ children, allowedPortals, requireAuth = true }) {
  const { user, role, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check local storage fallback for user/role in case React state is still flushing
  const savedUserStr = !user ? localStorage.getItem('user') : null;
  let cachedUser = null;
  try {
    cachedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
  } catch {
    cachedUser = null;
  }
  const effectiveUser = user || cachedUser;
  const effectiveRole = role || localStorage.getItem('userRole');

  // 1. Show loading spinner while checking auth session
  if (loading && !effectiveUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4">
        <div className="w-9 h-9 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        <span className="mt-3 text-xs text-neutral-400 font-medium">Verifying authorization...</span>
      </div>
    );
  }

  // 2. Redirect unauthenticated users to login
  if (requireAuth && !effectiveUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Strict Role-Based Portal Access Enforcement
  if (allowedPortals && effectiveRole) {
    const userPermissions = ROLE_PERMISSIONS[effectiveRole] || [];
    const hasAccess = allowedPortals.some((portal) => userPermissions.includes(portal));

    if (!hasAccess) {
      const myDashboard = ROLE_DEFAULT_ROUTES[effectiveRole] || '/login';
      const myRoleLabel = ROLE_LABELS[effectiveRole] || effectiveRole;
      const targetPortalName = allowedPortals[0].charAt(0).toUpperCase() + allowedPortals[0].slice(1);

      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-red-100 p-6 sm:p-8 text-center animate-scale-in">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center mb-5">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-800 mb-3">
              403 • Access Denied
            </div>

            <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              Unauthorized Workspace Access
            </h2>

            <p className="mt-2.5 text-xs text-neutral-600 leading-relaxed">
              Your account is signed in as a <strong className="text-neutral-900 font-semibold">{myRoleLabel}</strong>. You do not have permissions to access the <strong className="text-neutral-900 font-semibold">{targetPortalName}</strong> workspace.
            </p>

            <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-col sm:flex-row gap-2.5 justify-center">
              <Button
                variant="primary"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => navigate(myDashboard, { replace: true })}
                className="w-full sm:w-auto"
              >
                Return to My Dashboard
              </Button>
              <Button
                variant="outline"
                size="md"
                leftIcon={<LogOut className="w-4 h-4" />}
                onClick={async () => {
                  await logout();
                  navigate('/login', { replace: true });
                }}
                className="w-full sm:w-auto text-neutral-600"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
}
