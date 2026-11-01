import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { ROUTES } from '../../constants/routes';
import { ROLE_LABELS } from '../../constants/roles';
import Button from '../ui/Button';
import {
  FileText,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  CheckCircle,
  Briefcase,
  GraduationCap,
  Building2,
  User,
  LogOut,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, role, logout, getDefaultRoute } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header
      className={clsx(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-200',
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-neutral-200/80 shadow-xs'
          : 'bg-white/60 backdrop-blur-xs border-b border-neutral-100'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={ROUTES.HOME} className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white shadow-sm group-hover:bg-primary-700 transition-colors">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-neutral-900 group-hover:text-primary-600 transition-colors">
              Insight<span className="text-primary-600 font-extrabold">Resume</span>
            </span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium -mt-1">
              Career Ecosystem
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to={ROUTES.FEATURES}
            className={clsx(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
              location.pathname === ROUTES.FEATURES
                ? 'text-primary-600 bg-primary-50'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            )}
          >
            Features
          </Link>

          <Link
            to={ROUTES.AI_RESUME_BUILDER}
            className={clsx(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1',
              location.pathname === ROUTES.AI_RESUME_BUILDER
                ? 'text-primary-600 bg-primary-50'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-primary-500" />
            AI Builder
          </Link>

          <Link
            to={ROUTES.ATS_CHECKER}
            className={clsx(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1',
              location.pathname === ROUTES.ATS_CHECKER
                ? 'text-primary-600 bg-primary-50'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            )}
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            ATS Score
          </Link>

          <Link
            to={ROUTES.JOB_DISCOVERY}
            className={clsx(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1',
              location.pathname === ROUTES.JOB_DISCOVERY
                ? 'text-primary-600 bg-primary-50'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            )}
          >
            <Briefcase className="w-3.5 h-3.5 text-neutral-500" />
            Jobs
          </Link>

          <Link
            to={ROUTES.ABOUT}
            className={clsx(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
              location.pathname === ROUTES.ABOUT
                ? 'text-primary-600 bg-primary-50'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            )}
          >
            About
          </Link>

          <Link
            to={ROUTES.CONTACT}
            className={clsx(
              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
              location.pathname === ROUTES.CONTACT
                ? 'text-primary-600 bg-primary-50'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            )}
          >
            Contact
          </Link>

          <Link
            to={ROUTES.UNIVERSITY_PARTNER}
            className={clsx(
              'px-2.5 py-1.5 text-xs font-semibold rounded-md transition-colors',
              (location.pathname === ROUTES.UNIVERSITY_PARTNER || location.pathname === ROUTES.COMPANY_PARTNER)
                ? 'text-primary-700 bg-primary-50 border border-primary-200'
                : 'text-neutral-700 hover:text-primary-600 hover:bg-neutral-50'
            )}
          >
            For Partners
          </Link>
        </nav>

        {/* Right CTA / Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-semibold text-xs flex items-center justify-center border border-primary-200">
                  {user.name ? user.name.slice(0, 2).toUpperCase() : user.email?.slice(0, 2).toUpperCase() || 'U'}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-neutral-900 leading-none truncate max-w-[120px]">
                    {user.name || user.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                    {ROLE_LABELS[role] || 'User'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-1.5 z-50 animate-scale-in">
                  <div className="px-3.5 py-2 border-b border-neutral-100">
                    <p className="text-xs font-semibold text-neutral-900 truncate">{user.name || 'Account'}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
                      {ROLE_LABELS[role] || 'Member'}
                    </span>
                  </div>

                  <Link
                    to={getDefaultRoute()}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                    Go to Portal Dashboard
                  </Link>

                  {role === 'student' && (
                    <Link
                      to={ROUTES.STUDENT_PROFILE}
                      className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                    >
                      <User className="w-4 h-4 text-neutral-400" />
                      My Profile
                    </Link>
                  )}

                  <div className="border-t border-neutral-100 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-slide-down">
          <nav className="flex flex-col space-y-1">
            <Link
              to={ROUTES.FEATURES}
              className="px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-100"
            >
              Features
            </Link>
            <Link
              to={ROUTES.AI_RESUME_BUILDER}
              className="px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-primary-500" /> AI Resume Builder
            </Link>
            <Link
              to={ROUTES.ATS_CHECKER}
              className="px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-500" /> ATS Checker
            </Link>
            <Link
              to={ROUTES.JOB_DISCOVERY}
              className="px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4 text-neutral-500" /> Job Discovery
            </Link>
            <Link
              to={ROUTES.ABOUT}
              className="px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-100"
            >
              About
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-100"
            >
              Contact
            </Link>
            <div className="pt-2 pb-1 border-t border-neutral-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 block mb-1">
                Institutional Partnerships
              </span>
              <Link
                to={ROUTES.UNIVERSITY_PARTNER}
                className="px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-primary-600" /> For Universities
              </Link>
              <Link
                to={ROUTES.COMPANY_PARTNER}
                className="px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-neutral-600" /> For Employers
              </Link>
            </div>
          </nav>

          <div className="pt-3 border-t border-neutral-100 flex flex-col gap-2">
            {user ? (
              <>
                <Link to={getDefaultRoute()} className="w-full">
                  <Button variant="primary" size="md" fullWidth>
                    Dashboard ({ROLE_LABELS[role] || 'User'})
                  </Button>
                </Link>
                <Button variant="outline" size="md" fullWidth onClick={handleLogout}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN} className="w-full">
                  <Button variant="outline" size="md" fullWidth>
                    Sign In
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER} className="w-full">
                  <Button variant="primary" size="md" fullWidth>
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
