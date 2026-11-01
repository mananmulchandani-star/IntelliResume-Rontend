export const ROLES = {
  STUDENT: 'student',
  UNIVERSITY_ADMIN: 'university_admin',
  UNIVERSITY_STAFF: 'university_staff',
  COMPANY_ADMIN: 'company_admin',
  COMPANY_RECRUITER: 'company_recruiter',
  PLATFORM_ADMIN: 'platform_admin',
};

// Which roles can access which portal sections — strict isolation
export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: ['student'],
  [ROLES.UNIVERSITY_ADMIN]: ['university'],
  [ROLES.UNIVERSITY_STAFF]: ['university'],
  [ROLES.COMPANY_ADMIN]: ['company'],
  [ROLES.COMPANY_RECRUITER]: ['company'],
  [ROLES.PLATFORM_ADMIN]: ['admin'],
};

// Human-readable role labels
export const ROLE_LABELS = {
  [ROLES.STUDENT]: 'Student',
  [ROLES.UNIVERSITY_ADMIN]: 'University Admin',
  [ROLES.UNIVERSITY_STAFF]: 'Placement Officer',
  [ROLES.COMPANY_ADMIN]: 'Company Admin',
  [ROLES.COMPANY_RECRUITER]: 'Recruiter',
  [ROLES.PLATFORM_ADMIN]: 'Platform Admin',
};

// Default dashboard route per role
export const ROLE_DEFAULT_ROUTES = {
  [ROLES.STUDENT]: '/student',
  [ROLES.UNIVERSITY_ADMIN]: '/university',
  [ROLES.UNIVERSITY_STAFF]: '/university',
  [ROLES.COMPANY_ADMIN]: '/company',
  [ROLES.COMPANY_RECRUITER]: '/company',
  [ROLES.PLATFORM_ADMIN]: '/admin',
};
