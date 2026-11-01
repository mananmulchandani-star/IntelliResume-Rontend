import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';
import AuthGuard from '../features/auth/components/AuthGuard';
import PublicLayout from '../components/layout/PublicLayout';
import { Spinner } from '../components/ui';

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
    <Spinner size="lg" />
    <span className="mt-3 text-xs text-neutral-400 font-medium">Loading workspace...</span>
  </div>
);

// Lazy-loaded Public Pages
const HomePage = lazy(() => import('../features/public/pages/HomePage'));
const AboutPage = lazy(() => import('../features/public/pages/AboutPage'));
const FeaturesPage = lazy(() => import('../features/public/pages/FeaturesPage'));
const ContactPage = lazy(() => import('../features/public/pages/ContactPage'));
const FaqPage = lazy(() => import('../features/public/pages/FaqPage'));
const PrivacyPage = lazy(() => import('../features/public/pages/PrivacyPage'));
const UniversitySolutionsPage = lazy(() => import('../features/public/pages/UniversitySolutionsPage'));
const CompanySolutionsPage = lazy(() => import('../features/public/pages/CompanySolutionsPage'));
const AIResumeBuilderPage = lazy(() => import('../features/public/pages/AIResumeBuilderPage'));
const ATSCheckerPage = lazy(() => import('../features/public/pages/ATSCheckerPage'));
const JobDiscoveryPage = lazy(() => import('../features/public/pages/JobDiscoveryPage'));
const NotFoundPage = lazy(() => import('../features/public/pages/NotFoundPage'));

// Lazy-loaded Auth Pages
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'));
const AuthCallbackPage = lazy(() => import('../features/auth/pages/AuthCallbackPage'));

// Lazy-loaded Student Portal Pages
const StudentDashboard = lazy(() => import('../features/student/pages/StudentDashboard'));
const ResumeBuilder = lazy(() => import('../features/student/pages/ResumeBuilder'));
const ResumeEditor = lazy(() => import('../features/student/pages/ResumeEditor'));
const ResumeIntelligence = lazy(() => import('../features/student/pages/ResumeIntelligence'));
const JobPortal = lazy(() => import('../features/student/pages/JobPortal'));
const ApplicationTracker = lazy(() => import('../features/student/pages/ApplicationTracker'));
const StudentProfile = lazy(() => import('../features/student/pages/StudentProfile'));

// Lazy-loaded University Portal Pages
const UniversityDashboard = lazy(() => import('../features/university/pages/UniversityDashboard'));
const StudentDirectory = lazy(() => import('../features/university/pages/StudentDirectory'));
const PlacementDrives = lazy(() => import('../features/university/pages/PlacementDrives'));
const DriveDetail = lazy(() => import('../features/university/pages/DriveDetail'));
const CompanyDirectory = lazy(() => import('../features/university/pages/CompanyDirectory'));
const PlacementAnalytics = lazy(() => import('../features/university/pages/PlacementAnalytics'));
const UniversitySettings = lazy(() => import('../features/university/pages/UniversitySettings'));

// Lazy-loaded Company Portal Pages
const CompanyDashboard = lazy(() => import('../features/company/pages/CompanyDashboard'));
const JobListings = lazy(() => import('../features/company/pages/JobListings'));
const JobEditor = lazy(() => import('../features/company/pages/JobEditor'));
const CandidateManager = lazy(() => import('../features/company/pages/CandidateManager'));
const UniversityRecruitment = lazy(() => import('../features/company/pages/UniversityRecruitment'));
const CompanyProfile = lazy(() => import('../features/company/pages/CompanyProfile'));

// Lazy-loaded Admin Portal Pages
const AdminDashboard = lazy(() => import('../features/admin/pages/AdminDashboard'));
const UserManagement = lazy(() => import('../features/admin/pages/UserManagement'));
const UniversityVerification = lazy(() => import('../features/admin/pages/UniversityVerification'));
const CompanyVerification = lazy(() => import('../features/admin/pages/CompanyVerification'));
const ListingModeration = lazy(() => import('../features/admin/pages/ListingModeration'));
const Reports = lazy(() => import('../features/admin/pages/Reports'));
const SystemAnalytics = lazy(() => import('../features/admin/pages/SystemAnalytics'));

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ============================================================ */}
        {/* Public Website Routes (wrapped in PublicLayout)              */}
        {/* ============================================================ */}
        <Route
          path={ROUTES.HOME}
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path={ROUTES.ABOUT}
          element={
            <PublicLayout>
              <AboutPage />
            </PublicLayout>
          }
        />
        <Route
          path={ROUTES.FEATURES}
          element={
            <PublicLayout>
              <FeaturesPage />
            </PublicLayout>
          }
        />
        <Route
          path={ROUTES.CONTACT}
          element={
            <PublicLayout>
              <ContactPage />
            </PublicLayout>
          }
        />
        <Route
          path={ROUTES.FAQ}
          element={
            <PublicLayout>
              <FaqPage />
            </PublicLayout>
          }
        />
        <Route
          path={ROUTES.PRIVACY}
          element={
            <PublicLayout>
              <PrivacyPage />
            </PublicLayout>
          }
        />
        <Route
          path={ROUTES.UNIVERSITY_SOLUTIONS}
          element={
            <PublicLayout>
              <UniversitySolutionsPage />
            </PublicLayout>
          }
        />
        <Route
          path={ROUTES.COMPANY_SOLUTIONS}
          element={
            <PublicLayout>
              <CompanySolutionsPage />
            </PublicLayout>
          }
        />
        <Route
          path={ROUTES.AI_RESUME_BUILDER}
          element={
            <PublicLayout>
              <AIResumeBuilderPage />
            </PublicLayout>
          }
        />
        <Route
          path={ROUTES.ATS_CHECKER}
          element={
            <PublicLayout>
              <ATSCheckerPage />
            </PublicLayout>
          }
        />
        <Route
          path={ROUTES.JOB_DISCOVERY}
          element={
            <PublicLayout>
              <JobDiscoveryPage />
            </PublicLayout>
          }
        />

        {/* ============================================================ */}
        {/* Authentication Routes                                        */}
        {/* ============================================================ */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallbackPage />} />

        {/* Backward Compatibility & Legacy Redirects */}
        <Route path="/auth" element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route path="/signup" element={<Navigate to={ROUTES.REGISTER} replace />} />
        <Route path="/dashboard" element={<Navigate to={ROUTES.STUDENT_DASHBOARD} replace />} />
        <Route path="/editor" element={<Navigate to={ROUTES.RESUME_EDITOR} replace />} />
        <Route path="/create-resume" element={<Navigate to={ROUTES.RESUME_BUILDER} replace />} />
        <Route path="/ai-prompt" element={<Navigate to={ROUTES.RESUME_BUILDER} replace />} />
        <Route path="/adminportal" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
        <Route path="/Features" element={<Navigate to={ROUTES.FEATURES} replace />} />
        <Route path="/About" element={<Navigate to={ROUTES.ABOUT} replace />} />

        {/* ============================================================ */}
        {/* Student Portal Protected Routes                              */}
        {/* ============================================================ */}
        <Route
          path={ROUTES.STUDENT_DASHBOARD}
          element={
            <AuthGuard allowedPortals={['student']}>
              <StudentDashboard />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.RESUME_BUILDER}
          element={
            <AuthGuard allowedPortals={['student']}>
              <ResumeBuilder />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.RESUME_EDITOR}
          element={
            <AuthGuard allowedPortals={['student']}>
              <ResumeEditor />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.RESUME_INTELLIGENCE}
          element={
            <AuthGuard allowedPortals={['student']}>
              <ResumeIntelligence />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.JOB_PORTAL}
          element={
            <AuthGuard allowedPortals={['student']}>
              <JobPortal />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.APPLICATION_TRACKER}
          element={
            <AuthGuard allowedPortals={['student']}>
              <ApplicationTracker />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.STUDENT_PROFILE}
          element={
            <AuthGuard allowedPortals={['student']}>
              <StudentProfile />
            </AuthGuard>
          }
        />

        {/* ============================================================ */}
        {/* University Portal Protected Routes                           */}
        {/* ============================================================ */}
        <Route
          path={ROUTES.UNIVERSITY_DASHBOARD}
          element={
            <AuthGuard allowedPortals={['university']}>
              <UniversityDashboard />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.STUDENT_DIRECTORY}
          element={
            <AuthGuard allowedPortals={['university']}>
              <StudentDirectory />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.PLACEMENT_DRIVES}
          element={
            <AuthGuard allowedPortals={['university']}>
              <PlacementDrives />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.DRIVE_DETAIL}
          element={
            <AuthGuard allowedPortals={['university']}>
              <DriveDetail />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.COMPANY_DIRECTORY}
          element={
            <AuthGuard allowedPortals={['university']}>
              <CompanyDirectory />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.PLACEMENT_ANALYTICS}
          element={
            <AuthGuard allowedPortals={['university']}>
              <PlacementAnalytics />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.UNIVERSITY_SETTINGS}
          element={
            <AuthGuard allowedPortals={['university']}>
              <UniversitySettings />
            </AuthGuard>
          }
        />

        {/* ============================================================ */}
        {/* Company / Recruiter Portal Protected Routes                  */}
        {/* ============================================================ */}
        <Route
          path={ROUTES.COMPANY_DASHBOARD}
          element={
            <AuthGuard allowedPortals={['company']}>
              <CompanyDashboard />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.JOB_LISTINGS}
          element={
            <AuthGuard allowedPortals={['company']}>
              <JobListings />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.JOB_EDITOR}
          element={
            <AuthGuard allowedPortals={['company']}>
              <JobEditor />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.CANDIDATE_MANAGER}
          element={
            <AuthGuard allowedPortals={['company']}>
              <CandidateManager />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.UNIVERSITY_RECRUITMENT}
          element={
            <AuthGuard allowedPortals={['company']}>
              <UniversityRecruitment />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.COMPANY_PROFILE}
          element={
            <AuthGuard allowedPortals={['company']}>
              <CompanyProfile />
            </AuthGuard>
          }
        />

        {/* ============================================================ */}
        {/* Platform Administrator Protected Routes                      */}
        {/* ============================================================ */}
        <Route
          path={ROUTES.ADMIN_DASHBOARD}
          element={
            <AuthGuard allowedPortals={['admin']}>
              <AdminDashboard />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.USER_MANAGEMENT}
          element={
            <AuthGuard allowedPortals={['admin']}>
              <UserManagement />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.UNIVERSITY_VERIFICATION}
          element={
            <AuthGuard allowedPortals={['admin']}>
              <UniversityVerification />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.COMPANY_VERIFICATION}
          element={
            <AuthGuard allowedPortals={['admin']}>
              <CompanyVerification />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.LISTING_MODERATION}
          element={
            <AuthGuard allowedPortals={['admin']}>
              <ListingModeration />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.REPORTS}
          element={
            <AuthGuard allowedPortals={['admin']}>
              <Reports />
            </AuthGuard>
          }
        />
        <Route
          path={ROUTES.SYSTEM_ANALYTICS}
          element={
            <AuthGuard allowedPortals={['admin']}>
              <SystemAnalytics />
            </AuthGuard>
          }
        />

        {/* 404 Catch-All */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFoundPage />
            </PublicLayout>
          }
        />
      </Routes>
    </Suspense>
  );
}
