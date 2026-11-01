import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  EmptyState,
} from '../../../components/ui';
import { ROUTES } from '../../../constants/routes';
import { useCompanyData } from '../hooks/useCompanyData';
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  ArrowUpRight,
  TrendingUp,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Video,
  Eye,
  Building,
  Check,
  X,
} from 'lucide-react';
import clsx from 'clsx';

export default function CompanyDashboard() {
  const navigate = useNavigate();
  const { jobs, candidates, drives, metrics, profile, updateCandidateStatus } = useCompanyData();

  // Selected candidate state for inspection preview modal
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewModalData, setInterviewModalData] = useState(null);

  // Filter candidates who have upcoming interviews
  const upcomingInterviews = candidates
    .filter((c) => c.status === 'Interview' && c.interviewDate)
    .sort((a, b) => new Date(a.interviewDate) - new Date(b.interviewDate))
    .slice(0, 5);

  // Active listings preview
  const activeJobs = jobs.filter((j) => j.status === 'Active').slice(0, 4);

  // Recent applications (all stages, latest first)
  const recentApplicants = [...candidates]
    .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
    .slice(0, 5);

  const getAtsBadge = (score) => {
    if (score >= 90) {
      return (
        <Badge variant="success" size="sm" dot>
          {score}% Match
        </Badge>
      );
    }
    if (score >= 75) {
      return (
        <Badge variant="info" size="sm" dot>
          {score}% Match
        </Badge>
      );
    }
    return (
      <Badge variant="warning" size="sm" dot>
        {score}% Match
      </Badge>
    );
  };

  const getStageBadge = (status) => {
    switch (status) {
      case 'Offered':
        return <Badge variant="success">{status}</Badge>;
      case 'Interview':
        return <Badge variant="info">{status}</Badge>;
      case 'Shortlisted':
        return <Badge variant="default" className="bg-purple-50 text-purple-700 border-purple-200">{status}</Badge>;
      case 'Rejected':
        return <Badge variant="error">{status}</Badge>;
      default:
        return <Badge variant="warning">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Hiring & Recruitment Overview"
      subtitle={`Welcome back, ${profile?.name || 'Recruiter'}. Here is your talent pipeline summary for today.`}
      breadcrumbs={[
        { label: 'Employer Portal', href: ROUTES.COMPANY_DASHBOARD },
        { label: 'Overview' },
      ]}
      actions={
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Users className="w-3.5 h-3.5" />}
            onClick={() => navigate(ROUTES.CANDIDATE_MANAGER)}
          >
            Candidate Pipeline
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => navigate(ROUTES.JOB_EDITOR)}
          >
            Post New Job
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* ============================================================ */}
        {/* METRICS ROW (Linear / Stripe Inspired Cards)                 */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Active Vacancies */}
          <Card className="hover:border-neutral-300 transition-all p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Active Listings
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-neutral-900 tracking-tight">
                {metrics.activeVacancies}
              </span>
              <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 gap-0.5">
                <TrendingUp className="w-3 h-3" /> +2 this month
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              Across {jobs.length} total departments
            </p>
          </Card>

          {/* Card 2: Total Applicants */}
          <Card className="hover:border-neutral-300 transition-all p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Total Applicants
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-neutral-900 tracking-tight">
                {metrics.totalApplicants}
              </span>
              <span className="inline-flex items-center text-[11px] font-medium text-emerald-600 gap-0.5">
                <TrendingUp className="w-3 h-3" /> +38% MoM
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              Avg ATS score: {metrics.avgAtsScore}%
            </p>
          </Card>

          {/* Card 3: In Interview */}
          <Card className="hover:border-neutral-300 transition-all p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                In Interview
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-neutral-900 tracking-tight">
                {metrics.inInterview}
              </span>
              <span className="text-[11px] font-medium text-amber-600">
                Active rounds
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              {upcomingInterviews.length} scheduled this week
            </p>
          </Card>

          {/* Card 4: Offers Extended */}
          <Card className="hover:border-neutral-300 transition-all p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Offers Extended
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-neutral-900 tracking-tight">
                {metrics.offersExtended}
              </span>
              <span className="inline-flex items-center text-[11px] font-medium text-emerald-600">
                {metrics.offerAcceptanceRate} accept
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              High acceptance velocity
            </p>
          </Card>

          {/* Card 5: Time to Hire */}
          <Card className="hover:border-neutral-300 transition-all p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
                Time to Hire
              </span>
              <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-neutral-900 tracking-tight">
                {metrics.timeToHireDays} <span className="text-sm font-normal text-neutral-500">days</span>
              </span>
              <span className="inline-flex items-center text-[11px] font-medium text-emerald-600">
                -4d vs avg
              </span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">
              From application to offer
            </p>
          </Card>
        </div>

        {/* ============================================================ */}
        {/* MAIN 2-COLUMN SECTION: Active Listings & Interviews Timeline */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Listings Overview (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <CardTitle className="text-base font-semibold text-neutral-900">
                    Active Job Openings
                  </CardTitle>
                  <CardDescription>
                    Currently accepting applications and campus student batches
                  </CardDescription>
                </div>
                <Link
                  to={ROUTES.JOB_LISTINGS}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Manage all ({jobs.length}) <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </CardHeader>

              <CardContent className="p-0">
                <div className="divide-y divide-neutral-100">
                  {activeJobs.map((job) => (
                    <div
                      key={job.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            to={`${ROUTES.CANDIDATE_MANAGER}?jobId=${job.id}`}
                            className="font-semibold text-sm text-neutral-900 hover:text-primary-600 transition-colors truncate"
                          >
                            {job.title}
                          </Link>
                          <Badge variant="info" size="sm">
                            {job.type}
                          </Badge>
                          <span className="text-[11px] text-neutral-400 font-medium">
                            • {job.workMode}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-neutral-500 flex-wrap">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span className="font-medium text-neutral-700">
                            ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k/{job.salaryPeriod}
                          </span>
                        </div>

                        {/* Skills pills */}
                        <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                          {job.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 4 && (
                            <span className="text-[10px] text-neutral-400 font-medium">
                              +{job.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0 sm:self-center justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                        <div className="text-right">
                          <div className="text-sm font-bold text-neutral-900">
                            {job.applicantsCount || 0}
                          </div>
                          <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-medium">
                            Candidates
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`${ROUTES.CANDIDATE_MANAGER}?jobId=${job.id}`)}
                          >
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`${ROUTES.JOB_EDITOR}?id=${job.id}`)}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {activeJobs.length === 0 && (
                    <div className="p-8 text-center">
                      <EmptyState
                        title="No active vacancies"
                        description="Create a new job posting to start receiving applicants."
                        actionLabel="Post Job Listing"
                        onAction={() => navigate(ROUTES.JOB_EDITOR)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Candidate Applications Feed */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <CardTitle className="text-base font-semibold text-neutral-900">
                    Recent Candidate Applications
                  </CardTitle>
                  <CardDescription>
                    Real-time ATS screening with resume intelligence scores
                  </CardDescription>
                </div>
                <Link
                  to={ROUTES.CANDIDATE_MANAGER}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  View full pipeline <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </CardHeader>

              <CardContent className="p-0">
                <div className="divide-y divide-neutral-100">
                  {recentApplicants.map((cand) => (
                    <div
                      key={cand.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={cand.avatar}
                          alt={cand.name}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0 mt-0.5"
                        />
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-neutral-900">
                              {cand.name}
                            </span>
                            {getAtsBadge(cand.atsScore)}
                            {getStageBadge(cand.status)}
                          </div>
                          <p className="text-xs text-neutral-600 truncate">
                            Applied for <span className="font-medium text-neutral-800">{cand.roleApplied}</span>
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-neutral-400 flex-wrap">
                            <span>{cand.university}</span>
                            <span>•</span>
                            <span>CGPA: {cand.cgpa}</span>
                            <span>•</span>
                            <span>{cand.appliedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => setSelectedCandidate(cand)}
                        >
                          Inspect
                        </Button>
                        {cand.status === 'Under Review' && (
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Check className="w-3.5 h-3.5" />}
                            onClick={() => updateCandidateStatus(cand.id, 'Shortlisted')}
                          >
                            Shortlist
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Upcoming Interviews & Campus Placement Drives */}
          <div className="space-y-6">
            {/* Upcoming Interviews Timeline */}
            <Card>
              <CardHeader className="border-b border-neutral-100 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-neutral-900">
                    Interview Schedule
                  </CardTitle>
                  <CardDescription>
                    Upcoming live panel & technical interviews
                  </CardDescription>
                </div>
                <Badge variant="info" size="sm">
                  {upcomingInterviews.length} Scheduled
                </Badge>
              </CardHeader>

              <CardContent className="p-4 sm:p-5">
                {upcomingInterviews.length > 0 ? (
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200">
                    {upcomingInterviews.map((interview) => (
                      <div key={interview.id} className="relative group">
                        {/* Timeline dot */}
                        <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-primary-600 ring-4 ring-white" />

                        <div className="bg-neutral-50 rounded-lg p-3.5 border border-neutral-100 group-hover:border-neutral-200 transition-all">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                              {interview.interviewDate}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-medium">
                              30 min
                            </span>
                          </div>

                          <div className="mt-2 flex items-center gap-2">
                            <img
                              src={interview.avatar}
                              alt={interview.name}
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-neutral-900 truncate">
                                {interview.name}
                              </p>
                              <p className="text-[11px] text-neutral-500 truncate">
                                {interview.roleApplied}
                              </p>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-neutral-200/60 flex items-center justify-between">
                            <span className="text-[10px] text-neutral-400 truncate">
                              Host: {interview.interviewer || 'Hiring Manager'}
                            </span>
                            <button
                              onClick={() => setInterviewModalData(interview)}
                              className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 cursor-pointer"
                            >
                              <Video className="w-3 h-3" /> Join Room
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Calendar className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                    <p className="text-xs text-neutral-500">
                      No interviews scheduled for today.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 text-xs"
                      onClick={() => navigate(ROUTES.CANDIDATE_MANAGER)}
                    >
                      Schedule from Pipeline
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Campus Drives Fast Access */}
            <Card>
              <CardHeader className="border-b border-neutral-100 pb-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-neutral-900">
                    Campus Drives
                  </CardTitle>
                  <CardDescription>
                    University recruitment partnerships
                  </CardDescription>
                </div>
                <Link
                  to={ROUTES.UNIVERSITY_RECRUITMENT}
                  className="text-xs text-primary-600 hover:text-primary-700 font-semibold inline-flex items-center"
                >
                  Explore <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-3">
                {drives.slice(0, 3).map((drive) => (
                  <div
                    key={drive.id}
                    className="p-3 rounded-lg border border-neutral-200/80 bg-white hover:bg-neutral-50 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="text-xs font-semibold text-neutral-900 truncate">
                          {drive.universityName}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {drive.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-neutral-400">
                        <span>{drive.startDate}</span>
                        <span>•</span>
                        <span>{drive.registeredStudents} students</span>
                      </div>
                    </div>

                    <span
                      className={clsx(
                        'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                        drive.participating
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600'
                      )}
                    >
                      {drive.participating ? 'Registered' : 'Available'}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* CANDIDATE INSPECTION MODAL                                   */}
      {/* ============================================================ */}
      {selectedCandidate && (
        <Modal
          isOpen={Boolean(selectedCandidate)}
          onClose={() => setSelectedCandidate(null)}
          size="lg"
          title={`Candidate Profile: ${selectedCandidate.name}`}
          description={`Applied for ${selectedCandidate.roleApplied} • ATS Score: ${selectedCandidate.atsScore}%`}
        >
          <ModalBody className="space-y-5">
            {/* Header snippet */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-100">
              <img
                src={selectedCandidate.avatar}
                alt={selectedCandidate.name}
                className="w-14 h-14 rounded-full object-cover border border-neutral-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-base font-bold text-neutral-900 truncate">
                    {selectedCandidate.name}
                  </h4>
                  {getAtsBadge(selectedCandidate.atsScore)}
                </div>
                <p className="text-xs text-neutral-600">{selectedCandidate.email} • {selectedCandidate.phone}</p>
                <p className="text-xs text-neutral-500">
                  {selectedCandidate.degree} — {selectedCandidate.university} (CGPA: {selectedCandidate.cgpa})
                </p>
              </div>
            </div>

            {/* ATS Semantic Match Breakdown */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-800">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                  ATS Semantic Relevance Score
                </span>
                <span className="text-primary-700 font-bold">{selectedCandidate.atsScore}/100</span>
              </div>
              <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                <div
                  className={clsx(
                    'h-full rounded-full transition-all duration-500',
                    selectedCandidate.atsScore >= 90
                      ? 'bg-emerald-500'
                      : selectedCandidate.atsScore >= 75
                      ? 'bg-blue-500'
                      : 'bg-amber-500'
                  )}
                  style={{ width: `${selectedCandidate.atsScore}%` }}
                />
              </div>
            </div>

            {/* Skills Verification */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-700 block">
                Skills Verification against Job Criteria
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidate.skillsMatch?.matched?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md"
                  >
                    <Check className="w-3 h-3 text-emerald-600" /> {skill}
                  </span>
                ))}
                {selectedCandidate.skillsMatch?.missing?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md"
                  >
                    <X className="w-3 h-3 text-amber-600" /> Missing: {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Parsed Summary */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-neutral-700 block">
                Resume Intelligence Summary
              </span>
              <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50/80 p-3 rounded-lg border border-neutral-100">
                {selectedCandidate.summary}
              </p>
            </div>

            {/* Recruiter Evaluation Notes */}
            {selectedCandidate.notes && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-neutral-700 block">
                  Hiring Team Evaluation & Interview Notes
                </span>
                <p className="text-xs text-neutral-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                  {selectedCandidate.notes}
                </p>
              </div>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCandidate(null)}
            >
              Close
            </Button>
            {selectedCandidate.status !== 'Shortlisted' && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  updateCandidateStatus(selectedCandidate.id, 'Shortlisted');
                  setSelectedCandidate(null);
                }}
              >
                Move to Shortlist
              </Button>
            )}
            {selectedCandidate.status !== 'Interview' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  updateCandidateStatus(selectedCandidate.id, 'Interview', {
                    interviewDate: '2026-11-06 11:00 AM PST',
                    interviewer: profile?.name || 'Recruiter Panel',
                  });
                  setSelectedCandidate(null);
                }}
              >
                Schedule Interview
              </Button>
            )}
          </ModalFooter>
        </Modal>
      )}

      {/* Virtual Meeting Modal */}
      {interviewModalData && (
        <Modal
          isOpen={Boolean(interviewModalData)}
          onClose={() => setInterviewModalData(null)}
          title="InsightResume Video Interview Room"
          description={`Interviewing ${interviewModalData.name} for ${interviewModalData.roleApplied}`}
        >
          <ModalBody className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto shadow-xs">
              <Video className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900">
                Live Video Session Ready
              </h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
                Secure end-to-end encrypted room with integrated real-time code editor and resume evaluation scorecard.
              </p>
            </div>
            <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-600 border border-neutral-200">
              Meeting ID: <span className="font-mono font-semibold">room-ir-{interviewModalData.id}</span>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInterviewModalData(null)}
            >
              Dismiss
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                window.open('https://meet.google.com', '_blank');
                setInterviewModalData(null);
              }}
            >
              Launch Video Call
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
}
