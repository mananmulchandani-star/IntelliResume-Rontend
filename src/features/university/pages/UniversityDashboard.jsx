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
} from '../../../components/ui';
import { ROUTES } from '../../../constants/routes';
import { useUniversity, UniversityProvider } from '../context/UniversityContext';
import {
  Users,
  GraduationCap,
  FolderKanban,
  Building2,
  Trophy,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Briefcase,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

function UniversityDashboardContent() {
  const navigate = useNavigate();
  const { students, drives, kpis, addDrive } = useUniversity();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // New Drive Form state
  const [newDrive, setNewDrive] = useState({
    companyName: '',
    role: '',
    type: 'Full-time',
    packageCtc: '',
    stipend: '',
    driveDate: '',
    deadline: '',
    location: 'Bangalore / Hybrid',
    minCgpa: '7.0',
    maxBacklogs: '0',
    description: '',
  });

  const handleCreateDriveSubmit = (e) => {
    e.preventDefault();
    if (!newDrive.companyName || !newDrive.role || !newDrive.packageCtc) return;

    addDrive({
      ...newDrive,
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      eligibility: {
        minCgpa: Number(newDrive.minCgpa) || 7.0,
        maxBacklogs: Number(newDrive.maxBacklogs) || 0,
        allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Data Science & AI'],
        batches: ['2025'],
      },
    });

    setIsCreateModalOpen(false);
    setNewDrive({
      companyName: '',
      role: '',
      type: 'Full-time',
      packageCtc: '',
      stipend: '',
      driveDate: '',
      deadline: '',
      location: 'Bangalore / Hybrid',
      minCgpa: '7.0',
      maxBacklogs: '0',
      description: '',
    });
  };

  const handleDownloadReport = () => {
    setReportGenerated(true);
    setTimeout(() => {
      setReportGenerated(false);
    }, 3000);
  };

  // Recent placements from students
  const placedStudents = students
    .filter((s) => s.status === 'Placed' && s.placedCompany)
    .slice(0, 6);

  // Active drives
  const activeDrives = drives.filter((d) => d.status === 'Active');
  const upcomingDrives = drives.filter((d) => d.status === 'Upcoming');

  const breadcrumbs = [
    { label: 'University' },
    { label: 'Placement Dashboard' },
  ];

  const headerActions = (
    <div className="flex items-center gap-2.5">
      <Button
        variant="outline"
        size="sm"
        leftIcon={<FileSpreadsheet className="w-3.5 h-3.5" />}
        onClick={handleDownloadReport}
      >
        {reportGenerated ? 'Report Generated!' : 'Export Report'}
      </Button>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<Plus className="w-3.5 h-3.5" />}
        onClick={() => setIsCreateModalOpen(true)}
      >
        Create Drive
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Placement Operations Dashboard"
      subtitle="Real-time campus recruitment intelligence, student eligibility verification, and corporate drives tracker."
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      {/* Toast Notification */}
      {reportGenerated && (
        <div className="mb-6 p-3.5 bg-success-50 border border-success-200 text-success-800 rounded-lg flex items-center justify-between text-xs animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
            <span>Placement Summary Report (PDF & CSV) generated successfully with 2025 cohort statistics.</span>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-success-700">Ready</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {/* Card 1: Registered Students */}
        <Card className="hover:border-neutral-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Registered</span>
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 tracking-tight">{kpis.totalStudents}</div>
            <div className="mt-1 flex items-center text-xs text-neutral-500">
              <span className="text-success-600 font-medium inline-flex items-center mr-1">
                <TrendingUp className="w-3 h-3 mr-0.5" /> 100%
              </span>
              <span>profile verified</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Eligible Candidates */}
        <Card className="hover:border-neutral-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Eligible</span>
              <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 tracking-tight">{kpis.eligibleStudents}</div>
            <div className="mt-1 flex items-center text-xs text-neutral-500">
              <span className="text-neutral-700 font-medium mr-1">CGPA ≥ 6.5</span>
              <span>• 0 backlogs</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Active Drives */}
        <Card className="hover:border-neutral-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Active Drives</span>
              <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-2">
              {kpis.activeDrives}
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Live
              </span>
            </div>
            <div className="mt-1 text-xs text-neutral-500">
              <span>{kpis.upcomingDrives} upcoming this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Partner Companies */}
        <Card className="hover:border-neutral-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Companies</span>
              <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 tracking-tight">{kpis.partnerCompaniesCount}</div>
            <div className="mt-1 flex items-center text-xs text-neutral-500">
              <span className="text-purple-600 font-medium mr-1">MoU Signed</span>
              <span>corporate partners</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 5: Offers Generated */}
        <Card className="hover:border-neutral-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Offers Made</span>
              <div className="w-7 h-7 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 tracking-tight">{kpis.totalOffers}</div>
            <div className="mt-1 text-xs text-neutral-500 truncate">
              Highest <span className="font-semibold text-neutral-800">{kpis.highestPackage}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 6: Placement Rate % */}
        <Card className="hover:border-neutral-300 transition-colors bg-primary-50/40 border-primary-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary-700 uppercase tracking-wider">Placement Rate</span>
              <div className="w-7 h-7 rounded-md bg-primary-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-primary-900 tracking-tight">{kpis.placementRate}%</div>
            <div className="w-full bg-primary-200/60 rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(kpis.placementRate, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Active Drives & Recent Placements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left 2 Cols: Active Placement Drives */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">Active Placement Drives</h2>
              <p className="text-xs text-neutral-500">Live recruitment processes with active screening rounds.</p>
            </div>
            <Link
              to={ROUTES.PLACEMENT_DRIVES}
              className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
            >
              <span>View all drives</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeDrives.map((drive) => {
              const applicantsCount = drive.applicants ? drive.applicants.length : 0;
              const selectedCount = drive.applicants
                ? drive.applicants.filter((a) => a.stage === 'Selected').length
                : 0;

              return (
                <Card
                  key={drive.id}
                  variant="interactive"
                  className="flex flex-col justify-between group border-neutral-200/90 hover:border-neutral-300"
                  onClick={() => navigate(`/university/drives/${drive.id}`)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg border border-neutral-200 bg-white p-1.5 flex items-center justify-center shrink-0 shadow-xs">
                          <img
                            src={drive.logo}
                            alt={drive.companyName}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-semibold text-sm text-neutral-900 truncate">
                              {drive.companyName}
                            </h3>
                            <Badge variant="success" size="sm" dot>Live</Badge>
                          </div>
                          <p className="text-xs text-neutral-500 truncate">{drive.role}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-md bg-neutral-50 border border-neutral-100 text-xs">
                      <div>
                        <span className="text-[11px] text-neutral-400 block">Package CTC</span>
                        <span className="font-semibold text-neutral-900">{drive.packageCtc}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-neutral-400 block">Intern Stipend</span>
                        <span className="font-medium text-neutral-700">{drive.stipend || 'N/A'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{applicantsCount} applicants</span>
                        {selectedCount > 0 && (
                          <span className="text-success-600 font-medium">({selectedCount} offers)</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-neutral-500">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Ends {drive.deadline}</span>
                      </div>
                    </div>
                  </CardContent>

                  <div className="px-5 py-2.5 bg-neutral-50/70 border-t border-neutral-100 flex items-center justify-between text-xs font-medium text-neutral-600 group-hover:text-primary-600 transition-colors">
                    <span>Manage pipeline & shortlist</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Quick Eligibility & Verification Rules Highlight */}
          <Card className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white border-transparent">
            <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="info" size="sm" className="bg-white/10 text-white border-white/20">
                    Policy Engine Active
                  </Badge>
                  <span className="text-xs text-neutral-300 font-mono">Dream Option: 1 Offer Rule</span>
                </div>
                <h3 className="text-base font-semibold text-white">Automated Student Eligibility Guard</h3>
                <p className="text-xs text-neutral-300 max-w-xl">
                  InsightResume automatically restricts students with pending active backlogs or students already placed in Tier-1 Super Dream roles from applying to parallel lower-tier drives.
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/25 hover:border-white/40"
                  onClick={() => navigate(ROUTES.STUDENT_DIRECTORY)}
                >
                  Verify Students
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Upcoming Campus Schedule */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">Upcoming Drives</h2>
              <p className="text-xs text-neutral-500">Scheduled campus visits & tests.</p>
            </div>
            <Link
              to={ROUTES.PLACEMENT_DRIVES}
              className="text-xs font-medium text-primary-600 hover:text-primary-700"
            >
              Calendar
            </Link>
          </div>

          <Card>
            <CardContent className="p-4 divide-y divide-neutral-100">
              {upcomingDrives.length > 0 ? (
                upcomingDrives.map((drive) => (
                  <div key={drive.id} className="py-3 first:pt-1 last:pb-1 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-50 border border-neutral-200 p-1 flex items-center justify-center shrink-0">
                      <img
                        src={drive.logo}
                        alt={drive.companyName}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-neutral-900 truncate">
                          {drive.companyName}
                        </span>
                        <Badge variant="warning" size="sm">Scheduled</Badge>
                      </div>
                      <p className="text-xs text-neutral-500 truncate">{drive.role}</p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          {drive.driveDate}
                        </span>
                        <span className="font-medium text-neutral-700">{drive.packageCtc}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-neutral-400">
                  No upcoming drives scheduled.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats Widget */}
          <Card className="border-neutral-200">
            <CardHeader className="pb-3 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Department Placement Pace
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-neutral-800">Computer Science & Engg</span>
                  <span className="font-semibold text-neutral-900">93.5%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: '93.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-neutral-800">Data Science & AI</span>
                  <span className="font-semibold text-neutral-900">91.4%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: '91.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-neutral-800">Information Technology</span>
                  <span className="font-semibold text-neutral-900">90.0%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-primary-600 h-1.5 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-neutral-800">Electronics & Comm.</span>
                  <span className="font-semibold text-neutral-900">82.2%</span>
                </div>
                <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-neutral-400 h-1.5 rounded-full" style={{ width: '82.2%' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Student Placements Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">Recent Student Placements</h2>
            <p className="text-xs text-neutral-500">Students with confirmed offers accepted via the placement portal.</p>
          </div>
          <Link
            to={ROUTES.STUDENT_DIRECTORY}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 group"
          >
            <span>View directory</span>
            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Roll Number</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>CGPA</TableHead>
              <TableHead>Placed At</TableHead>
              <TableHead>Compensation (CTC)</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placedStudents.length > 0 ? (
              placedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <div className="font-medium text-neutral-900 text-xs">{student.name}</div>
                        <div className="text-[11px] text-neutral-400">{student.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                      {student.rollNo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-neutral-700">{student.department}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-xs text-neutral-900">{student.cgpa}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 font-medium text-xs text-neutral-900">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{student.placedCompany}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {student.packageCtc}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="success" size="sm">Offer Accepted</Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-neutral-400 text-xs">
                  No placed students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal: Create Drive */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Schedule New Placement Drive"
        description="Configure drive criteria, salary package, eligible branches, and assessment timeline."
        size="lg"
      >
        <form onSubmit={handleCreateDriveSubmit}>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                placeholder="e.g. Adobe Inc."
                required
                value={newDrive.companyName}
                onChange={(e) => setNewDrive({ ...newDrive, companyName: e.target.value })}
              />
              <Input
                label="Job Designation / Role"
                placeholder="e.g. Associate Software Engineer"
                required
                value={newDrive.role}
                onChange={(e) => setNewDrive({ ...newDrive, role: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Recruitment Type"
                value={newDrive.type}
                onChange={(e) => setNewDrive({ ...newDrive, type: e.target.value })}
                options={[
                  { value: 'Full-time', label: 'Full-time (FTE)' },
                  { value: 'Internship', label: 'Summer Internship' },
                  { value: 'FTE + Internship', label: 'FTE + 6M Internship' },
                ]}
              />
              <Input
                label="Package CTC (Annual)"
                placeholder="e.g. ₹24.0 LPA"
                required
                value={newDrive.packageCtc}
                onChange={(e) => setNewDrive({ ...newDrive, packageCtc: e.target.value })}
              />
              <Input
                label="Monthly Stipend"
                placeholder="e.g. ₹60,000 / mo"
                value={newDrive.stipend}
                onChange={(e) => setNewDrive({ ...newDrive, stipend: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Drive / Assessment Date"
                type="date"
                required
                value={newDrive.driveDate}
                onChange={(e) => setNewDrive({ ...newDrive, driveDate: e.target.value })}
              />
              <Input
                label="Application Deadline"
                type="date"
                required
                value={newDrive.deadline}
                onChange={(e) => setNewDrive({ ...newDrive, deadline: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Minimum CGPA Cutoff"
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={newDrive.minCgpa}
                onChange={(e) => setNewDrive({ ...newDrive, minCgpa: e.target.value })}
              />
              <Select
                label="Maximum Active Backlogs Allowed"
                value={newDrive.maxBacklogs}
                onChange={(e) => setNewDrive({ ...newDrive, maxBacklogs: e.target.value })}
                options={[
                  { value: '0', label: '0 Backlogs (Strict Zero)' },
                  { value: '1', label: 'Maximum 1 Backlog' },
                  { value: '2', label: 'Maximum 2 Backlogs' },
                ]}
              />
            </div>

            <Input
              label="Work Location"
              placeholder="e.g. Bangalore, Hyderabad, or Hybrid"
              value={newDrive.location}
              onChange={(e) => setNewDrive({ ...newDrive, location: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Launch Placement Drive
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

export default function UniversityDashboard() {
  return (
    <UniversityProvider>
      <UniversityDashboardContent />
    </UniversityProvider>
  );
}
