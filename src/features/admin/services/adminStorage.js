// src/features/admin/services/adminStorage.js
// Real persistent storage service for Platform Administrator Portal

const STORAGE_KEYS = {
  USERS: 'insight_admin_users_v2',
  UNIVERSITIES: 'insight_admin_universities_v2',
  COMPANIES: 'insight_admin_companies_v2',
  LISTINGS: 'insight_admin_listings_v2',
  AUDIT_LOGS: 'insight_admin_audit_logs_v2',
  REPORTS: 'insight_admin_reports_v2',
};

// No false or sample mock data — starts completely clean
const INITIAL_USERS = [];
const INITIAL_UNIVERSITIES = [];
const INITIAL_COMPANIES = [];
const INITIAL_LISTINGS = [];
const INITIAL_AUDIT_LOGS = [];

// Helper to safely read from localStorage
function readStorage(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : fallback;
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
    this.addAuditLog({
      action: 'User Registered',
      target: `${user.name || user.email} (${user.role})`,
      type: 'info',
      details: `User profile created for ${user.organization || 'Individual'}.`,
    });
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
  addUniversity(newUni) {
    const unis = this.getUniversities();
    const uni = {
      id: `uni-${Date.now()}`,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      verifiedDate: null,
      verifiedBy: null,
      documents: [],
      ...newUni,
    };
    unis.unshift(uni);
    this.saveUniversities(unis);
    this.addAuditLog({
      action: 'University Inquiry Submitted',
      target: uni.name || 'New University',
      type: 'info',
      details: `Institutional verification request received from ${uni.deanEmail || uni.email || 'partner'}.`,
    });
    return uni;
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
  addCompany(newCmp) {
    const companies = this.getCompanies();
    const cmp = {
      id: `cmp-${Date.now()}`,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      verifiedDate: null,
      verifiedBy: null,
      documents: [],
      ...newCmp,
    };
    companies.unshift(cmp);
    this.saveCompanies(companies);
    this.addAuditLog({
      action: 'Employer Inquiry Submitted',
      target: cmp.name || 'New Employer',
      type: 'info',
      details: `Recruiter partner verification request received from ${cmp.recruiterEmail || cmp.email || 'recruiter'}.`,
    });
    return cmp;
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
  addListing(newListing) {
    const listings = this.getListings();
    const listing = {
      id: `job-${Date.now()}`,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'live',
      flags: [],
      riskLevel: 'none',
      applicantCount: 0,
      ...newListing,
    };
    listings.unshift(listing);
    this.saveListings(listings);
    return listing;
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
      actor: 'Platform Administrator',
      type: 'info',
      ...entry,
    };
    logs.unshift(newEntry);
    writeStorage(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100)); // keep last 100
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
      totalUsers: users.length,
      userCountDisplay: users.length.toLocaleString(),
      userGrowth: 'Live Data',
      verifiedUniversities: verifiedUnis,
      pendingUniversities: pendingUnis,
      verifiedCompanies: verifiedCompanies,
      pendingCompanies: pendingCompanies,
      totalPlacements: '0',
      placementGrowth: 'Live',
      systemHealth: '100% Operational',
      apiLatency: 'Normal',
      flaggedListings,
      liveListings,
    };
  },

  // --- RESET ALL TO CLEAN STATE ---
  resetToDefaults() {
    writeStorage(STORAGE_KEYS.USERS, []);
    writeStorage(STORAGE_KEYS.UNIVERSITIES, []);
    writeStorage(STORAGE_KEYS.COMPANIES, []);
    writeStorage(STORAGE_KEYS.LISTINGS, []);
    writeStorage(STORAGE_KEYS.AUDIT_LOGS, []);
    return true;
  },
};

export default adminStorage;
