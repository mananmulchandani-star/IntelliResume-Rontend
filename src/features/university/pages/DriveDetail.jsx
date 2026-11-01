import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Modal,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  EmptyState,
} from '../../../components/ui';
import { ROUTES } from '../../../constants/routes';
import { useUniversity, UniversityProvider } from '../context/UniversityContext';
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Users,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  UserPlus,
  FileSpreadsheet,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MessageSquare,
  Award,
} from 'lucide-react';

function DriveDetailContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { drives, students, updateApplicantStage, addApplicantToDrive } = useUniversity();

  const [activeStageTab, setActiveStageTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [isAddApplicantModalOpen, setIsAddApplicantModalOpen] = useState(false);
  const [feedbackCandidate, setFeedbackCandidate] = useState(null);
  const [feedbackNote, setFeedbackNote] = useState('');

  const drive = drives.find((d) => d.id === id);
  const applicants = drive?.applicants || [];

  // Filter applicants
  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      // Stage tab
      if (activeStageTab !== 'ALL' && app.stage !== activeStageTab) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = app.name?.toLowerCase().includes(q);
        const matchesRoll = app.rollNo?.toLowerCase().includes(q);
        const matchesEmail = app.email?.toLowerCase().includes(q);
        const matchesDept = app.department?.toLowerCase().includes(q);
        if (!matchesName && !matchesRoll && !matchesEmail && !matchesDept) return false;
      }

      return true;
    });
  }, [applicants, activeStageTab, searchQuery]);

  // Stage counts
  const stageCounts = useMemo(() => {
    return {
      ALL: applicants.length,
      Registered: applicants.filter((a) => a.stage === 'Registered').length,
      Shortlisted: applicants.filter((a) => a.stage === 'Shortlisted').length,
      Interview: applicants.filter((a) => a.stage === 'Interview').length,
      Selected: applicants.filter((a) => a.stage === 'Selected').length,
      Rejected: applicants.filter((a) => a.stage === 'Rejected').length,
    };
  }, [applicants]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  if (!drive) {
    return (
      <DashboardLayout
        title="Drive Not Found"
        breadcrumbs={[
          { label: 'University', href: ROUTES.UNIVERSITY_DASHBOARD },
          { label: 'Placement Drives', href: ROUTES.PLACEMENT_DRIVES },
          { label: 'Not Found' },
        ]}
      >
        <EmptyState
          icon={<AlertTriangle className="w-8 h-8 text-amber-500" />}
          title="Placement Drive Not Found"
          description="The placement drive with this identifier could not be found or has been removed."
          actionLabel="Back to Placement Drives"
          onAction={() => navigate(ROUTES.PLACEMENT_DRIVES)}
        />
      </DashboardLayout>
    );
  }

  // Handle stage change
  const handleStageAdvance = (studentId, studentName, newStage) => {
    updateApplicantStage(drive.id, studentId, newStage);
    showToast(`Updated ${studentName} to "${newStage}" stage.`);
  };

  // Handle Feedback Submit
  const handleSaveFeedback = (e) => {
    e.preventDefault();
    if (!feedbackCandidate) return;
    updateApplicantStage(
      drive.id,
      feedbackCandidate.studentId,
      feedbackCandidate.stage,
      feedbackNote
    );
    showToast(`Saved interview feedback for ${feedbackCandidate.name}`);
    setFeedbackCandidate(null);
    setFeedbackNote('');
  };

  // Export CSV
  const handleExportApplicants = () => {
    const csvRows = [
      ['Name', 'Roll No', 'Email', 'Department', 'CGPA', 'Backlogs', 'AI Resume Score', 'Stage', 'Feedback'],
      ...applicants.map((a) => [
        `"${a.name}"`,
        `"${a.rollNo}"`,
        `"${a.email}"`,
        `"${a.department}"`,
        a.cgpa,
        a.backlogs,
        a.resumeScore || 80,
        `"${a.stage}"`,
        `"${(a.feedback || '').replace(/"/g, '""')}"`,
      ]),
    ];
    const csvString = csvRows.map((e) => e.join(',')).join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${drive.companyName}_Applicants_${drive.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloaded applicants CSV for ${drive.companyName}`);
  };

  // Eligible students from directory not yet enrolled in this drive
  const eligibleDirectoryStudents = students.filter((s) => {
    const alreadyEnrolled = applicants.some((a) => a.studentId === s.id);
    if (alreadyEnrolled) return false;
    const meetsCgpa = s.cgpa >= (drive.eligibility?.minCgpa || 7.0);
    const meetsBacklogs = s.backlogs <= (drive.eligibility?.maxBacklogs || 0);
    return meetsCgpa && meetsBacklogs;
  });

  const getStageBadge = (stage) => {
    switch (stage) {
      case 'Selected':
        return <Badge variant="success" size="sm" dot>Selected / Offer</Badge>;
      case 'Interview':
        return <Badge variant="info" size="sm" dot>In Interview</Badge>;
      case 'Shortlisted':
        return <Badge variant="warning" size="sm" dot>Shortlisted</Badge>;
      case 'Rejected':
        return <Badge variant="error" size="sm">Not Selected</Badge>;
      case 'Registered':
      default:
        return <Badge variant="default" size="sm">Applied / Registered</Badge>;
    }
  };

  const breadcrumbs = [
    { label: 'University', href: ROUTES.UNIVERSITY_DASHBOARD },
    { label: 'Placement Drives', href: ROUTES.PLACEMENT_DRIVES },
    { label: drive.companyName },
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        onClick={() => navigate(ROUTES.PLACEMENT_DRIVES)}
      >
        All Drives
      </Button>
      <Button
        variant="outline"
        size="sm"
        leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
        onClick={handleExportApplicants}
      >
        Export Candidates (CSV)
      </Button>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<UserPlus className="w-3.5 h-3.5" />}
        onClick={() => setIsAddApplicantModalOpen(true)}
      >
        Enroll Student
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title={`${drive.companyName} — ${drive.role}`}
      subtitle="Comprehensive drive detail, hard eligibility constraints, and candidate progression pipeline."
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="mb-4 p-3 bg-neutral-900 text-white rounded-lg text-xs flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-neutral-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Banner Card: Drive Specs */}
      <Card className="mb-6 border-neutral-200">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl border border-neutral-200 bg-white p-2.5 flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src={drive.logo}
                  alt={drive.companyName}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold text-neutral-900">{drive.companyName}</h2>
                  <Badge variant={drive.status === 'Active' ? 'success' : 'default'} size="md" dot>
                    {drive.status} Drive
                  </Badge>
                  <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium">
                    {drive.type}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-700">{drive.role}</p>
                <div className="flex items-center gap-4 text-xs text-neutral-500 pt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {drive.location || 'Bangalore'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    Drive Date: {drive.driveDate || 'TBA'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                    Deadline: {drive.deadline || 'Open'}
                  </span>
                </div>
              </div>
            </div>

            {/* Compensation Metrics Block */}
            <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-neutral-200 pt-4 lg:pt-0 lg:pl-6 shrink-0">
              <div className="text-left">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  Annual CTC
                </span>
                <span className="text-2xl font-bold text-emerald-700 tracking-tight">
                  {drive.packageCtc}
                </span>
                {drive.stipend && (
                  <span className="text-xs text-neutral-500 block mt-0.5">
                    Stipend: <strong className="text-neutral-700 font-semibold">{drive.stipend}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hard Eligibility Criteria Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-neutral-50/70 border-neutral-200">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Minimum CGPA Cutoff
            </span>
            <div className="text-xl font-bold text-neutral-900">
              ≥ {drive.eligibility?.minCgpa || 7.0}
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Cumulative through Sem 6
            </span>
          </CardContent>
        </Card>

        <Card className="bg-neutral-50/70 border-neutral-200">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Active Backlogs Policy
            </span>
            <div className="text-xl font-bold text-neutral-900">
              Max {drive.eligibility?.maxBacklogs || 0} Backlog{drive.eligibility?.maxBacklogs === 1 ? '' : 's'}
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Strictly enforced in screening
            </span>
          </CardContent>
        </Card>

        <Card className="bg-neutral-50/70 border-neutral-200">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Eligible Branches
            </span>
            <div className="text-xl font-bold text-neutral-900">
              {(drive.eligibility?.allowedBranches || []).length} Departments
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block truncate">
              {(drive.eligibility?.allowedBranches || ['CSE', 'IT']).join(', ')}
            </span>
          </CardContent>
        </Card>

        <Card className="bg-neutral-50/70 border-neutral-200">
          <CardContent className="p-4">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Eligible Batches
            </span>
            <div className="text-xl font-bold text-neutral-900">
              {(drive.eligibility?.batches || ['2025']).join(', ')}
            </div>
            <span className="text-[11px] text-neutral-500 mt-1 block">
              Graduation year verification
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Pipeline Funnel Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        {/* Stage Tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg overflow-x-auto scrollbar-thin">
          {[
            { id: 'ALL', label: 'All Candidates', count: stageCounts.ALL },
            { id: 'Registered', label: 'Registered', count: stageCounts.Registered },
            { id: 'Shortlisted', label: 'Shortlisted', count: stageCounts.Shortlisted },
            { id: 'Interview', label: 'Interview', count: stageCounts.Interview },
            { id: 'Selected', label: 'Offers / Selected', count: stageCounts.Selected },
            { id: 'Rejected', label: 'Rejected', count: stageCounts.Rejected },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveStageTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                activeStageTab === tab.id
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeStageTab === tab.id ? 'bg-neutral-100 text-neutral-900 font-bold' : 'bg-neutral-200/60 text-neutral-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search candidate in pipeline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Candidate Pipeline Table */}
      {filteredApplicants.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>CGPA & Backlogs</TableHead>
              <TableHead>AI Resume Score</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Current Stage</TableHead>
              <TableHead>Feedback / Notes</TableHead>
              <TableHead className="text-right">Stage Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplicants.map((app) => {
              const meetsCgpa = app.cgpa >= (drive.eligibility?.minCgpa || 7.0);
              const meetsBacklogs = app.backlogs <= (drive.eligibility?.maxBacklogs || 0);

              return (
                <TableRow key={app.studentId}>
                  <TableCell>
                    <div>
                      <div className="font-semibold text-xs text-neutral-900 flex items-center gap-1.5">
                        <span>{app.name}</span>
                        <span className="font-mono text-[10px] text-neutral-500 bg-neutral-100 px-1 py-0.2 rounded">
                          {app.rollNo}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400">{app.email}</div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-neutral-700">{app.department}</span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        meetsCgpa ? 'bg-neutral-100 text-neutral-900' : 'bg-red-50 text-red-700'
                      }`}>
                        {app.cgpa} CGPA
                      </span>
                      {meetsBacklogs ? (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          {app.backlogs} Backlogs
                        </span>
                      ) : (
                        <span className="text-[10px] text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                          {app.backlogs} Backlogs
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                        {app.resumeScore || 85}/100
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-neutral-500">{app.appliedDate}</span>
                  </TableCell>

                  <TableCell>
                    {getStageBadge(app.stage)}
                  </TableCell>

                  <TableCell>
                    <div className="max-w-xs truncate text-xs text-neutral-600">
                      {app.feedback ? (
                        <span title={app.feedback}>{app.feedback}</span>
                      ) : (
                        <span className="text-neutral-400 italic">No notes</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Stage Advance Buttons */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Note Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFeedbackCandidate(app);
                          setFeedbackNote(app.feedback || '');
                        }}
                        title="Add/Edit Candidate Interview Notes"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </Button>

                      {/* Advance Stage Options */}
                      {app.stage === 'Registered' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-amber-700 hover:bg-amber-50"
                          onClick={() => handleStageAdvance(app.studentId, app.name, 'Shortlisted')}
                        >
                          Shortlist
                        </Button>
                      )}

                      {app.stage === 'Shortlisted' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-700 hover:bg-blue-50"
                          onClick={() => handleStageAdvance(app.studentId, app.name, 'Interview')}
                        >
                          Interview
                        </Button>
                      )}

                      {app.stage === 'Interview' && (
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleStageAdvance(app.studentId, app.name, 'Selected')}
                        >
                          Select & Offer
                        </Button>
                      )}

                      {app.stage !== 'Selected' && app.stage !== 'Rejected' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-neutral-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleStageAdvance(app.studentId, app.name, 'Rejected')}
                          title="Reject Candidate"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      )}

                      {app.stage === 'Selected' && (
                        <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Placed
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          icon={<Users className="w-6 h-6 text-neutral-400" />}
          title={`No candidates in ${activeStageTab === 'ALL' ? 'pipeline' : activeStageTab} stage`}
          description="You can enroll eligible students directly from the university student directory."
          actionLabel="Enroll Eligible Student"
          onAction={() => setIsAddApplicantModalOpen(true)}
        />
      )}

      {/* Modal: Enroll Student into Drive */}
      <Modal
        isOpen={isAddApplicantModalOpen}
        onClose={() => setIsAddApplicantModalOpen(false)}
        title="Enroll Student in Drive"
        description={`Register an eligible candidate directly into ${drive.companyName}'s recruitment pipeline.`}
        size="lg"
      >
        <ModalBody className="space-y-4">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600">
            Hard Criteria: Min <strong>{drive.eligibility?.minCgpa || 7.0} CGPA</strong>, Max <strong>{drive.eligibility?.maxBacklogs || 0} Backlogs</strong>.
          </div>

          {eligibleDirectoryStudents.length > 0 ? (
            <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 border border-neutral-200 rounded-md">
              {eligibleDirectoryStudents.map((std) => (
                <div key={std.id} className="p-3 flex items-center justify-between hover:bg-neutral-50">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={std.avatar}
                      alt={std.name}
                      className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <div className="font-semibold text-xs text-neutral-900">{std.name} ({std.rollNo})</div>
                      <div className="text-[11px] text-neutral-400">{std.department} • {std.cgpa} CGPA</div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      addApplicantToDrive(drive.id, std);
                      showToast(`Enrolled ${std.name} into ${drive.companyName} drive.`);
                      setIsAddApplicantModalOpen(false);
                    }}
                  >
                    Enroll Candidate
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-neutral-400">
              All eligible students from the directory are already registered for this drive.
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="md" onClick={() => setIsAddApplicantModalOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal: Candidate Feedback / Notes */}
      {feedbackCandidate && (
        <Modal
          isOpen={Boolean(feedbackCandidate)}
          onClose={() => setFeedbackCandidate(null)}
          title={`Interview Notes: ${feedbackCandidate.name}`}
          description={`${feedbackCandidate.rollNo} • Current Stage: ${feedbackCandidate.stage}`}
          size="md"
        >
          <form onSubmit={handleSaveFeedback}>
            <ModalBody className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Interviewer & Placement Cell Feedback
                </label>
                <textarea
                  rows={4}
                  className="w-full text-xs p-2.5 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Cleared technical coding screening. Advanced algorithms knowledge was well articulated..."
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" size="md" onClick={() => setFeedbackCandidate(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Save Notes
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default function DriveDetail() {
  return (
    <UniversityProvider>
      <DriveDetailContent />
    </UniversityProvider>
  );
}
