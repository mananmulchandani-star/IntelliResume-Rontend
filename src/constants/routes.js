// Route path constants to avoid string duplication across the app
export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  FEATURES: '/features',
  CONTACT: '/contact',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  UNIVERSITY_SOLUTIONS: '/university-solutions',
  COMPANY_SOLUTIONS: '/company-solutions',
  UNIVERSITY_PARTNER: '/partner/university',
  COMPANY_PARTNER: '/partner/company',
  AI_RESUME_BUILDER: '/ai-resume-builder',
  ATS_CHECKER: '/ats-checker',
  JOB_DISCOVERY: '/jobs',

  // Auth
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  AUTH_CALLBACK: '/auth/callback',

  // Student
  STUDENT_DASHBOARD: '/student',
  RESUME_BUILDER: '/student/resume/new',
  RESUME_EDITOR: '/student/resume/edit',
  RESUME_INTELLIGENCE: '/student/resume/intelligence',
  JOB_PORTAL: '/student/jobs',
  APPLICATION_TRACKER: '/student/applications',
  STUDENT_PROFILE: '/student/profile',

  // University
  UNIVERSITY_DASHBOARD: '/university',
  STUDENT_DIRECTORY: '/university/students',
  PLACEMENT_DRIVES: '/university/drives',
  DRIVE_DETAIL: '/university/drives/:id',
  COMPANY_DIRECTORY: '/university/companies',
  PLACEMENT_ANALYTICS: '/university/analytics',
  UNIVERSITY_SETTINGS: '/university/settings',

  // Company
  COMPANY_DASHBOARD: '/company',
  JOB_LISTINGS: '/company/jobs',
  JOB_EDITOR: '/company/jobs/new',
  CANDIDATE_MANAGER: '/company/candidates',
  UNIVERSITY_RECRUITMENT: '/company/university-recruitment',
  COMPANY_PROFILE: '/company/profile',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  USER_MANAGEMENT: '/admin/users',
  UNIVERSITY_VERIFICATION: '/admin/universities',
  COMPANY_VERIFICATION: '/admin/companies',
  LISTING_MODERATION: '/admin/listings',
  REPORTS: '/admin/reports',
  SYSTEM_ANALYTICS: '/admin/analytics',
};
