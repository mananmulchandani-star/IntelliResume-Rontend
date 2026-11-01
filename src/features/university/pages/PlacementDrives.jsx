import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Card,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  Modal,
  ModalBody,
  ModalFooter,
  EmptyState,
} from '../../../components/ui';
import { useUniversity, UniversityProvider } from '../context/UniversityContext';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Building2,
  Briefcase,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

function PlacementDrivesContent() {
  const navigate = useNavigate();
  const { drives, addDrive, updateDrive } = useUniversity();

  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'Active', 'Upcoming', 'Closed'
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [driveForm, setDriveForm] = useState({
    companyName: '',
    role: '',
    type: 'Full-time',
    packageCtc: '',
    stipend: '',
    location: 'Bangalore / Hybrid',
    driveDate: '',
    deadline: '',
    minCgpa: '7.5',
    maxBacklogs: '0',
    description: '',
    allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Data Science & AI'],
    batches: ['2025'],
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredDrives = useMemo(() => {
    return drives.filter((drive) => {
      // Tab filter
      if (activeTab !== 'ALL' && drive.status !== activeTab) return false;

      // Type filter
      if (typeFilter !== 'ALL' && drive.type !== typeFilter) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesComp = drive.companyName.toLowerCase().includes(q);
        const matchesRole = drive.role.toLowerCase().includes(q);
        const matchesLoc = (drive.location || '').toLowerCase().includes(q);
        if (!matchesComp && !matchesRole && !matchesLoc) return false;
      }

      return true;
    });
  }, [drives, activeTab, typeFilter, searchQuery]);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!driveForm.companyName || !driveForm.role || !driveForm.packageCtc) return;

    addDrive({
      ...driveForm,
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      eligibility: {
        minCgpa: parseFloat(driveForm.minCgpa) || 7.0,
        maxBacklogs: parseInt(driveForm.maxBacklogs, 10) || 0,
        allowedBranches: driveForm.allowedBranches,
        batches: driveForm.batches,
        minResumeScore: 75,
      },
    });

    setIsCreateModalOpen(false);
    showToast(`Created new placement drive for ${driveForm.companyName}`);
    setDriveForm({
      companyName: '',
      role: '',
      type: 'Full-time',
      packageCtc: '',
      stipend: '',
      location: 'Bangalore / Hybrid',
      driveDate: '',
      deadline: '',
      minCgpa: '7.5',
      maxBacklogs: '0',
      description: '',
      allowedBranches: ['Computer Science & Engineering', 'Information Technology', 'Data Science & AI'],
      batches: ['2025'],
    });
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge variant="success" size="sm" dot>Live Active</Badge>;
      case 'Upcoming':
        return <Badge variant="warning" size="sm">Upcoming</Badge>;
      case 'Closed':
        return <Badge variant="default" size="sm">Completed</Badge>;
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  const breadcrumbs = [
    { label: 'University', href: '/university' },
    { label: 'Placement Drives' },
  ];

  const headerActions = (
    <Button
      variant="primary"
      size="sm"
      leftIcon={<Plus className="w-3.5 h-3.5" />}
      onClick={() => setIsCreateModalOpen(true)}
    >
      Create Placement Drive
    </Button>
  );

  return (
    <DashboardLayout
      title="Placement Drives"
      subtitle="Organize on-campus recruitment, define strict eligibility criteria, and supervise multi-stage candidate selection."
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div className="mb-4 p-3 bg-neutral-900 text-white rounded-lg text-xs flex items-center justify-between shadow-md animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="text-neutral-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs and Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-neutral-200 pb-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg max-w-fit">
          {[
            { id: 'ALL', label: 'All Drives', count: drives.length },
            { id: 'Active', label: 'Active (Live)', count: drives.filter((d) => d.status === 'Active').length },
            { id: 'Upcoming', label: 'Upcoming', count: drives.filter((d) => d.status === 'Upcoming').length },
            { id: 'Closed', label: 'Completed', count: drives.filter((d) => d.status === 'Closed').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-neutral-100 text-neutral-800' : 'bg-neutral-200/60 text-neutral-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2.5">
          <div className="w-64">
            <Input
              placeholder="Search by company or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="w-44">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Job Types' },
                { value: 'Full-time', label: 'Full-time (FTE)' },
                { value: 'Internship', label: 'Summer Internship' },
                { value: 'FTE + Internship', label: 'FTE + Internship' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Drives Grid */}
      {filteredDrives.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredDrives.map((drive) => {
            const applicants = drive.applicants || [];
            const shortlisted = applicants.filter((a) => ['Shortlisted', 'Interview', 'Selected'].includes(a.stage)).length;
            const interviewed = applicants.filter((a) => ['Interview', 'Selected'].includes(a.stage)).length;
            const selected = applicants.filter((a) => a.stage === 'Selected').length;

            return (
              <Card
                key={drive.id}
                className="flex flex-col justify-between hover:border-neutral-300 transition-all shadow-xs group"
              >
                <CardContent className="p-5">
                  {/* Top Bar: Company, Logo & Status */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg border border-neutral-200 bg-white p-2 flex items-center justify-center shrink-0 shadow-xs">
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
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-base text-neutral-900 truncate">
                            {drive.companyName}
                          </h3>
                          {getStatusBadge(drive.status)}
                        </div>
                        <p className="text-xs text-neutral-600 truncate font-medium mt-0.5">{drive.role}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-neutral-900 block">{drive.packageCtc}</span>
                      <span className="text-[11px] text-neutral-500 block">{drive.type}</span>
                    </div>
                  </div>

                  {/* Description snippet */}
                  {drive.description && (
                    <p className="text-xs text-neutral-500 line-clamp-2 mb-4">
                      {drive.description}
                    </p>
                  )}

                  {/* Metadata Chips: Location, Drive Date, Deadline */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 bg-neutral-50 rounded-lg border border-neutral-100 text-xs mb-4">
                    <div className="flex items-center gap-1.5 text-neutral-600 truncate">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{drive.location || 'Bangalore'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-neutral-600 truncate">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{drive.driveDate ? `Drive: ${drive.driveDate}` : 'Date TBA'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-neutral-600 truncate col-span-2 sm:col-span-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>Deadline: {drive.deadline || 'Open'}</span>
                    </div>
                  </div>

                  {/* Hard Criteria Snapshot */}
                  <div className="flex items-center gap-2 flex-wrap mb-4 text-[11px]">
                    <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                      Criteria:
                    </span>
                    <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium">
                      Min {drive.eligibility?.minCgpa || 7.0} CGPA
                    </span>
                    <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium">
                      Max {drive.eligibility?.maxBacklogs || 0} Backlogs
                    </span>
                    <span className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium">
                      {(drive.eligibility?.allowedBranches || []).length} Branches
                    </span>
                  </div>

                  {/* Candidate Pipeline Progress Funnel */}
                  <div className="border-t border-neutral-100 pt-3">
                    <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
                      <span className="font-medium text-neutral-700">Recruitment Funnel</span>
                      <span>
                        <strong className="text-neutral-900 font-semibold">{applicants.length}</strong> Applied •{' '}
                        <strong className="text-success-700 font-semibold">{selected}</strong> Selected
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                      <div className="p-1.5 rounded bg-blue-50 text-blue-800 font-medium">
                        <div>{applicants.length}</div>
                        <div className="text-[9px] text-blue-600">Registered</div>
                      </div>
                      <div className="p-1.5 rounded bg-purple-50 text-purple-800 font-medium">
                        <div>{shortlisted}</div>
                        <div className="text-[9px] text-purple-600">Shortlisted</div>
                      </div>
                      <div className="p-1.5 rounded bg-amber-50 text-amber-800 font-medium">
                        <div>{interviewed}</div>
                        <div className="text-[9px] text-amber-600">Interview</div>
                      </div>
                      <div className="p-1.5 rounded bg-emerald-50 text-emerald-800 font-semibold">
                        <div>{selected}</div>
                        <div className="text-[9px] text-emerald-700">Offers</div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Footer Action Bar */}
                <div className="px-5 py-3 bg-neutral-50/75 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Select
                      size="sm"
                      value={drive.status}
                      onChange={(e) => {
                        updateDrive(drive.id, { status: e.target.value });
                        showToast(`Updated status of ${drive.companyName} drive to ${e.target.value}`);
                      }}
                      options={[
                        { value: 'Active', label: 'Active (Live)' },
                        { value: 'Upcoming', label: 'Upcoming' },
                        { value: 'Closed', label: 'Closed' },
                      ]}
                      className="h-7 text-xs py-0.5"
                    />
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => navigate(`/university/drives/${drive.id}`)}
                  >
                    Manage Candidates & Rules
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<FolderKanban className="w-6 h-6 text-neutral-400" />}
          title="No placement drives found"
          description="There are no recruitment drives matching your current filter selections."
          actionLabel="Create Placement Drive"
          onAction={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Modal: Create Drive */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Placement Drive"
        description="Launch an official campus placement drive with company credentials and eligibility criteria."
        size="lg"
      >
        <form onSubmit={handleCreateSubmit}>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                placeholder="e.g. Cisco Systems, Atlassian"
                required
                value={driveForm.companyName}
                onChange={(e) => setDriveForm({ ...driveForm, companyName: e.target.value })}
              />
              <Input
                label="Role Title"
                placeholder="e.g. Software Engineer (SDE-1)"
                required
                value={driveForm.role}
                onChange={(e) => setDriveForm({ ...driveForm, role: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Employment Type"
                value={driveForm.type}
                onChange={(e) => setDriveForm({ ...driveForm, type: e.target.value })}
                options={[
                  { value: 'Full-time', label: 'Full-time (FTE)' },
                  { value: 'Internship', label: 'Summer Internship' },
                  { value: 'FTE + Internship', label: 'FTE + Internship' },
                ]}
              />
              <Input
                label="Package CTC (Annual)"
                placeholder="e.g. ₹28.0 LPA"
                required
                value={driveForm.packageCtc}
                onChange={(e) => setDriveForm({ ...driveForm, packageCtc: e.target.value })}
              />
              <Input
                label="Monthly Stipend"
                placeholder="e.g. ₹80,000 / mo"
                value={driveForm.stipend}
                onChange={(e) => setDriveForm({ ...driveForm, stipend: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Drive / Online Test Date"
                type="date"
                required
                value={driveForm.driveDate}
                onChange={(e) => setDriveForm({ ...driveForm, driveDate: e.target.value })}
              />
              <Input
                label="Registration Deadline"
                type="date"
                required
                value={driveForm.deadline}
                onChange={(e) => setDriveForm({ ...driveForm, deadline: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Minimum CGPA Requirement"
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={driveForm.minCgpa}
                onChange={(e) => setDriveForm({ ...driveForm, minCgpa: e.target.value })}
              />
              <Select
                label="Max Backlogs Allowed"
                value={driveForm.maxBacklogs}
                onChange={(e) => setDriveForm({ ...driveForm, maxBacklogs: e.target.value })}
                options={[
                  { value: '0', label: '0 Backlogs (Strict Zero)' },
                  { value: '1', label: '1 Active Backlog' },
                  { value: '2', label: '2 Active Backlogs' },
                ]}
              />
            </div>

            <Input
              label="Work Location"
              placeholder="e.g. Bangalore, Hyderabad, or Remote"
              value={driveForm.location}
              onChange={(e) => setDriveForm({ ...driveForm, location: e.target.value })}
            />

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Role Description & Requirements
              </label>
              <textarea
                rows={3}
                className="w-full text-xs p-2.5 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Brief outline of candidate profile, tech stack expectations, and interview process..."
                value={driveForm.description}
                onChange={(e) => setDriveForm({ ...driveForm, description: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Publish Placement Drive
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

export default function PlacementDrives() {
  return (
    <UniversityProvider>
      <PlacementDrivesContent />
    </UniversityProvider>
  );
}
