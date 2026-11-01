import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
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
  GraduationCap,
  Building2,
  Calendar,
  CheckCircle2,
  Users,
  Search,
  Plus,
  ArrowRight,
  ExternalLink,
  MapPin,
  Mail,
  Award,
  Sparkles,
  Check,
  Clock,
  Send,
} from 'lucide-react';
import clsx from 'clsx';

export default function UniversityRecruitment() {
  const {
    universities,
    drives,
    batches,
    jobs,
    toggleDriveParticipation,
    registerCampusDrive,
    toggleUniversityPartner,
  } = useCompanyData();

  // Active sub-navigation tab
  const [activeTab, setActiveTab] = useState('drives'); // 'drives' | 'universities' | 'batches'

  // Modals
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [selectedBatchForInvite, setSelectedBatchForInvite] = useState(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // New Drive Registration form state
  const [newDriveName, setNewDriveName] = useState('');
  const [newDriveUniv, setNewDriveUniv] = useState(universities[0]?.id || '');
  const [newDriveRole, setNewDriveRole] = useState(jobs[0]?.title || '');
  const [newDriveStartDate, setNewDriveStartDate] = useState('2026-12-10');
  const [newDriveEndDate, setNewDriveEndDate] = useState('2026-12-12');
  const [newDriveMode, setNewDriveMode] = useState('Hybrid (Campus + Virtual)');

  // University search filter
  const [univSearch, setUnivSearch] = useState('');

  // Verified batches filter
  const [batchYearFilter, setBatchYearFilter] = useState('All');
  const [minCgpaFilter, setMinCgpaFilter] = useState('All');

  // Filtered universities
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      if (!univSearch.trim()) return true;
      const q = univSearch.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q) ||
        u.topPrograms.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [universities, univSearch]);

  // Filtered batches
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      if (batchYearFilter !== 'All' && !b.batchName.includes(batchYearFilter)) {
        return false;
      }
      if (minCgpaFilter !== 'All') {
        const threshold = Number(minCgpaFilter);
        if (b.avgCgpa < threshold) return false;
      }
      return true;
    });
  }, [batches, batchYearFilter, minCgpaFilter]);

  // Submit new drive registration
  const handleRegisterDriveSubmit = (e) => {
    e.preventDefault();
    if (!newDriveName.trim()) return;

    const selectedUnivObj = universities.find((u) => u.id === newDriveUniv);

    registerCampusDrive({
      name: newDriveName.trim(),
      universityId: newDriveUniv,
      universityName: selectedUnivObj ? selectedUnivObj.name : 'University Partner',
      targetRoles: [newDriveRole],
      startDate: newDriveStartDate,
      endDate: newDriveEndDate,
      mode: newDriveMode,
      eligibleBatches: ['Class of 2025', 'Class of 2026'],
      location: selectedUnivObj?.location || 'Campus Center',
      contactPerson: selectedUnivObj?.placementOfficer || 'Campus Placement Office',
      notes: 'Drive successfully registered by employer.',
    });

    setIsDriveModalOpen(false);
    setNewDriveName('');
  };

  const handleSendBatchInvite = () => {
    setInviteSuccess(true);
    setTimeout(() => {
      setInviteSuccess(false);
      setSelectedBatchForInvite(null);
    }, 1500);
  };

  return (
    <DashboardLayout
      title="University Recruitment & Campus Placements"
      subtitle="Connect with premier university placement cells, participate in structured campus drives, and recruit verified talent batches."
      breadcrumbs={[
        { label: 'Employer Portal', href: ROUTES.COMPANY_DASHBOARD },
        { label: 'Campus Recruitment' },
      ]}
      actions={
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => setIsDriveModalOpen(true)}
        >
          Register for Campus Drive
        </Button>
      }
    >
      <div className="space-y-6">
        {/* ============================================================ */}
        {/* SECTION NAV PILLS                                            */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 p-1 bg-white border border-neutral-200 rounded-lg">
          {[
            { id: 'drives', label: 'College Placement Drives', count: drives.length, icon: Calendar },
            { id: 'universities', label: 'Connected Universities', count: universities.length, icon: Building2 },
            { id: 'batches', label: 'Verified Campus Batches', count: batches.length, icon: GraduationCap },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-md transition-all cursor-pointer select-none',
                  isCurrent
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                )}
              >
                <Icon className={clsx('w-4 h-4', isCurrent ? 'text-white' : 'text-neutral-400')} />
                <span>{tab.label}</span>
                <span
                  className={clsx(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                    isCurrent ? 'bg-neutral-700 text-white' : 'bg-neutral-100 text-neutral-600'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* TAB 1: PLACEMENT DRIVES                                      */}
        {/* ============================================================ */}
        {activeTab === 'drives' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Campus Placement Drive Schedule
                </h3>
                <p className="text-xs text-neutral-500">
                  Participate in coordinated campus recruiting drives with verified student batch intakes.
                </p>
              </div>

              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {drives.filter((d) => d.participating).length} Drives Confirmed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drives.map((drive) => (
                <Card
                  key={drive.id}
                  className={clsx(
                    'p-5 transition-all relative overflow-hidden',
                    drive.participating
                      ? 'border-emerald-200 bg-white shadow-xs'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  )}
                >
                  {/* Status header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={drive.status === 'Completed' ? 'default' : 'info'}
                          size="sm"
                        >
                          {drive.status}
                        </Badge>
                        <span className="text-xs font-semibold text-neutral-500">
                          {drive.mode}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-neutral-900 truncate">
                        {drive.name}
                      </h4>
                      <p className="text-xs text-primary-700 font-semibold flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5" />
                        {drive.universityName}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleDriveParticipation(drive.id)}
                      className={clsx(
                        'px-3 py-1.5 rounded-md text-xs font-semibold transition-all shrink-0 cursor-pointer',
                        drive.participating
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-primary-600 text-white hover:bg-primary-700 shadow-xs'
                      )}
                    >
                      {drive.participating ? (
                        <span className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" /> Participating
                        </span>
                      ) : (
                        'Participate in Drive'
                      )}
                    </button>
                  </div>

                  {/* Details grid */}
                  <div className="mt-4 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-neutral-400 block font-medium">Dates & Timeline</span>
                      <span className="font-semibold text-neutral-800 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {drive.startDate} to {drive.endDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-[11px] text-neutral-400 block font-medium">Registered Pool</span>
                      <span className="font-semibold text-neutral-800 flex items-center gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-neutral-400" />
                        {drive.registeredStudents} Candidates
                      </span>
                    </div>

                    <div className="col-span-2">
                      <span className="text-[11px] text-neutral-400 block font-medium">Target Vacancies</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {drive.targetRoles?.map((role) => (
                          <span
                            key={role}
                            className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-medium"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer note */}
                  <div className="mt-3.5 pt-3 border-t border-neutral-100/70 text-[11px] text-neutral-500 flex items-center justify-between">
                    <span className="truncate">TPO Contact: {drive.contactPerson}</span>
                    <span className="text-neutral-400 text-[10px] shrink-0">{drive.location}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: CONNECTED UNIVERSITIES DIRECTORY                      */}
        {/* ============================================================ */}
        {activeTab === 'universities' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Partner Institutional Placement Cells
                </h3>
                <p className="text-xs text-neutral-500">
                  Manage Memorandums of Understanding (MoU) and institutional recruiting agreements.
                </p>
              </div>

              <div className="w-64">
                <Input
                  placeholder="Search university or campus..."
                  value={univSearch}
                  onChange={(e) => setUnivSearch(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUniversities.map((univ) => {
                const isPartnered = univ.status === 'Partnered';
                return (
                  <Card key={univ.id} className="p-5 flex flex-col justify-between hover:border-neutral-300 transition-all">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <img
                          src={univ.logo}
                          alt={univ.name}
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-200"
                        />
                        <Badge
                          variant={isPartnered ? 'success' : 'default'}
                          size="sm"
                          dot={isPartnered}
                        >
                          {univ.status}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 leading-snug">
                          {univ.name}
                        </h4>
                        <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                          {univ.location}
                        </p>
                      </div>

                      <div className="text-xs space-y-1.5 py-2 border-y border-neutral-100">
                        <div className="flex justify-between text-neutral-600">
                          <span>Institutional Tier:</span>
                          <span className="font-semibold text-neutral-900">{univ.tier}</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                          <span>Eligible Graduating Pool:</span>
                          <span className="font-semibold text-neutral-900">{univ.eligibleGrads} students</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                          <span>Placed Alumni at Company:</span>
                          <span className="font-semibold text-emerald-700">{univ.placedAlumniCount} hires</span>
                        </div>
                        <div className="flex justify-between text-neutral-600">
                          <span>MoU Agreement:</span>
                          <span className="font-semibold text-neutral-700">{univ.mouValidTill}</span>
                        </div>
                      </div>

                      {/* Top programs */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                          Key Academic Cohorts
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {univ.topPrograms?.map((prog) => (
                            <span
                              key={prog}
                              className="text-[10px] bg-neutral-100 text-neutral-700 px-1.5 py-0.5 rounded"
                            >
                              {prog}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                      <a
                        href={`mailto:${univ.contactEmail}`}
                        className="text-xs text-neutral-500 hover:text-primary-600 flex items-center gap-1 font-medium"
                      >
                        <Mail className="w-3 h-3" /> Contact TPO
                      </a>
                      <Button
                        variant={isPartnered ? 'outline' : 'primary'}
                        size="sm"
                        onClick={() => toggleUniversityPartner(univ.id)}
                      >
                        {isPartnered ? 'Manage MoU' : 'Connect Cell'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: VERIFIED CAMPUS BATCHES                               */}
        {/* ============================================================ */}
        {activeTab === 'batches' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  Verified Campus Student Cohorts
                </h3>
                <p className="text-xs text-neutral-500">
                  Talent pools verified directly by university placement cells with verified grades and credentials.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-36">
                  <Select
                    value={batchYearFilter}
                    onChange={(e) => setBatchYearFilter(e.target.value)}
                    options={[
                      { value: 'All', label: 'All Batches' },
                      { value: '2025', label: 'Batch 2025' },
                      { value: '2026', label: 'Batch 2026' },
                    ]}
                  />
                </div>

                <div className="w-40">
                  <Select
                    value={minCgpaFilter}
                    onChange={(e) => setMinCgpaFilter(e.target.value)}
                    options={[
                      { value: 'All', label: 'Any CGPA' },
                      { value: '3.8', label: 'CGPA >= 3.8 / 9.0' },
                      { value: '3.5', label: 'CGPA >= 3.5 / 8.5' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBatches.map((batch) => (
                <Card key={batch.id} className="p-5 hover:border-neutral-300 transition-all space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {batch.university}
                      </span>
                      <h4 className="text-base font-bold text-neutral-900 pt-1">
                        {batch.batchName}
                      </h4>
                      <p className="text-xs text-neutral-400">{batch.accreditation}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-extrabold text-neutral-900">
                        {batch.totalStudents}
                      </div>
                      <div className="text-[10px] text-neutral-400 uppercase font-semibold">
                        Total Students
                      </div>
                    </div>
                  </div>

                  {/* Batch Highlights Grid */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-neutral-50 border border-neutral-100 text-center">
                    <div>
                      <div className="text-xs text-neutral-400">Verified Profiles</div>
                      <div className="text-sm font-bold text-neutral-900 mt-0.5">
                        {batch.verifiedProfiles}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-400">Cohort Avg CGPA</div>
                      <div className="text-sm font-bold text-emerald-700 mt-0.5">
                        {batch.avgCgpa}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-400">Seeking Placement</div>
                      <div className="text-sm font-bold text-primary-700 mt-0.5">
                        {batch.availableForHire}
                      </div>
                    </div>
                  </div>

                  {/* Competencies */}
                  <div>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Top Technical Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {batch.topSkills?.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs font-semibold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-500 font-medium">
                      Status: {batch.placementRate}
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                      onClick={() => setSelectedBatchForInvite(batch)}
                    >
                      Invite Batch to Apply
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: REGISTER CAMPUS RECRUITMENT DRIVE                     */}
      {/* ============================================================ */}
      {isDriveModalOpen && (
        <Modal
          isOpen={isDriveModalOpen}
          onClose={() => setIsDriveModalOpen(false)}
          title="Register New College Placement Drive"
          description="Schedule a campus placement visit or virtual test window with partner institutions."
        >
          <form onSubmit={handleRegisterDriveSubmit}>
            <ModalBody className="space-y-4">
              <Input
                label="Placement Drive Title"
                placeholder="e.g. Stanford Spring Engineering Recruitment 2027"
                value={newDriveName}
                onChange={(e) => setNewDriveName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Select
                  label="Target University"
                  value={newDriveUniv}
                  onChange={(e) => setNewDriveUniv(e.target.value)}
                  options={universities.map((u) => ({ value: u.id, label: u.name }))}
                />

                <Select
                  label="Primary Vacancy Role"
                  value={newDriveRole}
                  onChange={(e) => setNewDriveRole(e.target.value)}
                  options={jobs.map((j) => ({ value: j.title, label: j.title }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Drive Start Date"
                  type="date"
                  value={newDriveStartDate}
                  onChange={(e) => setNewDriveStartDate(e.target.value)}
                  required
                />
                <Input
                  label="Drive End Date"
                  type="date"
                  value={newDriveEndDate}
                  onChange={(e) => setNewDriveEndDate(e.target.value)}
                  required
                />
              </div>

              <Select
                label="Drive Format & Modality"
                value={newDriveMode}
                onChange={(e) => setNewDriveMode(e.target.value)}
                options={[
                  { value: 'Hybrid (Campus + Virtual)', label: 'Hybrid (Campus Keynote + Virtual Code Test)' },
                  { value: 'On-Campus In Person', label: '100% On-Campus In Person' },
                  { value: 'Virtual Platform', label: '100% Virtual InsightResume Hub' },
                ]}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDriveModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Confirm Drive Registration
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}

      {/* ============================================================ */}
      {/* MODAL: INVITE BATCH TO APPLY                                 */}
      {/* ============================================================ */}
      {selectedBatchForInvite && (
        <Modal
          isOpen={Boolean(selectedBatchForInvite)}
          onClose={() => setSelectedBatchForInvite(null)}
          title={`Invite Batch: ${selectedBatchForInvite.batchName}`}
          description={`Directly notify ${selectedBatchForInvite.availableForHire} seeking students at ${selectedBatchForInvite.university}.`}
        >
          <ModalBody className="space-y-4">
            {inviteSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-xs font-semibold">
                  Batch invitations dispatched to student inboxes and university placement dashboard!
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600">
                  An official employer invitation link will be sent to the university placement officer and registered candidate inboxes for one-click application submission with verified credentials.
                </div>

                <Select
                  label="Select Role to Invite Batch Towards"
                  defaultValue={jobs[0]?.title}
                  options={jobs.map((j) => ({ value: j.title, label: `${j.title} (${j.type})` }))}
                />

                <div className="text-xs text-neutral-500">
                  Estimated eligible candidate reach: <strong>{selectedBatchForInvite.availableForHire} verified profiles</strong> with average CGPA {selectedBatchForInvite.avgCgpa}.
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedBatchForInvite(null)}
            >
              Close
            </Button>
            {!inviteSuccess && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Send className="w-3.5 h-3.5" />}
                onClick={handleSendBatchInvite}
              >
                Send Official Invites
              </Button>
            )}
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
}
