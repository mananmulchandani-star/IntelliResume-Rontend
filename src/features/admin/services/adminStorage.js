// src/features/admin/services/adminStorage.js
// Centralized mock data store with localStorage persistence for Platform Administrator Portal

const STORAGE_KEYS = {
  USERS: 'insight_admin_users_v1',
  UNIVERSITIES: 'insight_admin_universities_v1',
  COMPANIES: 'insight_admin_companies_v1',
  LISTINGS: 'insight_admin_listings_v1',
  AUDIT_LOGS: 'insight_admin_audit_logs_v1',
  REPORTS: 'insight_admin_reports_v1',
};

const INITIAL_USERS = [
  {
    id: 'usr-101',
    name: 'Rahul Sharma',
    email: 'rahul.s@iitd.ac.in',
    role: 'student',
    organization: 'IIT Delhi',
    department: 'Computer Science',
    batch: '2025',
    status: 'active',
    joinedDate: '2025-08-14',
    lastLogin: '10 mins ago',
    avatar: null,
  },
  {
    id: 'usr-102',
    name: 'Priya Patel',
    email: 'priya.patel@bits-pilani.ac.in',
    role: 'student',
    organization: 'BITS Pilani',
    department: 'Electronics & Comm',
    batch: '2025',
    status: 'active',
    joinedDate: '2025-09-02',
    lastLogin: '2 hours ago',
    avatar: null,
  },
  {
    id: 'usr-103',
    name: 'Alex Rivera',
    email: 'arivera@stanford.edu',
    role: 'student',
    organization: 'Stanford University',
    department: 'Computer Science',
    batch: '2026',
    status: 'active',
    joinedDate: '2025-10-12',
    lastLogin: '1 day ago',
    avatar: null,
  },
  {
    id: 'usr-104',
    name: 'Maya Chen',
    email: 'mchen@berkeley.edu',
    role: 'student',
    organization: 'UC Berkeley',
    department: 'Data Science & AI',
    batch: '2025',
    status: 'active',
    joinedDate: '2025-07-20',
    lastLogin: 'Just now',
    avatar: null,
  },
  {
    id: 'usr-105',
    name: 'Dr. Aris Thorne',
    email: 'careers-dean@stanford.edu',
    role: 'university_admin',
    organization: 'Stanford University',
    department: 'Career Development Center',
    batch: null,
    status: 'pending',
    joinedDate: '2026-10-28',
    lastLogin: '3 hours ago',
    avatar: null,
  },
  {
    id: 'usr-106',
    name: 'Dr. S. K. Narang',
    email: 'placement.head@iitb.ac.in',
    role: 'university_admin',
    organization: 'IIT Bombay',
    department: 'Central Placement Office',
    batch: null,
    status: 'active',
    joinedDate: '2025-06-11',
    lastLogin: '45 mins ago',
    avatar: null,
  },
  {
    id: 'usr-107',
    name: 'Prof. Elena Vance',
    email: 'e.vance@cambridge.ac.uk',
    role: 'university_admin',
    organization: 'University of Cambridge',
    department: 'Careers Service',
    batch: null,
    status: 'active',
    joinedDate: '2025-05-19',
    lastLogin: 'Yesterday',
    avatar: null,
  },
  {
    id: 'usr-108',
    name: 'David Kim',
    email: 'david.kim@stripe.com',
    role: 'company_recruiter',
    organization: 'Stripe',
    department: 'University Talent Acquisition',
    batch: null,
    status: 'pending',
    joinedDate: '2026-10-27',
    lastLogin: '1 hour ago',
    avatar: null,
  },
  {
    id: 'usr-109',
    name: 'Sarah Jenkins',
    email: 'sjenkins@google.com',
    role: 'company_recruiter',
    organization: 'Google',
    department: 'Global Campus Hiring',
    batch: null,
    status: 'active',
    joinedDate: '2025-04-10',
    lastLogin: '18 mins ago',
    avatar: null,
  },
  {
    id: 'usr-110',
    name: 'Elena Rostova',
    email: 'elena@anthropic.com',
    role: 'company_recruiter',
    organization: 'Anthropic',
    department: 'Talent & University Programs',
    batch: null,
    status: 'active',
    joinedDate: '2025-11-04',
    lastLogin: '4 hours ago',
    avatar: null,
  },
  {
    id: 'usr-111',
    name: 'Kevin Brown',
    email: 'k.brown@gmail.com',
    role: 'company_recruiter',
    organization: 'DataMatrix Global',
    department: 'Staffing Operations',
    batch: null,
    status: 'deactivated',
    joinedDate: '2026-10-15',
    lastLogin: '5 days ago',
    avatar: null,
  },
  {
    id: 'usr-112',
    name: 'Admin Supervisor',
    email: 'root.admin@insightresume.ai',
    role: 'platform_admin',
    organization: 'InsightResume Core',
    department: 'System Architecture & Trust',
    batch: null,
    status: 'active',
    joinedDate: '2025-01-01',
    lastLogin: 'Active now',
    avatar: null,
  },
];

const INITIAL_UNIVERSITIES = [
  {
    id: 'uni-1',
    name: 'Stanford University',
    country: 'United States',
    state: 'California',
    accreditationBoard: 'WASC Senior College and University Commission',
    ranking: 'QS World #5 / US News #3',
    batchCapacity: 7500,
    deanName: 'Dr. Aris Thorne',
    deanEmail: 'careers-dean@stanford.edu',
    phone: '+1 (650) 723-2300',
    domain: 'stanford.edu',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    submittedDate: '2026-10-29',
    verifiedDate: null,
    verifiedBy: null,
    rejectionReason: null,
    documents: [
      { name: 'WASC_Accreditation_Certificate_2024.pdf', size: '2.4 MB', type: 'Accreditation', verified: true },
      { name: 'Stanford_Institutional_MoA.pdf', size: '1.2 MB', type: 'Charter', verified: true },
      { name: 'Career_Dean_Authorization_Letter.pdf', size: '850 KB', type: 'Authorization', verified: false },
    ],
    notes: 'Submitted fast-track integration for Winter 2026 campus drives.',
  },
  {
    id: 'uni-2',
    name: 'Indian Institute of Technology, Bombay',
    country: 'India',
    state: 'Maharashtra',
    accreditationBoard: 'Institute of National Importance (AICTE / NAAC A++)',
    ranking: 'NIRF Engineering #3 / QS Asia #40',
    batchCapacity: 4800,
    deanName: 'Dr. S. K. Narang',
    deanEmail: 'placement.head@iitb.ac.in',
    phone: '+91 22 2576 7000',
    domain: 'iitb.ac.in',
    status: 'pending',
    submittedDate: '2026-10-30',
    verifiedDate: null,
    verifiedBy: null,
    rejectionReason: null,
    documents: [
      { name: 'IITB_Institute_Charter_Acts.pdf', size: '3.1 MB', type: 'Charter', verified: true },
      { name: 'Central_Placement_Board_Authorization.pdf', size: '920 KB', type: 'Authorization', verified: true },
    ],
    notes: 'Requires multi-branch drive batch scheduling integration.',
  },
  {
    id: 'uni-3',
    name: 'National University of Singapore',
    country: 'Singapore',
    state: 'Central',
    accreditationBoard: 'Ministry of Education Singapore / AACSB',
    ranking: 'QS World #8',
    batchCapacity: 12000,
    deanName: 'Prof. Tan Eng Chye',
    deanEmail: 'career-centre@nus.edu.sg',
    phone: '+65 6516 6666',
    domain: 'nus.edu.sg',
    status: 'approved',
    submittedDate: '2026-09-10',
    verifiedDate: '2026-09-15',
    verifiedBy: 'Admin Supervisor',
    rejectionReason: null,
    documents: [
      { name: 'NUS_Charter_and_MOE_Gazette.pdf', size: '4.2 MB', type: 'Charter', verified: true },
      { name: 'Placement_Director_Credential.pdf', size: '1.1 MB', type: 'Authorization', verified: true },
    ],
    notes: 'Full institutional enterprise tier active.',
  },
  {
    id: 'uni-4',
    name: 'Technical University of Munich (TUM)',
    country: 'Germany',
    state: 'Bavaria',
    accreditationBoard: 'Bavarian State Ministry of Sciences / ASIIN',
    ranking: 'QS World #28',
    batchCapacity: 9200,
    deanName: 'Prof. Dr. Thomas Hofmann',
    deanEmail: 'careers@tum.de',
    phone: '+49 89 289 01',
    domain: 'tum.de',
    status: 'approved',
    submittedDate: '2026-09-02',
    verifiedDate: '2026-09-08',
    verifiedBy: 'Admin Supervisor',
    documents: [
      { name: 'TUM_State_Accreditation_Proof.pdf', size: '2.8 MB', type: 'Accreditation', verified: true },
    ],
    notes: 'European tech talent exchange partner.',
  },
  {
    id: 'uni-5',
    name: 'BITS Pilani',
    country: 'India',
    state: 'Rajasthan',
    accreditationBoard: 'UGC / NAAC A Grade / Deemed University',
    ranking: 'NIRF #20',
    batchCapacity: 3900,
    deanName: 'Dr. G. Sundar',
    deanEmail: 'placement@pilani.bits-pilani.ac.in',
    phone: '+91 1596 245073',
    domain: 'bits-pilani.ac.in',
    status: 'approved',
    submittedDate: '2026-08-20',
    verifiedDate: '2026-08-25',
    verifiedBy: 'Admin Supervisor',
    documents: [
      { name: 'UGC_Deemed_University_Decree.pdf', size: '1.9 MB', type: 'Accreditation', verified: true },
    ],
    notes: 'Active for all 3 Indian campuses (Pilani, Goa, Hyderabad).',
  },
  {
    id: 'uni-6',
    name: 'Greenfield Valley Institute of Tech',
    country: 'United States',
    state: 'Nevada',
    accreditationBoard: 'Unaccredited / State Registered Only',
    ranking: 'Unranked',
    batchCapacity: 450,
    deanName: 'Arthur Vance',
    deanEmail: 'admissions@greenfield-tech.biz',
    phone: '+1 (702) 555-0199',
    domain: 'greenfield-tech.biz',
    status: 'rejected',
    submittedDate: '2026-10-18',
    verifiedDate: null,
    verifiedBy: 'Admin Supervisor',
    rejectionReason: 'Failed regional institutional accreditation check; business email domain lacks official edu classification.',
    documents: [
      { name: 'State_Business_Filing.pdf', size: '640 KB', type: 'Charter', verified: false },
    ],
    notes: 'Rejected due to credential deficiency.',
  },
];

const INITIAL_COMPANIES = [
  {
    id: 'cmp-1',
    name: 'Stripe Technologies Inc.',
    logo: '💳',
    industry: 'Financial Technology & Payments',
    headquarters: 'San Francisco, CA & Dublin, Ireland',
    taxId: 'EIN-84-2938472',
    corporateDomains: ['stripe.com', 'stripe.me'],
    recruiterName: 'David Kim',
    recruiterTitle: 'Head of Early Career Talent',
    recruiterEmail: 'david.kim@stripe.com',
    phone: '+1 (415) 555-0142',
    status: 'pending',
    submittedDate: '2026-10-27',
    verifiedDate: null,
    verifiedBy: null,
    rejectionReason: null,
    documents: [
      { name: 'Delaware_Certificate_of_Good_Standing.pdf', size: '1.4 MB', type: 'Certificate of Incorporation' },
      { name: 'IRS_Tax_Registration_EIN_Letter.pdf', size: '780 KB', type: 'Tax ID' },
      { name: 'Corporate_Domain_Ownership_Affidavit.pdf', size: '520 KB', type: 'Domain Authorization' },
    ],
    notes: 'Requested access to 40+ engineering college placement drives.',
  },
  {
    id: 'cmp-2',
    name: 'Anthropic PBC',
    logo: '🧠',
    industry: 'Artificial Intelligence & Safety Research',
    headquarters: 'San Francisco, CA',
    taxId: 'EIN-87-1928374',
    corporateDomains: ['anthropic.com'],
    recruiterName: 'Elena Rostova',
    recruiterTitle: 'Director of University Programs',
    recruiterEmail: 'elena@anthropic.com',
    phone: '+1 (415) 555-0891',
    status: 'pending',
    submittedDate: '2026-10-29',
    verifiedDate: null,
    verifiedBy: null,
    rejectionReason: null,
    documents: [
      { name: 'California_Public_Benefit_Corp_Filing.pdf', size: '2.1 MB', type: 'Certificate of Incorporation' },
      { name: 'W9_Taxpayer_Identification_Certificate.pdf', size: '640 KB', type: 'Tax ID' },
    ],
    notes: 'Prioritized hiring for AI Research Residency 2026 cohorts.',
  },
  {
    id: 'cmp-3',
    name: 'Google LLC',
    logo: '🔍',
    industry: 'Internet, Cloud & Hardware',
    headquarters: 'Mountain View, CA',
    taxId: 'EIN-94-3285621',
    corporateDomains: ['google.com', 'alphabet.com'],
    recruiterName: 'Sarah Jenkins',
    recruiterTitle: 'Lead University Recruiter',
    recruiterEmail: 'sjenkins@google.com',
    phone: '+1 (650) 253-0000',
    status: 'approved',
    submittedDate: '2026-08-15',
    verifiedDate: '2026-08-18',
    verifiedBy: 'Admin Supervisor',
    rejectionReason: null,
    documents: [
      { name: 'Google_Enterprise_Operating_Charter.pdf', size: '3.5 MB', type: 'Certificate of Incorporation' },
    ],
    notes: 'Verified global Tier-1 employer partner.',
  },
  {
    id: 'cmp-4',
    name: 'Microsoft Corporation',
    logo: '💻',
    industry: 'Software, Cloud & Hardware',
    headquarters: 'Redmond, WA',
    taxId: 'EIN-91-1144442',
    corporateDomains: ['microsoft.com', 'linkedin.com'],
    recruiterName: 'Jessica Lee',
    recruiterTitle: 'Campus Talent Partner',
    recruiterEmail: 'jessica.lee@microsoft.com',
    phone: '+1 (425) 882-8080',
    status: 'approved',
    submittedDate: '2026-07-12',
    verifiedDate: '2026-07-14',
    verifiedBy: 'Admin Supervisor',
    documents: [
      { name: 'Microsoft_Washington_Charter.pdf', size: '2.9 MB', type: 'Certificate of Incorporation' },
    ],
    notes: 'Active placement drives across 85 partner universities.',
  },
  {
    id: 'cmp-5',
    name: 'DataMatrix Global Consulting',
    logo: '🌐',
    industry: 'IT Staffing & Outsourcing',
    headquarters: 'Dallas, TX',
    taxId: 'EIN-75-8837192',
    corporateDomains: ['datamatrix-staffing.net'],
    recruiterName: 'Kevin Brown',
    recruiterTitle: 'Talent Acquisition Coordinator',
    recruiterEmail: 'k.brown@gmail.com', // Flagged email
    phone: '+1 (214) 555-0177',
    status: 'rejected',
    submittedDate: '2026-10-14',
    verifiedDate: null,
    verifiedBy: 'Admin Supervisor',
    rejectionReason: 'Recruiter official email mismatch (gmail address used instead of verified corporate domain); tax ID registered to inactive entity.',
    documents: [
      { name: 'Generic_State_Business_Cert.pdf', size: '420 KB', type: 'Tax ID' },
    ],
    notes: 'Account flagged and recruiter de-listed.',
  },
];

const INITIAL_LISTINGS = [
  {
    id: 'job-101',
    title: 'Staff Machine Learning Engineer (Core Inference)',
    company: 'Stripe Technologies Inc.',
    companyId: 'cmp-1',
    type: 'Full-time',
    location: 'San Francisco, CA (Hybrid)',
    compensation: '$210,000 - $265,000 / yr + Equity',
    postedDate: '2026-10-28',
    status: 'live', // 'live' | 'flagged' | 'taken_down'
    flags: [],
    riskLevel: 'none',
    applicantCount: 42,
    driveLinked: 'Multi-Campus Drive 2026',
    description: 'Lead engineering on our lowest-latency transaction anomaly detection systems with Python, PyTorch, and distributed C++ inference kernels.',
  },
  {
    id: 'job-102',
    title: 'Summer 2027 Software Engineering Intern',
    company: 'Google LLC',
    companyId: 'cmp-3',
    type: 'Internship',
    location: 'Mountain View, CA / New York, NY',
    compensation: '$58 / hr + Housing Stipend',
    postedDate: '2026-10-25',
    status: 'live',
    flags: [],
    riskLevel: 'none',
    applicantCount: 388,
    driveLinked: 'Global Tech Campus Blitz',
    description: 'Work alongside Google engineers building large-scale distributed systems, search ranking models, and Chrome browser optimizations.',
  },
  {
    id: 'job-103',
    title: 'Data Science Graduate Associate (Campus Exclusive)',
    company: 'Anthropic PBC',
    companyId: 'cmp-2',
    type: 'Full-time',
    location: 'San Francisco, CA (In-Office)',
    compensation: '$180,000 - $220,000 / yr',
    postedDate: '2026-10-30',
    status: 'flagged',
    flags: [
      {
        reason: 'Recruiter employer verification pending completion',
        detectedBy: 'Trust & Safety Engine',
        timestamp: '2026-10-30 09:12',
        severity: 'low',
      },
    ],
    riskLevel: 'low',
    applicantCount: 19,
    driveLinked: 'Stanford & Berkeley Joint Drive',
    description: 'Benchmark evaluation pipelines for frontier constitutional AI safety models. Strong background in mathematical statistics required.',
  },
  {
    id: 'job-104',
    title: 'Remote Data Entry & Form Reviewer ($350/day Immediate Hire)',
    company: 'SwiftJobs Network LLC',
    companyId: null,
    type: 'Part-time',
    location: 'Remote (Worldwide)',
    compensation: '$350 - $500 / day',
    postedDate: '2026-10-29',
    status: 'flagged',
    flags: [
      {
        reason: 'Unrealistic compensation for entry-level tasks; redirects applicants to third-party Telegram channel for fee collection',
        detectedBy: 'Anti-Scam Heuristic Scanner + 7 Student Reports',
        timestamp: '2026-10-29 14:40',
        severity: 'high',
      },
    ],
    riskLevel: 'high',
    applicantCount: 64,
    driveLinked: 'Public Portal',
    description: 'Simple data copying and typing from home. No experience needed. Immediate payout via gift card or wire transfer upon completion of deposit.',
  },
  {
    id: 'job-105',
    title: 'Full Stack Developer Intern (Unpaid Full-Time 60hr/week)',
    company: 'HyperGrowth Launchpad Inc.',
    companyId: null,
    type: 'Internship',
    location: 'Remote',
    compensation: 'Unpaid (Equity-only upon Series A)',
    postedDate: '2026-10-27',
    status: 'flagged',
    flags: [
      {
        reason: 'Labor regulation policy violation: Full-time unpaid role exceeding student weekly hour caps (60hr/wk)',
        detectedBy: 'Student Welfare Policy Filter',
        timestamp: '2026-10-27 18:20',
        severity: 'medium',
      },
    ],
    riskLevel: 'medium',
    applicantCount: 8,
    driveLinked: 'Public Portal',
    description: 'Fast-paced stealth startup looking for rockstar junior engineer to build entire iOS and React frontend from scratch without compensation.',
  },
  {
    id: 'job-106',
    title: 'Crypto Ambassador & Referral Promoter',
    company: 'Apex Tokenomics Ltd',
    companyId: null,
    type: 'Contract',
    location: 'Remote',
    compensation: 'Commission only (Tiered Referrals)',
    postedDate: '2026-10-20',
    status: 'taken_down',
    flags: [
      {
        reason: 'Multi-level marketing / token pyramid scheme referral violations',
        detectedBy: 'Moderator Review (Taken Down)',
        timestamp: '2026-10-21 11:05',
        severity: 'high',
      },
    ],
    riskLevel: 'high',
    applicantCount: 5,
    driveLinked: 'Public Portal',
    description: 'Recruit your classmates to buy trading tokens and earn a 12% cut on every referral wallet activation.',
  },
];

const INITIAL_AUDIT_LOGS = [
  {
    id: 'aud-1',
    action: 'Listing Flagged',
    target: 'SwiftJobs Network - Remote Data Entry ($350/day)',
    actor: 'Trust & Safety Bot',
    timestamp: '15 mins ago',
    type: 'warning',
    details: 'Triggered anti-scam wire transfer heuristic pattern and 7 student reports.',
  },
  {
    id: 'aud-2',
    action: 'University Verified',
    target: 'National University of Singapore (NUS)',
    actor: 'Admin Supervisor',
    timestamp: '3 hours ago',
    type: 'success',
    details: 'Accreditation board WASC/MOE credentials validated and charter verified.',
  },
  {
    id: 'aud-3',
    action: 'User Role Updated',
    target: 'David Kim (david.kim@stripe.com)',
    actor: 'Admin Supervisor',
    timestamp: '5 hours ago',
    type: 'info',
    details: 'Role escalated to Verified Employer Recruiter for Stripe early talent.',
  },
  {
    id: 'aud-4',
    action: 'Employer Rejected',
    target: 'DataMatrix Global Consulting',
    actor: 'Admin Supervisor',
    timestamp: 'Yesterday at 16:30',
    type: 'error',
    details: 'Rejected due to personal gmail recruiter domain and inactive EIN filing.',
  },
  {
    id: 'aud-5',
    action: 'Listing Taken Down',
    target: 'Apex Tokenomics - Crypto Ambassador',
    actor: 'Admin Supervisor',
    timestamp: '2 days ago',
    type: 'error',
    details: 'Violates platform commercial recruitment guidelines (MLM token model).',
  },
  {
    id: 'aud-6',
    action: 'Report Generated',
    target: 'Placement_Success_Summary_Q3.csv',
    actor: 'Admin Supervisor',
    timestamp: '2 days ago',
    type: 'info',
    details: 'Automated quarterly platform placement analytics export generated.',
  },
  {
    id: 'aud-7',
    action: 'User Account Suspended',
    target: 'Kevin Brown (k.brown@gmail.com)',
    actor: 'Admin Supervisor',
    timestamp: '3 days ago',
    type: 'error',
    details: 'Suspicious recruiter listing creation and identity misrepresentation.',
  },
];

// Helper to safely read from localStorage
function readStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.warn(`[adminStorage] Failed to read ${key}:`, err);
    return fallback;
  }
}

// Helper to write to localStorage
function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`[adminStorage] Failed to write ${key}:`, err);
  }
}

export const adminStorage = {
  // --- USERS ---
  getUsers() {
    return readStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  },
  saveUsers(users) {
    writeStorage(STORAGE_KEYS.USERS, users);
    return users;
  },
  updateUser(id, updates) {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
      return users[index];
    }
    return null;
  },
  addUser(newUser) {
    const users = this.getUsers();
    const user = {
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      status: 'active',
      ...newUser,
    };
    users.unshift(user);
    this.saveUsers(users);
    return user;
  },
  deleteUser(id) {
    const users = this.getUsers().filter((u) => u.id !== id);
    this.saveUsers(users);
    return true;
  },

  // --- UNIVERSITIES ---
  getUniversities() {
    return readStorage(STORAGE_KEYS.UNIVERSITIES, INITIAL_UNIVERSITIES);
  },
  saveUniversities(unis) {
    writeStorage(STORAGE_KEYS.UNIVERSITIES, unis);
    return unis;
  },
  updateUniversity(id, updates) {
    const unis = this.getUniversities();
    const index = unis.findIndex((u) => u.id === id);
    if (index !== -1) {
      unis[index] = { ...unis[index], ...updates };
      this.saveUniversities(unis);
      return unis[index];
    }
    return null;
  },

  // --- COMPANIES ---
  getCompanies() {
    return readStorage(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  },
  saveCompanies(companies) {
    writeStorage(STORAGE_KEYS.COMPANIES, companies);
    return companies;
  },
  updateCompany(id, updates) {
    const companies = this.getCompanies();
    const index = companies.findIndex((c) => c.id === id);
    if (index !== -1) {
      companies[index] = { ...companies[index], ...updates };
      this.saveCompanies(companies);
      return companies[index];
    }
    return null;
  },

  // --- LISTINGS ---
  getListings() {
    return readStorage(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  },
  saveListings(listings) {
    writeStorage(STORAGE_KEYS.LISTINGS, listings);
    return listings;
  },
  updateListing(id, updates) {
    const listings = this.getListings();
    const index = listings.findIndex((l) => l.id === id);
    if (index !== -1) {
      listings[index] = { ...listings[index], ...updates };
      this.saveListings(listings);
      return listings[index];
    }
    return null;
  },

  // --- AUDIT LOGS ---
  getAuditLogs() {
    return readStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },
  addAuditLog(entry) {
    const logs = this.getAuditLogs();
    const newEntry = {
      id: `aud-${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Admin Supervisor',
      type: 'info',
      ...entry,
    };
    logs.unshift(newEntry);
    writeStorage(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 50)); // keep last 50
    return newEntry;
  },

  // --- PLATFORM METRICS COMPUTATION ---
  getPlatformMetrics() {
    const users = this.getUsers();
    const universities = this.getUniversities();
    const companies = this.getCompanies();
    const listings = this.getListings();

    const verifiedUnis = universities.filter((u) => u.status === 'approved').length;
    const pendingUnis = universities.filter((u) => u.status === 'pending').length;

    const verifiedCompanies = companies.filter((c) => c.status === 'approved').length;
    const pendingCompanies = companies.filter((c) => c.status === 'pending').length;

    const flaggedListings = listings.filter((l) => l.status === 'flagged').length;
    const liveListings = listings.filter((l) => l.status === 'live').length;

    return {
      totalUsers: 24850 + (users.length - INITIAL_USERS.length),
      userCountDisplay: '24,850',
      userGrowth: '+14.2% MoM',
      verifiedUniversities: verifiedUnis,
      pendingUniversities: pendingUnis,
      verifiedCompanies: verifiedCompanies,
      pendingCompanies: pendingCompanies,
      totalPlacements: '18,920',
      placementGrowth: '+8.4% MoM',
      systemHealth: '99.98%',
      apiLatency: '42ms',
      flaggedListings,
      liveListings,
    };
  },

  // --- RESET ALL ---
  resetToDefaults() {
    writeStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    writeStorage(STORAGE_KEYS.UNIVERSITIES, INITIAL_UNIVERSITIES);
    writeStorage(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    writeStorage(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
    writeStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    return true;
  },
};

export default adminStorage;
