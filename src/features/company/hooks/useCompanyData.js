/**
 * Hook for subscribing to company data state and mutations.
 */
import { useState, useEffect, useCallback } from 'react';
import * as storage from '../services/companyStorage';

export function useCompanyData() {
  const [jobs, setJobs] = useState(() => storage.getJobs());
  const [candidates, setCandidates] = useState(() => storage.getCandidates());
  const [universities, setUniversities] = useState(() => storage.getUniversities());
  const [drives, setDrives] = useState(() => storage.getCampusDrives());
  const [batches, setBatches] = useState(() => storage.getVerifiedCampusBatches());
  const [profile, setProfile] = useState(() => storage.getCompanyProfile());
  const [metrics, setMetrics] = useState(() => storage.getHiringMetrics());

  const refresh = useCallback(() => {
    setJobs(storage.getJobs());
    setCandidates(storage.getCandidates());
    setUniversities(storage.getUniversities());
    setDrives(storage.getCampusDrives());
    setBatches(storage.getVerifiedCampusBatches());
    setProfile(storage.getCompanyProfile());
    setMetrics(storage.getHiringMetrics());
  }, []);

  useEffect(() => {
    const handleSync = () => {
      refresh();
    };

    window.addEventListener(storage.COMPANY_DATA_CHANGED_EVENT, handleSync);
    window.addEventListener('storage', handleSync);

    return () => {
      window.removeEventListener(storage.COMPANY_DATA_CHANGED_EVENT, handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [refresh]);

  return {
    jobs,
    candidates,
    universities,
    drives,
    batches,
    profile,
    metrics,
    refresh,
    // Actions
    saveJob: storage.saveJob,
    getJobById: storage.getJobById,
    toggleJobStatus: storage.toggleJobStatus,
    deleteJob: storage.deleteJob,
    updateCandidateStatus: storage.updateCandidateStatus,
    addCandidate: storage.addCandidate,
    saveCompanyProfile: storage.saveCompanyProfile,
    addRecruiter: storage.addRecruiter,
    removeRecruiter: storage.removeRecruiter,
    toggleDriveParticipation: storage.toggleDriveParticipation,
    registerCampusDrive: storage.registerCampusDrive,
    toggleUniversityPartner: storage.toggleUniversityPartner,
    resetCompanyData: storage.resetCompanyData,
  };
}

export default useCompanyData;
