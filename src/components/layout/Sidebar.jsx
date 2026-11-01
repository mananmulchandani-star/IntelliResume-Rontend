import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { ROUTES } from '../../constants/routes';
import { ROLE_LABELS, ROLES } from '../../constants/roles';
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  ScanText,
  Briefcase,
  Layers,
  User,
  Users,
  Building2,
  GraduationCap,
  PlusCircle,
  BarChart3,
  Settings,
  ShieldAlert,
  FolderKanban,
  CheckSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({
  isCollapsed = false,
  onToggleCollapse,
  isMobileOpen = false,
  onMobileClose,
}) {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation schema per role
  const getNavLinks = () => {
    switch (role) {
      case ROLES.STUDENT:
        return [
          { label: 'Overview', to: ROUTES.STUDENT_DASHBOARD, icon: LayoutDashboard, exact: true },
          { label: 'AI Resume Builder', to: ROUTES.RESUME_BUILDER, icon: Sparkles },
          { label: 'Resume Editor', to: ROUTES.RESUME_EDITOR, icon: FileText },
          { label: 'Resume Intelligence', to: ROUTES.RESUME_INTELLIGENCE, icon: ScanText },
          { label: 'Opportunities', to: ROUTES.JOB_PORTAL, icon: Briefcase },
          { label: 'Applications', to: ROUTES.APPLICATION_TRACKER, icon: Layers },
          { label: 'Student Profile', to: ROUTES.STUDENT_PROFILE, icon: User },
        ];

      case ROLES.UNIVERSITY_ADMIN:
      case ROLES.UNIVERSITY_STAFF:
        return [
          { label: 'Placement Dashboard', to: ROUTES.UNIVERSITY_DASHBOARD, icon: LayoutDashboard, exact: true },
          { label: 'Student Directory', to: ROUTES.STUDENT_DIRECTORY, icon: Users },
          { label: 'Placement Drives', to: ROUTES.PLACEMENT_DRIVES, icon: FolderKanban },
          { label: 'Partner Companies', to: ROUTES.COMPANY_DIRECTORY, icon: Building2 },
          { label: 'Placement Analytics', to: ROUTES.PLACEMENT_ANALYTICS, icon: BarChart3 },
          { label: 'University Settings', to: ROUTES.UNIVERSITY_SETTINGS, icon: Settings },
        ];

      case ROLES.COMPANY_ADMIN:
      case ROLES.COMPANY_RECRUITER:
        return [
          { label: 'Recruiter Dashboard', to: ROUTES.COMPANY_DASHBOARD, icon: LayoutDashboard, exact: true },
          { label: 'Manage Vacancies', to: ROUTES.JOB_LISTINGS, icon: Briefcase },
          { label: 'Post New Listing', to: ROUTES.JOB_EDITOR, icon: PlusCircle },
          { label: 'Candidate Pipeline', to: ROUTES.CANDIDATE_MANAGER, icon: Users },
          { label: 'Campus Recruitment', to: ROUTES.UNIVERSITY_RECRUITMENT, icon: GraduationCap },
          { label: 'Company Profile', to: ROUTES.COMPANY_PROFILE, icon: Building2 },
        ];

      case ROLES.PLATFORM_ADMIN:
        return [
          { label: 'System Overview', to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, exact: true },
          { label: 'All Users', to: ROUTES.USER_MANAGEMENT, icon: Users },
          { label: 'University Verification', to: ROUTES.UNIVERSITY_VERIFICATION, icon: GraduationCap },
          { label: 'Company Verification', to: ROUTES.COMPANY_VERIFICATION, icon: Building2 },
          { label: 'Listing Moderation', to: ROUTES.LISTING_MODERATION, icon: CheckSquare },
          { label: 'Platform Reports', to: ROUTES.REPORTS, icon: FileText },
          { label: 'System Analytics', to: ROUTES.SYSTEM_ANALYTICS, icon: BarChart3 },
        ];

      default:
        return [
          { label: 'Overview', to: ROUTES.STUDENT_DASHBOARD, icon: LayoutDashboard },
          { label: 'Resume Builder', to: ROUTES.RESUME_BUILDER, icon: Sparkles },
        ];
    }
  };

  const navLinks = getNavLinks();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-neutral-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white border-r border-neutral-200 transition-all duration-200 ease-in-out',
          isCollapsed ? 'w-[72px]' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header / Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-100">
          <Link to={ROUTES.HOME} className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm text-neutral-900 tracking-tight">
                  Insight<span className="text-primary-600">Resume</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-semibold -mt-0.5">
                  {ROLE_LABELS[role] || 'Portal'}
                </span>
              </div>
            )}
          </Link>

          {/* Collapse Toggle on Desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Portal Badge */}
        {!isCollapsed && (
          <div className="px-4 py-2 bg-neutral-50/80 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
              Active Workspace
            </span>
            <span className="text-[10px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full border border-primary-100">
              {ROLE_LABELS[role] || 'Member'}
            </span>
          </div>
        )}

        {/* Navigation Links List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onMobileClose}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative',
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50',
                    isCollapsed && 'justify-center px-2'
                  )
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={clsx(
                    'w-4 h-4 shrink-0 transition-colors',
                    isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                  )}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer — User profile snippet & Logout */}
        <div className="p-3 border-t border-neutral-100 space-y-1.5">
          <Link
            to={ROUTES.HOME}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors',
              isCollapsed && 'justify-center px-1'
            )}
            title="Public Website"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>Public Website</span>}
          </Link>

          <div
            className={clsx(
              'flex items-center justify-between p-2 rounded-lg bg-neutral-50 border border-neutral-100',
              isCollapsed && 'flex-col gap-2 p-1.5'
            )}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center shrink-0">
                {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : 'U'}
              </div>
              {!isCollapsed && (
                <div className="truncate text-left">
                  <p className="text-xs font-semibold text-neutral-900 truncate">
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-[10px] text-neutral-400 truncate">{user?.email}</p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4 shrink-0" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
