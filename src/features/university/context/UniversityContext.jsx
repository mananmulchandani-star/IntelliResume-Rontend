import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  INITIAL_STUDENTS,
  INITIAL_DRIVES,
  INITIAL_COMPANIES,
  INITIAL_UNIVERSITY_SETTINGS,
  ANALYTICS_TRENDS,
  SALARY_DISTRIBUTION,
  DEPARTMENT_STATS,
} from '../data/mockData';

const UniversityContext = createContext(null);
const STORAGE_KEY = 'insight_resume_university_state_v1';

export function UniversityProvider({ children }) {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [drives, setDrives] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_drives`);
      return saved ? JSON.parse(saved) : INITIAL_DRIVES;
    } catch {
      return INITIAL_DRIVES;
    }
  });

  const [companies, setCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_companies`);
      return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
    } catch {
      return INITIAL_COMPANIES;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return saved ? JSON.parse(saved) : INITIAL_UNIVERSITY_SETTINGS;
    } catch {
      return INITIAL_UNIVERSITY_SETTINGS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
    } catch (e) {
      console.warn('Failed saving students to localStorage', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_drives`, JSON.stringify(drives));
    } catch (e) {
      console.warn('Failed saving drives to localStorage', e);
    }
  }, [drives]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_companies`, JSON.stringify(companies));
    } catch (e) {
      console.warn('Failed saving companies to localStorage', e);
    }
  }, [companies]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed saving settings to localStorage', e);
    }
  }, [settings]);

  // Student Actions
  const addStudent = useCallback((newStudent) => {
    const student = {
      id: `std-${Date.now().toString().slice(-4)}`,
      status: 'Eligible',
      backlogs: Number(newStudent.backlogs || 0),
      cgpa: Number(newStudent.cgpa || 7.0),
      resumeScore: Math.floor(Math.random() * 20) + 75,
      skills: Array.isArray(newStudent.skills) ? newStudent.skills : (newStudent.skills || '').split(',').map(s => s.trim()).filter(Boolean),
      avatar: newStudent.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      placedCompany: null,
      packageCtc: null,
      ...newStudent,
    };
    setStudents((prev) => [student, ...prev]);
    return student;
  }, []);

  const bulkAddStudents = useCallback((studentsList) => {
    const formatted = studentsList.map((item, index) => ({
      id: `std-${Date.now().toString().slice(-4)}-${index}`,
      name: item.name || 'Candidate',
      rollNo: item.rollNo || `21CS${Math.floor(Math.random() * 800) + 100}`,
      email: item.email || `student.${index}@itas.edu.in`,
      phone: item.phone || '+91 98000 00000',
      department: item.department || 'Computer Science & Engineering',
      degree: item.degree || 'B.Tech',
      batch: item.batch || '2025',
      cgpa: Number(item.cgpa || 7.5),
      backlogs: Number(item.backlogs || 0),
      status: item.status || 'Eligible',
      resumeScore: Number(item.resumeScore || Math.floor(Math.random() * 25) + 70),
      skills: Array.isArray(item.skills) ? item.skills : (item.skills || 'Python, Git').split(',').map(s => s.trim()).filter(Boolean),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      placedCompany: item.placedCompany || null,
      packageCtc: item.packageCtc || null,
    }));
    setStudents((prev) => [...formatted, ...prev]);
    return formatted.length;
  }, []);

  const updateStudent = useCallback((id, updates) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const deleteStudent = useCallback((id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Drive Actions
  const addDrive = useCallback((newDrive) => {
    const drive = {
      id: `drv-${Date.now().toString().slice(-4)}`,
      companyLogoBg: 'bg-white',
      status: newDrive.status || 'Active',
      type: newDrive.type || 'Full-time',
      applicants: [],
      rounds: [
        { name: 'Online Assessment', date: 'TBA', type: 'OA' },
        { name: 'Technical Interview', date: 'TBA', type: 'Interview' },
        { name: 'HR / Final Round', date: 'TBA', type: 'HR' },
      ],
      ...newDrive,
    };
    setDrives((prev) => [drive, ...prev]);
    return drive;
  }, []);

  const updateDrive = useCallback((id, updates) => {
    setDrives((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
    );
  }, []);

  const deleteDrive = useCallback((id) => {
    setDrives((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // Candidate Stage Management in Drive
  const updateApplicantStage = useCallback((driveId, studentId, newStage, feedback = '') => {
    setDrives((prevDrives) =>
      prevDrives.map((drive) => {
        if (drive.id !== driveId) return drive;

        const updatedApplicants = (drive.applicants || []).map((applicant) => {
          if (applicant.studentId === studentId) {
            return {
              ...applicant,
              stage: newStage,
              feedback: feedback || applicant.feedback,
            };
          }
          return applicant;
        });

        return {
          ...drive,
          applicants: updatedApplicants,
        };
      })
    );

    // If candidate is "Selected", update student status to Placed
    if (newStage === 'Selected') {
      const targetDrive = drives.find((d) => d.id === driveId);
      if (targetDrive) {
        setStudents((prevStudents) =>
          prevStudents.map((s) =>
            s.id === studentId
              ? {
                  ...s,
                  status: 'Placed',
                  placedCompany: targetDrive.companyName,
                  packageCtc: targetDrive.packageCtc,
                }
              : s
          )
        );
      }
    }
  }, [drives]);

  const addApplicantToDrive = useCallback((driveId, student) => {
    setDrives((prevDrives) =>
      prevDrives.map((drive) => {
        if (drive.id !== driveId) return drive;
        const exists = (drive.applicants || []).some((a) => a.studentId === student.id);
        if (exists) return drive;

        const newApplicant = {
          studentId: student.id,
          name: student.name,
          rollNo: student.rollNo,
          email: student.email,
          department: student.department,
          cgpa: student.cgpa,
          backlogs: student.backlogs,
          stage: 'Registered',
          appliedDate: new Date().toISOString().split('T')[0],
          resumeScore: student.resumeScore || 80,
          feedback: 'Directly enrolled via Placement Portal.',
        };

        return {
          ...drive,
          applicants: [newApplicant, ...(drive.applicants || [])],
        };
      })
    );
  }, []);

  // Company Actions
  const addCompany = useCallback((newCompany) => {
    const comp = {
      id: `comp-${Date.now().toString().slice(-4)}`,
      verificationStatus: 'Verified',
      activeDrivesCount: 0,
      totalHires: 0,
      avgPackage: newCompany.avgPackage || '₹14.0 LPA',
      highestPackage: newCompany.highestPackage || '₹20.0 LPA',
      moUStatus: 'Active MoU (2025-2028)',
      lastVisited: 'Recent Partner',
      ...newCompany,
    };
    setCompanies((prev) => [comp, ...prev]);
    return comp;
  }, []);

  const inviteCompany = useCallback((inviteDetails) => {
    const invitedComp = {
      id: `comp-inv-${Date.now().toString().slice(-4)}`,
      name: inviteDetails.name,
      industry: inviteDetails.industry || 'Technology',
      tier: inviteDetails.tier || 'Tier 2 / Dream',
      verificationStatus: 'Pending Verification',
      website: inviteDetails.website || 'https://company.example.com',
      location: inviteDetails.location || 'Bangalore / Remote',
      contactPerson: {
        name: inviteDetails.contactName,
        email: inviteDetails.contactEmail,
        designation: inviteDetails.designation || 'Campus Recruiter',
        phone: inviteDetails.contactPhone || '+91 99000 00000',
      },
      activeDrivesCount: 0,
      totalHires: 0,
      avgPackage: inviteDetails.packageEstimate || '₹18.0 LPA',
      highestPackage: inviteDetails.packageEstimate || '₹24.0 LPA',
      moUStatus: 'Invitation Sent',
      lastVisited: 'Invited Recently',
    };
    setCompanies((prev) => [invitedComp, ...prev]);
    return invitedComp;
  }, []);

  const updateCompany = useCallback((id, updates) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  // Settings Actions
  const updateUniversityProfile = useCallback((profileUpdates) => {
    setSettings((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...profileUpdates,
      },
    }));
  }, []);

  const addDepartment = useCallback((dept) => {
    const newDept = {
      id: `dept-${Date.now().toString().slice(-4)}`,
      totalStudents: 120,
      ...dept,
    };
    setSettings((prev) => ({
      ...prev,
      departments: [...prev.departments, newDept],
    }));
  }, []);

  const removeDepartment = useCallback((id) => {
    setSettings((prev) => ({
      ...prev,
      departments: prev.departments.filter((d) => d.id !== id),
    }));
  }, []);

  const addBatch = useCallback((batch) => {
    const newBatch = {
      id: `bch-${Date.now().toString().slice(-4)}`,
      enrolled: Number(batch.enrolled || 800),
      placed: Number(batch.placed || 0),
      placementRate: Number(batch.enrolled) ? Math.round(((Number(batch.placed || 0)) / Number(batch.enrolled)) * 100 * 10) / 10 : 0,
      status: 'Active',
      ...batch,
    };
    setSettings((prev) => ({
      ...prev,
      batches: [newBatch, ...prev.batches],
    }));
  }, []);

  const toggleBatchStatus = useCallback((id) => {
    setSettings((prev) => ({
      ...prev,
      batches: prev.batches.map((b) =>
        b.id === id ? { ...b, status: b.status.includes('Active') ? 'Archived' : 'Active' } : b
      ),
    }));
  }, []);

  const addStaff = useCallback((staffMember) => {
    const staff = {
      id: `stf-${Date.now().toString().slice(-4)}`,
      status: 'Active',
      ...staffMember,
    };
    setSettings((prev) => ({
      ...prev,
      staff: [...prev.staff, staff],
    }));
  }, []);

  const removeStaff = useCallback((id) => {
    setSettings((prev) => ({
      ...prev,
      staff: prev.staff.filter((s) => s.id !== id),
    }));
  }, []);

  // Reset demo data
  const resetToDefaults = useCallback(() => {
    setStudents(INITIAL_STUDENTS);
    setDrives(INITIAL_DRIVES);
    setCompanies(INITIAL_COMPANIES);
    setSettings(INITIAL_UNIVERSITY_SETTINGS);
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_drives`);
    localStorage.removeItem(`${STORAGE_KEY}_companies`);
    localStorage.removeItem(`${STORAGE_KEY}_settings`);
  }, []);

  // Computed KPI Metrics
  const kpis = useMemo(() => {
    const totalStudents = students.length;
    const placedStudents = students.filter((s) => s.status === 'Placed').length;
    const eligibleStudents = students.filter((s) => s.cgpa >= 6.5 && s.backlogs === 0).length;
    const placementRate = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;
    const activeDrives = drives.filter((d) => d.status === 'Active').length;
    const upcomingDrives = drives.filter((d) => d.status === 'Upcoming').length;
    const partnerCompaniesCount = companies.length;

    // Total placement offers generated
    const totalOffers = students.filter((s) => s.status === 'Placed').length + 18; // Includes multi-offers

    return {
      totalStudents,
      placedStudents,
      eligibleStudents,
      placementRate,
      activeDrives,
      upcomingDrives,
      partnerCompaniesCount,
      totalOffers,
      highestPackage: '₹54.0 LPA',
      avgPackage: '₹17.8 LPA',
    };
  }, [students, drives, companies]);

  const value = useMemo(
    () => ({
      students,
      drives,
      companies,
      settings,
      kpis,
      analyticsTrends: ANALYTICS_TRENDS,
      salaryDistribution: SALARY_DISTRIBUTION,
      departmentStats: DEPARTMENT_STATS,
      addStudent,
      bulkAddStudents,
      updateStudent,
      deleteStudent,
      addDrive,
      updateDrive,
      deleteDrive,
      updateApplicantStage,
      addApplicantToDrive,
      addCompany,
      inviteCompany,
      updateCompany,
      updateUniversityProfile,
      addDepartment,
      removeDepartment,
      addBatch,
      toggleBatchStatus,
      addStaff,
      removeStaff,
      resetToDefaults,
    }),
    [
      students,
      drives,
      companies,
      settings,
      kpis,
      addStudent,
      bulkAddStudents,
      updateStudent,
      deleteStudent,
      addDrive,
      updateDrive,
      deleteDrive,
      updateApplicantStage,
      addApplicantToDrive,
      addCompany,
      inviteCompany,
      updateCompany,
      updateUniversityProfile,
      addDepartment,
      removeDepartment,
      addBatch,
      toggleBatchStatus,
      addStaff,
      removeStaff,
      resetToDefaults,
    ]
  );

  return (
    <UniversityContext.Provider value={value}>
      {children}
    </UniversityContext.Provider>
  );
}

export { useUniversity } from '../hooks/useUniversity';
export default UniversityContext;
