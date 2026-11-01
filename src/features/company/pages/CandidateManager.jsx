import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  EmptyState,
} from '../../../components/ui';
import { ROUTES } from '../../../constants/routes';
import { useCompanyData } from '../hooks/useCompanyData';
import {
  Users,
  Search,
  Filter,
  Eye,
  Check,
  X,
  Calendar,
  Sparkles,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  FileText,
  Clock,
  ArrowUpDown,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Award,
  Video,
} from 'lucide-react';
import clsx from 'clsx';

const PIPELINE_STAGES = [
  { id: 'All', label: 'All Candidates' },
  { id: 'Under Review', label: 'Under Review' },
  { id: 'Shortlisted', label: 'Shortlisted' },
  { id: 'Interview', label: 'Interview' },
  { id: 'Offered', label: 'Offered' },
  { id: 'Rejected', label: 'Rejected' },
];

export default function CandidateManager() {
  const [searchParams, setSearchParams] = useSearchParams();
  const preselectedJobId = searchParams.get('jobId');

  const { candidates, jobs, updateCandidateStatus } = useCompanyData();

  // Active filters
  const [activeStage, setActiveStage] = useState('All');
  const [selectedJobId, setSelectedJobId] = useState(preselectedJobId || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('atsScore'); // 'atsScore' | 'appliedDate' | 'name'

  // Modal inspection state
  const [inspectingCandidate, setInspectingCandidate] = useState(null);
  const [inspectorTab, setInspectorTab] = useState('evaluation'); // 'evaluation' | 'resume'
  const [evalNotes, setEvalNotes] = useState('');

  // Sync state if query param changes
  useEffect(() => {
    if (preselectedJobId) {
      setSelectedJobId(preselectedJobId);
    }
  }, [preselectedJobId]);

  // Sync inspection notes
  useEffect(() => {
    if (inspectingCandidate) {
      setEvalNotes(inspectingCandidate.notes || '');
    }
  }, [inspectingCandidate]);

  // Stage counts computed dynamically
  const stageCounts = useMemo(() => {
    const map = { All: candidates.length };
    PIPELINE_STAGES.forEach((stage) => {
      if (stage.id !== 'All') {
        map[stage.id] = candidates.filter((c) => c.status === stage.id).length;
      }
    });
    return map;
  }, [candidates]);

  // Filtered & sorted candidates
  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((cand) => {
        // Stage filter
        if (activeStage !== 'All' && cand.status !== activeStage) {
          return false;
        }
        // Job Opening filter
        if (selectedJobId !== 'All' && cand.jobId !== selectedJobId) {
          return false;
        }
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = cand.name?.toLowerCase().includes(q);
          const emailMatch = cand.email?.toLowerCase().includes(q);
          const univMatch = cand.university?.toLowerCase().includes(q);
          const skillsMatch = cand.skillsMatch?.matched?.some((s) => s.toLowerCase().includes(q));
          if (!nameMatch && !emailMatch && !univMatch && !skillsMatch) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'atsScore') {
          return (b.atsScore || 0) - (a.atsScore || 0);
        }
        if (sortBy === 'appliedDate') {
          return new Date(b.appliedDate) - new Date(a.appliedDate);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [candidates, activeStage, selectedJobId, searchQuery, sortBy]);

  const handleUpdateStatus = (candidateId, newStatus, extra = {}) => {
    updateCandidateStatus(candidateId, newStatus, {
      notes: evalNotes || undefined,
      ...extra,
    });
    if (inspectingCandidate && inspectingCandidate.id === candidateId) {
      setInspectingCandidate((prev) => ({
        ...prev,
        status: newStatus,
        notes: evalNotes || prev.notes,
        ...extra,
      }));
    }
  };

  const getAtsBadge = (score) => {
    if (score >= 90) {
      return (
        <Badge variant="success" size="sm" dot>
          {score}% ATS Match
        </Badge>
      );
    }
    if (score >= 75) {
      return (
        <Badge variant="info" size="sm" dot>
          {score}% ATS Match
        </Badge>
      );
    }
    return (
      <Badge variant="warning" size="sm" dot>
        {score}% ATS Match
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
        return (
          <Badge variant="default" className="bg-purple-50 text-purple-700 border-purple-200">
            {status}
          </Badge>
        );
      case 'Rejected':
        return <Badge variant="error">{status}</Badge>;
      default:
        return <Badge variant="warning">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Candidate Talent Pipeline"
      subtitle="Screen applicant resumes, inspect semantic ATS matching, and progress candidates through hiring stages."
      breadcrumbs={[
        { label: 'Employer Portal', href: ROUTES.COMPANY_DASHBOARD },
        { label: 'Candidate Pipeline' },
      ]}
      actions={
        <div className="flex items-center gap-2">
          {selectedJobId !== 'All' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedJobId('All');
                setSearchParams({});
              }}
            >
              Clear Job Filter
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveStage('All')}
          >
            Show All ({candidates.length})
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* ============================================================ */}
        {/* PIPELINE STATUS TABS                                         */}
        {/* ============================================================ */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-neutral-200 rounded-lg overflow-x-auto scrollbar-thin">
          {PIPELINE_STAGES.map((stage) => {
            const isCurrent = activeStage === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={clsx(
                  'flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer select-none',
                  isCurrent
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                )}
              >
                <span>{stage.label}</span>
                <span
                  className={clsx(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                    isCurrent
                      ? 'bg-neutral-700 text-white'
                      : 'bg-neutral-100 text-neutral-600'
                  )}
                >
                  {stageCounts[stage.id] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* SEARCH & FILTER CONTROLS                                     */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-neutral-200">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Search candidate name, college, skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Filter by Job vacancy */}
            <div className="w-52">
              <Select
                value={selectedJobId}
                onChange={(e) => {
                  setSelectedJobId(e.target.value);
                  if (e.target.value !== 'All') {
                    setSearchParams({ jobId: e.target.value });
                  } else {
                    setSearchParams({});
                  }
                }}
                options={[
                  { value: 'All', label: 'All Vacancy Roles' },
                  ...jobs.map((j) => ({ value: j.id, label: j.title })),
                ]}
              />
            </div>

            {/* Sort by dropdown */}
            <div className="w-44">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={[
                  { value: 'atsScore', label: 'Sort: Highest ATS Score' },
                  { value: 'appliedDate', label: 'Sort: Most Recent' },
                  { value: 'name', label: 'Sort: Candidate Name' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* CANDIDATES TABLE                                             */}
        {/* ============================================================ */}
        {filteredCandidates.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[28%]">Candidate Details</TableHead>
                <TableHead>Role Applied</TableHead>
                <TableHead>ATS Semantic Score</TableHead>
                <TableHead>Key Skills Match</TableHead>
                <TableHead>Pipeline Stage</TableHead>
                <TableHead className="text-right">Evaluation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((cand) => (
                <TableRow key={cand.id}>
                  {/* Candidate Name & Info */}
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <img
                        src={cand.avatar}
                        alt={cand.name}
                        className="w-9 h-9 rounded-full object-cover border border-neutral-200 shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <button
                          type="button"
                          onClick={() => setInspectingCandidate(cand)}
                          className="font-semibold text-sm text-neutral-900 hover:text-primary-600 transition-colors text-left truncate block cursor-pointer"
                        >
                          {cand.name}
                        </button>
                        <p className="text-xs text-neutral-500 truncate">{cand.email}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                          <GraduationCap className="w-3 h-3 text-neutral-400 shrink-0" />
                          <span className="truncate">{cand.university}</span>
                          <span>•</span>
                          <span>CGPA {cand.cgpa}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Role Applied */}
                  <TableCell>
                    <div className="text-xs font-semibold text-neutral-800 truncate max-w-[180px]">
                      {cand.roleApplied}
                    </div>
                    <div className="text-[10px] text-neutral-400">
                      Applied {cand.appliedDate}
                    </div>
                  </TableCell>

                  {/* ATS Match Gauge */}
                  <TableCell>
                    <div className="space-y-1 w-32">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                        <span>{cand.atsScore}%</span>
                        {getAtsBadge(cand.atsScore)}
                      </div>
                      <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={clsx(
                            'h-full rounded-full',
                            cand.atsScore >= 90
                              ? 'bg-emerald-500'
                              : cand.atsScore >= 75
                              ? 'bg-blue-500'
                              : 'bg-amber-500'
                          )}
                          style={{ width: `${cand.atsScore}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Skills Match */}
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {cand.skillsMatch?.matched?.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {cand.skillsMatch?.missing?.length > 0 && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                          -{cand.skillsMatch.missing.length} missing
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <div className="space-y-1">
                      {getStageBadge(cand.status)}
                      {cand.status === 'Interview' && cand.interviewDate && (
                        <div className="text-[10px] text-primary-700 flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3" /> {cand.interviewDate}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => setInspectingCandidate(cand)}
                      >
                        Inspect
                      </Button>

                      {/* Fast State Transitions */}
                      {cand.status === 'Under Review' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateStatus(cand.id, 'Shortlisted')}
                        >
                          Shortlist
                        </Button>
                      )}

                      {cand.status === 'Shortlisted' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(cand.id, 'Interview', {
                              interviewDate: '2026-11-06 02:00 PM PST',
                            })
                          }
                        >
                          Schedule
                        </Button>
                      )}

                      {cand.status === 'Interview' && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleUpdateStatus(cand.id, 'Offered')}
                        >
                          Extend Offer
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            icon={Users}
            title="No candidates in this stage"
            description="Try switching status tabs, clearing search filters, or view all applicants."
            actionLabel="Reset Filters"
            onAction={() => {
              setActiveStage('All');
              setSelectedJobId('All');
              setSearchQuery('');
              setSearchParams({});
            }}
          />
        )}
      </div>

      {/* ============================================================ */}
      {/* CANDIDATE INSPECTION & RESUME PREVIEW MODAL                  */}
      {/* ============================================================ */}
      {inspectingCandidate && (
        <Modal
          isOpen={Boolean(inspectingCandidate)}
          onClose={() => setInspectingCandidate(null)}
          size="xl"
          title={`Candidate Dossier: ${inspectingCandidate.name}`}
          description={`Application for ${inspectingCandidate.roleApplied} • Status: ${inspectingCandidate.status}`}
        >
          {/* Subheader Switcher */}
          <div className="px-6 py-2.5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInspectorTab('evaluation')}
                className={clsx(
                  'px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer',
                  inspectorTab === 'evaluation'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                )}
              >
                ATS Match & Evaluation
              </button>
              <button
                type="button"
                onClick={() => setInspectorTab('resume')}
                className={clsx(
                  'px-3 py-1 rounded text-xs font-semibold transition-all cursor-pointer',
                  inspectorTab === 'resume'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                )}
              >
                Full Resume Preview
              </button>
            </div>

            <div className="flex items-center gap-2">
              {getAtsBadge(inspectingCandidate.atsScore)}
              {getStageBadge(inspectingCandidate.status)}
            </div>
          </div>

          <ModalBody className="space-y-5">
            {/* TAB 1: EVALUATION & SCORING */}
            {inspectorTab === 'evaluation' && (
              <div className="space-y-5">
                {/* Contact Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200/80">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={inspectingCandidate.avatar}
                      alt={inspectingCandidate.name}
                      className="w-14 h-14 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <h4 className="text-base font-bold text-neutral-900">
                        {inspectingCandidate.name}
                      </h4>
                      <p className="text-xs text-neutral-600 flex items-center gap-2 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-neutral-400" />
                        {inspectingCandidate.email}
                        <span>•</span>
                        <Phone className="w-3.5 h-3.5 text-neutral-400" />
                        {inspectingCandidate.phone}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {inspectingCandidate.university} ({inspectingCandidate.degree}, CGPA {inspectingCandidate.cgpa})
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:border-l sm:pl-4 border-neutral-200">
                    <div className="text-xs text-neutral-400">Total Experience</div>
                    <div className="text-sm font-bold text-neutral-900 mt-0.5">
                      {inspectingCandidate.experience || 'Campus Cohort'}
                    </div>
                  </div>
                </div>

                {/* Semantic Match Meter */}
                <div className="p-4 rounded-lg border border-neutral-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary-600" />
                      <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                        Semantic Relevance Score
                      </span>
                    </div>
                    <span className="text-sm font-extrabold text-primary-600">
                      {inspectingCandidate.atsScore} / 100
                    </span>
                  </div>

                  <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-primary-600 h-full rounded-full transition-all"
                      style={{ width: `${inspectingCandidate.atsScore}%` }}
                    />
                  </div>

                  <p className="text-xs text-neutral-500">
                    Calculated using embeddings comparison between candidate resume text, project descriptions, and verified skills against your job requirements.
                  </p>
                </div>

                {/* Skill Match Breakdown */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Skill Match Verification
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                      <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Matched Skills ({inspectingCandidate.skillsMatch?.matched?.length || 0})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectingCandidate.skillsMatch?.matched?.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-semibold bg-white text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 shadow-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-amber-50/60 border border-amber-200/80 space-y-2">
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <X className="w-3.5 h-3.5 text-amber-600" />
                        Skills Not Found in Resume ({inspectingCandidate.skillsMatch?.missing?.length || 0})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {inspectingCandidate.skillsMatch?.missing?.length > 0 ? (
                          inspectingCandidate.skillsMatch.missing.map((skill) => (
                            <span
                              key={skill}
                              className="text-[11px] font-semibold bg-white text-amber-800 px-2 py-0.5 rounded border border-amber-200 shadow-xs"
                            >
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-emerald-700 font-medium">
                            100% core skills matched!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Parsed Summary */}
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Parsed Career Summary
                  </h5>
                  <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200/80 text-xs text-neutral-700 leading-relaxed">
                    {inspectingCandidate.summary}
                  </div>
                </div>

                {/* Hiring Notes & Interview Feedback */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                      Recruiter & Interview Feedback Notes
                    </label>
                    <span className="text-[11px] text-neutral-400">Saved to candidate file</span>
                  </div>
                  <textarea
                    rows={3}
                    className="w-full text-xs text-neutral-800 bg-white border border-neutral-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    placeholder="Enter technical interview remarks, compensation expectations, or next steps..."
                    value={evalNotes}
                    onChange={(e) => setEvalNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* TAB 2: RESUME PREVIEW */}
            {inspectorTab === 'resume' && (
              <div className="p-6 bg-white border border-neutral-200 rounded-lg shadow-xs space-y-6 max-w-2xl mx-auto font-sans">
                {/* Resume Header */}
                <div className="border-b border-neutral-200 pb-4 text-center space-y-1">
                  <h2 className="text-xl font-bold text-neutral-900 tracking-tight">
                    {inspectingCandidate.name}
                  </h2>
                  <p className="text-xs text-neutral-600">
                    {inspectingCandidate.email} • {inspectingCandidate.phone} • {inspectingCandidate.location}
                  </p>
                  <p className="text-xs text-primary-600 font-medium">
                    linkedin.com/in/{inspectingCandidate.name.toLowerCase().replace(' ', '')} • github.com/{inspectingCandidate.name.toLowerCase().replace(' ', '')}
                  </p>
                </div>

                {/* Resume Section: Education */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
                    Education
                  </h3>
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <p className="font-bold text-neutral-900">{inspectingCandidate.university}</p>
                      <p className="text-neutral-600">{inspectingCandidate.degree}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-neutral-700">Class of {inspectingCandidate.graduationYear}</p>
                      <p className="text-emerald-700 font-semibold">Cumulative GPA: {inspectingCandidate.cgpa}</p>
                    </div>
                  </div>
                </div>

                {/* Resume Section: Experience */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
                    Professional Experience
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-bold text-neutral-900">
                        <span>Software Engineering Specialist</span>
                        <span className="font-normal text-neutral-500">2023 - Present</span>
                      </div>
                      <p className="text-neutral-600 italic">Silicon Valley Tech Ventures • San Francisco, CA</p>
                      <ul className="list-disc pl-4 mt-1 space-y-1 text-neutral-700">
                        <li>Architected real-time WebSocket communications layer reducing server-client sync delay by 42%.</li>
                        <li>Implemented responsive modular UI components with React, TypeScript, and Tailwind CSS.</li>
                        <li>Optimized PostgreSQL complex queries and indexing, achieving sub-50ms API response times.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold text-neutral-900">
                        <span>Undergraduate Research & Intern Fellow</span>
                        <span className="font-normal text-neutral-500">2022 - 2023</span>
                      </div>
                      <p className="text-neutral-600 italic">Artificial Intelligence Lab • University Campus</p>
                      <ul className="list-disc pl-4 mt-1 space-y-1 text-neutral-700">
                        <li>Trained transformer models using PyTorch on custom tokenized corpus.</li>
                        <li>Built end-to-end evaluation harness with automated regression tests.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Resume Section: Skills */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-1">
                    Technical Proficiencies
                  </h3>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    <strong className="text-neutral-900">Languages & Frameworks:</strong>{' '}
                    {inspectingCandidate.skillsMatch?.matched?.join(', ') || 'React, TypeScript, Python, Node.js'}
                  </p>
                  <p className="text-xs text-neutral-700 leading-relaxed">
                    <strong className="text-neutral-900">Databases & Cloud:</strong> PostgreSQL, Redis, Docker, AWS, Git, CI/CD
                  </p>
                </div>
              </div>
            )}
          </ModalBody>

          {/* Modal Footer with Status Transition Actions */}
          <ModalFooter className="flex-wrap justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Move candidate to:</span>
              <Button
                variant={inspectingCandidate.status === 'Shortlisted' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => handleUpdateStatus(inspectingCandidate.id, 'Shortlisted')}
              >
                Shortlist
              </Button>
              <Button
                variant={inspectingCandidate.status === 'Interview' ? 'secondary' : 'outline'}
                size="sm"
                onClick={() =>
                  handleUpdateStatus(inspectingCandidate.id, 'Interview', {
                    interviewDate: '2026-11-06 10:00 AM PST',
                  })
                }
              >
                Interview
              </Button>
              <Button
                variant={inspectingCandidate.status === 'Offered' ? 'secondary' : 'outline'}
                size="sm"
                className="hover:border-emerald-500 hover:text-emerald-700"
                onClick={() => handleUpdateStatus(inspectingCandidate.id, 'Offered')}
              >
                Offer
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => handleUpdateStatus(inspectingCandidate.id, 'Rejected')}
              >
                Reject
              </Button>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                updateCandidateStatus(inspectingCandidate.id, inspectingCandidate.status, {
                  notes: evalNotes,
                });
                setInspectingCandidate(null);
              }}
            >
              Save & Done
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
}
