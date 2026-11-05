// src/features/student/pages/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ROUTES } from '../../../constants/routes';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Button, Card, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, EmptyState } from '../../../components/ui';
import SkillVerificationModal from '../components/SkillVerificationModal';
import {
  Sparkles,
  FileText,
  ScanText,
  Briefcase,
  Award,
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { exportResumeDataToPDF } from '../../../utils/pdfGenerator';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [selectedSkillToVerify, setSelectedSkillToVerify] = useState(null);
  const [downloadingResumeId, setDownloadingResumeId] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    try {
      // 1. Resumes
      const savedResumes = localStorage.getItem('userResumes');
      if (savedResumes) {
        const parsed = JSON.parse(savedResumes);
        setResumes(Array.isArray(parsed) ? parsed : []);
      } else {
        setResumes([]);
      }

      // 2. Verified skills
      const savedVerified = localStorage.getItem('verifiedSkills');
      if (savedVerified) {
        const parsed = JSON.parse(savedVerified);
        setVerifiedSkills(Array.isArray(parsed) ? parsed : []);
      } else {
        setVerifiedSkills([]);
      }

      // 3. Applications
      const savedApps = localStorage.getItem('jobApplications');
      if (savedApps) {
        const parsed = JSON.parse(savedApps);
        setApplications(Array.isArray(parsed) ? parsed : []);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Error loading dashboard state from localStorage:', err);
    }
  }, []);

  const handleEditResume = (resume) => {
    localStorage.setItem('currentResume', JSON.stringify(resume));
    navigate(ROUTES.RESUME_EDITOR);
  };

  const handleDuplicateResume = (resumeToDup) => {
    const duplicated = {
      ...resumeToDup,
      id: `resume-${Date.now()}`,
      title: `${resumeToDup.title || 'Resume'} (Copy)`,
      lastModified: new Date().toISOString(),
    };
    const updated = [duplicated, ...resumes];
    setResumes(updated);
    localStorage.setItem('userResumes', JSON.stringify(updated));
  };

  const handleDeleteResume = (id) => {
    if (resumes.length <= 1) {
      alert('You must retain at least one resume.');
      return;
    }
    const updated = resumes.filter((r) => r.id !== id);
    setResumes(updated);
    localStorage.setItem('userResumes', JSON.stringify(updated));
  };

  const handleDownloadPDF = async (resume) => {
    try {
      setDownloadingResumeId(resume.id);
      await exportResumeDataToPDF(resume, verifiedSkills);
    } catch (err) {
      console.error('Failed to download resume PDF:', err);
      handleEditResume(resume);
    } finally {
      setDownloadingResumeId(null);
    }
  };

  const handleOpenVerifyModal = (skill = null) => {
    setSelectedSkillToVerify(skill);
    setIsVerifyModalOpen(true);
  };

  const handleVerificationComplete = (passedSkills) => {
    const merged = Array.from(new Set([...verifiedSkills, ...passedSkills]));
    setVerifiedSkills(merged);
    localStorage.setItem('verifiedSkills', JSON.stringify(merged));
  };

  const displayName = user?.name || user?.email?.split('@')[0] || 'Student';

  const safeResumes = Array.isArray(resumes) ? resumes : [];
  const safeVerifiedSkills = Array.isArray(verifiedSkills) ? verifiedSkills : [];
  const safeApplications = Array.isArray(applications) ? applications : [];

  // Calculate metrics
  const activeResumesCount = safeResumes.length;
  const verifiedCount = safeVerifiedSkills.length;
  const activeAppsCount = safeApplications.filter((a) => a && a.status !== 'Rejected').length;
  const avgATS = safeResumes.length
    ? Math.round(safeResumes.reduce((acc, curr) => acc + (Number(curr?.atsScore) || 85), 0) / safeResumes.length)
    : 85;

  return (
    <DashboardLayout
      title="Student Overview"
      subtitle={`Welcome back, ${displayName}. Track your career readiness, manage resumes, and accelerate placements.`}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
            onClick={() => handleOpenVerifyModal()}
          >
            Verify Skills
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.RESUME_BUILDER)}
          >
            Create with AI
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center justify-between border-neutral-200 shadow-xs">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Resumes Built
              </p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">
                {activeResumesCount}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Saved & ATS-ready versions
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between border-neutral-200 shadow-xs">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Verified Skills
              </p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">
                {verifiedCount}
              </h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                Certified by InsightResume
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between border-neutral-200 shadow-xs">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Active Applications
              </p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">
                {activeAppsCount}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Internships & placements
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between border-neutral-200 shadow-xs">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Average ATS Score
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <h3 className="text-2xl font-black text-neutral-900">{avgATS}</h3>
                <span className="text-xs text-neutral-400 font-semibold">/100</span>
              </div>
              <p className="text-[11px] text-blue-600 font-medium mt-0.5">
                High placement match rate
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Quick Launchpad Banner */}
        <div className="rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold text-blue-700 bg-blue-100 rounded-full uppercase tracking-wider">
                AI Career Assistant
              </span>
              <span className="text-xs text-neutral-500">Fast-track your job search</span>
            </div>
            <h4 className="text-base font-bold text-neutral-900">
              Need a targeted resume for an upcoming campus placement drive?
            </h4>
            <p className="text-xs text-neutral-600 max-w-2xl">
              InsightResume analyzes job descriptions and generates tailor-fit resumes with certified skill badges in under 60 seconds.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ScanText className="w-4 h-4" />}
              onClick={() => navigate(ROUTES.RESUME_INTELLIGENCE)}
            >
              Analyze ATS Score
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => navigate(ROUTES.RESUME_BUILDER)}
            >
              Generate AI Resume
            </Button>
          </div>
        </div>

        {/* Two-Column Middle Section: Resumes List + Verified Skills Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resumes Management List (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Your Resumes</h3>
                <p className="text-xs text-neutral-500">Edit, preview, and export your tailored resumes</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => navigate(ROUTES.RESUME_BUILDER)}
              >
                New Resume
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-neutral-200 shadow-xs divide-y divide-neutral-100 overflow-hidden">
              {resumes.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="No resumes created yet"
                  description="Build your first job-ready resume using AI prompt generation or choose from 5 ATS-compliant templates."
                  action={
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() => navigate(ROUTES.RESUME_BUILDER)}
                    >
                      Create First Resume
                    </Button>
                  }
                />
              ) : (
                resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-neutral-900 truncate">
                          {resume.title || 'Untitled Resume'}
                        </h4>
                        <Badge variant="default" size="sm">
                          {resume.selectedTemplate || 'Professional'}
                        </Badge>
                        <Badge variant="success" size="sm">
                          ATS: {resume.atsScore || 85}%
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-500 flex items-center gap-2">
                        <span>Target: {resume.personalInfo?.jobTitle || 'General Engineering'}</span>
                        <span>•</span>
                        <span>
                          Modified {new Date(resume.lastModified || Date.now()).toLocaleDateString()}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                        isLoading={downloadingResumeId === resume.id}
                        onClick={() => handleDownloadPDF(resume)}
                      >
                        Download PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditResume(resume)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Duplicate resume"
                        aria-label="Duplicate resume"
                        onClick={() => handleDuplicateResume(resume)}
                      >
                        <Copy className="w-4 h-4 text-neutral-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete resume"
                        aria-label="Delete resume"
                        onClick={() => handleDeleteResume(resume.id)}
                      >
                        <Trash2 className="w-4 h-4 text-neutral-400 hover:text-rose-600" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Verified Skills Showcase */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900">Verified Skills</h3>
                <p className="text-xs text-neutral-500">Certified competencies</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-600 text-xs font-semibold p-0 h-auto"
                onClick={() => handleOpenVerifyModal()}
              >
                + Verify More
              </Button>
            </div>

            <Card className="p-4 sm:p-5 border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified skills gain +15% recruiter response rate in InsightResume network.</span>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Active Badges ({verifiedSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {verifiedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1 text-xs font-medium bg-neutral-900 text-white px-2.5 py-1 rounded-full shadow-2xs"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-100 space-y-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Suggested for Verification
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Docker', 'Python', 'System Design', 'TypeScript', 'SQL']
                    .filter((s) => !verifiedSkills.includes(s))
                    .map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleOpenVerifyModal(s)}
                        className="inline-flex items-center gap-1 text-xs text-neutral-600 bg-neutral-100 hover:bg-primary-50 hover:text-primary-700 px-2.5 py-0.5 rounded-md border border-neutral-200 transition-colors cursor-pointer"
                      >
                        + {s}
                      </button>
                    ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Bottom Section: Recent Placement Applications */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Recent Applications</h3>
              <p className="text-xs text-neutral-500">Track interviews and campus drive updates</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
              onClick={() => navigate(ROUTES.APPLICATION_TRACKER)}
            >
              View Full Tracker
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
            {applications.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No active applications yet"
                description="Explore verified opportunities on the Job Portal and track your interview pipeline here."
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => navigate(ROUTES.JOB_PORTAL)}
                  >
                    Browse Opportunities
                  </Button>
                }
              />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company & Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Compensation</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.slice(0, 4).map((app) => {
                    let badgeVariant = 'default';
                    if (app.status === 'Interviewing') badgeVariant = 'info';
                    if (app.status === 'Offer Received') badgeVariant = 'success';
                    if (app.status === 'Under Review') badgeVariant = 'warning';
                    if (app.status === 'Rejected') badgeVariant = 'error';

                    return (
                      <TableRow key={app.id}>
                        <TableCell>
                          <div className="font-semibold text-neutral-900">{app.company}</div>
                          <div className="text-xs text-neutral-500">{app.position}</div>
                        </TableCell>
                        <TableCell className="text-neutral-600 text-xs">{app.location}</TableCell>
                        <TableCell>
                          <Badge variant={badgeVariant} size="sm">
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-mono text-neutral-700">{app.salary}</TableCell>
                        <TableCell className="text-xs text-neutral-500">{app.appliedDate}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                            onClick={() => navigate(ROUTES.APPLICATION_TRACKER)}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      {/* Skill Verification Modal */}
      <SkillVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        skillToVerify={selectedSkillToVerify}
        availableSkills={['Docker', 'Python', 'TypeScript', 'System Design', 'SQL']}
        jobTitle={resumes[0]?.personalInfo?.jobTitle || 'Software Engineer'}
        onVerificationComplete={handleVerificationComplete}
      />
    </DashboardLayout>
  );
}
