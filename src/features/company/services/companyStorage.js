/**
 * LocalStorage Service for Recruiter & Employer Portal
 * Provides persistent CRUD operations and reactive event dispatching.
 */

import {
  INITIAL_COMPANY_PROFILE,
  INITIAL_JOBS,
  INITIAL_CANDIDATES,
  INITIAL_UNIVERSITIES,
  INITIAL_CAMPUS_DRIVES,
  INITIAL_VERIFIED_CAMPUS_BATCHES,
} from '../data/mockCompanyData';

const STORAGE_KEYS = {
  PROFILE: 'insight_company_profile_v2',
  JOBS: 'insight_company_jobs_v2',
  CANDIDATES: 'insight_company_candidates_v2',
  UNIVERSITIES: 'insight_company_universities_v2',
  DRIVES: 'insight_company_drives_v2',
  BATCHES: 'insight_company_batches_v2',
};

export const COMPANY_DATA_CHANGED_EVENT = 'insight_company_data_changed';

function emitChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(COMPANY_DATA_CHANGED_EVENT));
  }
}

// Helper: safe JSON parsing
function getStoredItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    if (parsed === null || parsed === undefined) return fallback;
    if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
    return parsed;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
}

function setStoredItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    emitChange();
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

/* ============================================================
   Company Profile
   ============================================================ */
export function getCompanyProfile() {
  return getStoredItem(STORAGE_KEYS.PROFILE, INITIAL_COMPANY_PROFILE);
}

export function saveCompanyProfile(profile) {
  const updated = { ...getCompanyProfile(), ...profile };
  setStoredItem(STORAGE_KEYS.PROFILE, updated);
  return updated;
}

export function addRecruiter(recruiter) {
  const profile = getCompanyProfile();
  const newRecruiter = {
    id: `rec_${Date.now()}`,
    status: 'Active',
    joinedDate: 'Just now',
    avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`,
    ...recruiter,
  };
  const updated = {
    ...profile,
    recruiters: [newRecruiter, ...(profile.recruiters || [])],
  };
  setStoredItem(STORAGE_KEYS.PROFILE, updated);
  return updated;
}

export function removeRecruiter(recruiterId) {
  const profile = getCompanyProfile();
  const updated = {
    ...profile,
    recruiters: (profile.recruiters || []).filter((r) => r.id !== recruiterId),
  };
  setStoredItem(STORAGE_KEYS.PROFILE, updated);
  return updated;
}

/* ============================================================
   Job Listings
   ============================================================ */
export function getJobs() {
  return getStoredItem(STORAGE_KEYS.JOBS, INITIAL_JOBS);
}

export function getJobById(jobId) {
  const jobs = getJobs();
  return jobs.find((j) => j.id === jobId) || null;
}

export function saveJob(jobData) {
  const jobs = getJobs();
  let updatedList;

  if (jobData.id) {
    // Update existing
    updatedList = jobs.map((j) => (j.id === jobData.id ? { ...j, ...jobData } : j));
  } else {
    // Create new
    const newJob = {
      ...jobData,
      id: `job-${Date.now().toString().slice(-4)}`,
      status: jobData.status || 'Active',
      applicantsCount: 0,
      postedDate: new Date().toISOString().split('T')[0],
      skills: jobData.skills || [],
    };
    updatedList = [newJob, ...jobs];
  }

  setStoredItem(STORAGE_KEYS.JOBS, updatedList);
  return updatedList;
}

export function toggleJobStatus(jobId) {
  const jobs = getJobs();
  const updated = jobs.map((j) => {
    if (j.id === jobId) {
      const nextStatus = j.status === 'Active' ? 'Paused' : 'Active';
      return { ...j, status: nextStatus };
    }
    return j;
  });
  setStoredItem(STORAGE_KEYS.JOBS, updated);
  return updated;
}

export function deleteJob(jobId) {
  const jobs = getJobs();
  const updated = jobs.filter((j) => j.id !== jobId);
  setStoredItem(STORAGE_KEYS.JOBS, updated);
  return updated;
}

/* ============================================================
   Candidates
   ============================================================ */
export function getCandidates() {
  return getStoredItem(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
}

export function getCandidateById(candidateId) {
  const candidates = getCandidates();
  return candidates.find((c) => c.id === candidateId) || null;
}

export function updateCandidateStatus(candidateId, newStatus, additionalData = {}) {
  const candidates = getCandidates();
  const updated = candidates.map((c) => {
    if (c.id === candidateId) {
      return {
        ...c,
        status: newStatus,
        ...additionalData,
      };
    }
    return c;
  });
  setStoredItem(STORAGE_KEYS.CANDIDATES, updated);
  return updated;
}

export function addCandidate(candidateData) {
  const candidates = getCandidates();
  const newCandidate = {
    ...candidateData,
    id: `cand-${Date.now().toString().slice(-4)}`,
    appliedDate: new Date().toISOString().split('T')[0],
    status: candidateData.status || 'Under Review',
    atsScore: candidateData.atsScore || Math.floor(Math.random() * 25) + 75,
    avatar:
      candidateData.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  };
  const updated = [newCandidate, ...candidates];
  setStoredItem(STORAGE_KEYS.CANDIDATES, updated);
  return updated;
}

/* ============================================================
   University Partnerships & Campus Drives
   ============================================================ */
export function getUniversities() {
  return getStoredItem(STORAGE_KEYS.UNIVERSITIES, INITIAL_UNIVERSITIES);
}

export function toggleUniversityPartner(univId) {
  const universities = getUniversities();
  const updated = universities.map((u) => {
    if (u.id === univId) {
      const nextStatus = u.status === 'Partnered' ? 'Pending Invite' : 'Partnered';
      return { ...u, status: nextStatus };
    }
    return u;
  });
  setStoredItem(STORAGE_KEYS.UNIVERSITIES, updated);
  return updated;
}

export function getCampusDrives() {
  return getStoredItem(STORAGE_KEYS.DRIVES, INITIAL_CAMPUS_DRIVES);
}

export function toggleDriveParticipation(driveId) {
  const drives = getCampusDrives();
  const updated = drives.map((d) => {
    if (d.id === driveId) {
      const isNowParticipating = !d.participating;
      return {
        ...d,
        participating: isNowParticipating,
        registeredStudents: isNowParticipating ? d.registeredStudents + 12 : Math.max(0, d.registeredStudents - 12),
      };
    }
    return d;
  });
  setStoredItem(STORAGE_KEYS.DRIVES, updated);
  return updated;
}

export function registerCampusDrive(driveData) {
  const drives = getCampusDrives();
  const newDrive = {
    ...driveData,
    id: `drive-${Date.now().toString().slice(-4)}`,
    status: 'Upcoming',
    registeredStudents: 0,
    shortlistedStudents: 0,
    participating: true,
  };
  const updated = [newDrive, ...drives];
  setStoredItem(STORAGE_KEYS.DRIVES, updated);
  return updated;
}

export function getVerifiedCampusBatches() {
  return getStoredItem(STORAGE_KEYS.BATCHES, INITIAL_VERIFIED_CAMPUS_BATCHES);
}

/* ============================================================
   Dynamic Hiring Metrics
   ============================================================ */
export function getHiringMetrics() {
  const jobs = Array.isArray(getJobs()) ? getJobs() : [];
  const candidates = Array.isArray(getCandidates()) ? getCandidates() : [];
  const drives = Array.isArray(getCampusDrives()) ? getCampusDrives() : [];

  const activeVacancies = jobs.filter((j) => j && j.status === 'Active').length;
  const totalApplicants = candidates.length;
  const inInterview = candidates.filter((c) => c && c.status === 'Interview').length;
  const offersExtended = candidates.filter((c) => c && c.status === 'Offered').length;
  const activeCampusDrives = drives.filter((d) => d && d.participating).length;

  return {
    activeVacancies,
    totalApplicants,
    inInterview,
    offersExtended,
    activeCampusDrives,
    timeToHireDays: 19,
    offerAcceptanceRate: '88%',
    avgAtsScore: Math.round(
      candidates.reduce((acc, c) => acc + (Number(c?.atsScore) || 80), 0) / (candidates.length || 1)
    ),
  };
}

/* ============================================================
   Reset Data
   ============================================================ */
export function resetCompanyData() {
  setStoredItem(STORAGE_KEYS.PROFILE, INITIAL_COMPANY_PROFILE);
  setStoredItem(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  setStoredItem(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
  setStoredItem(STORAGE_KEYS.UNIVERSITIES, INITIAL_UNIVERSITIES);
  setStoredItem(STORAGE_KEYS.DRIVES, INITIAL_CAMPUS_DRIVES);
  setStoredItem(STORAGE_KEYS.BATCHES, INITIAL_VERIFIED_CAMPUS_BATCHES);
  emitChange();
}
