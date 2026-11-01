import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Briefcase,
  Plus,
  Search,
  Filter,
  Users,
  Edit2,
  Trash2,
  CheckCircle2,
  PauseCircle,
  Eye,
  ExternalLink,
  MapPin,
  DollarSign,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import clsx from 'clsx';

export default function JobListings() {
  const navigate = useNavigate();
  const { jobs, toggleJobStatus, deleteJob } = useCompanyData();

  // Filters state
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [jobToDelete, setJobToDelete] = useState(null);

  // Compute status counts
  const counts = useMemo(() => {
    return {
      all: jobs.length,
      active: jobs.filter((j) => j.status === 'Active').length,
      paused: jobs.filter((j) => j.status === 'Paused').length,
      closed: jobs.filter((j) => j.status === 'Closed').length,
    };
  }, [jobs]);

  // Filtered jobs list
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Status filter
      if (statusFilter !== 'All' && job.status !== statusFilter) {
        return false;
      }
      // Type filter
      if (typeFilter !== 'All' && job.type !== typeFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = job.title?.toLowerCase().includes(query);
        const deptMatch = job.department?.toLowerCase().includes(query);
        const skillsMatch = job.skills?.some((s) => s.toLowerCase().includes(query));
        if (!titleMatch && !deptMatch && !skillsMatch) {
          return false;
        }
      }
      return true;
    });
  }, [jobs, statusFilter, typeFilter, searchQuery]);

  // Total applicants across current jobs
  const totalApplicants = useMemo(() => {
    return jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);
  }, [jobs]);

  const handleDeleteConfirm = () => {
    if (jobToDelete) {
      deleteJob(jobToDelete.id);
      setJobToDelete(null);
    }
  };

  return (
    <DashboardLayout
      title="Job & Internship Listings"
      subtitle="Manage active job openings, applicant intake pipelines, and vacancy statuses."
      breadcrumbs={[
        { label: 'Employer Portal', href: ROUTES.COMPANY_DASHBOARD },
        { label: 'Manage Vacancies' },
      ]}
      actions={
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={() => navigate(ROUTES.JOB_EDITOR)}
        >
          Post New Role
        </Button>
      }
    >
      <div className="space-y-6">
        {/* ============================================================ */}
        {/* TOP SUMMARY STATS                                            */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border-neutral-200">
            <div className="text-[11px] font-semibold uppercase text-neutral-400 tracking-wider">
              Total Listings
            </div>
            <div className="text-2xl font-bold text-neutral-900 mt-1">
              {counts.all}
            </div>
          </Card>

          <Card className="p-4 bg-white border-neutral-200">
            <div className="text-[11px] font-semibold uppercase text-emerald-600 tracking-wider">
              Active & Live
            </div>
            <div className="text-2xl font-bold text-neutral-900 mt-1">
              {counts.active}
            </div>
          </Card>

          <Card className="p-4 bg-white border-neutral-200">
            <div className="text-[11px] font-semibold uppercase text-amber-600 tracking-wider">
              Paused
            </div>
            <div className="text-2xl font-bold text-neutral-900 mt-1">
              {counts.paused}
            </div>
          </Card>

          <Card className="p-4 bg-white border-neutral-200">
            <div className="text-[11px] font-semibold uppercase text-primary-600 tracking-wider">
              Total Applicants
            </div>
            <div className="text-2xl font-bold text-neutral-900 mt-1">
              {totalApplicants}
            </div>
          </Card>
        </div>

        {/* ============================================================ */}
        {/* CONTROLS & FILTER BAR                                        */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-neutral-200">
          {/* Status Tabs Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg overflow-x-auto scrollbar-thin">
            {[
              { id: 'All', label: 'All Listings', count: counts.all },
              { id: 'Active', label: 'Active', count: counts.active },
              { id: 'Paused', label: 'Paused', count: counts.paused },
              { id: 'Closed', label: 'Closed', count: counts.closed },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={clsx(
                  'flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer select-none',
                  statusFilter === tab.id
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={clsx(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-bold',
                    statusFilter === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-neutral-200 text-neutral-600'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Type dropdown */}
          <div className="flex items-center gap-3">
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search role, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
              />
            </div>

            <div className="w-36">
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                options={[
                  { value: 'All', label: 'All Types' },
                  { value: 'Full-time', label: 'Full-time' },
                  { value: 'Internship', label: 'Internship' },
                  { value: 'Contract', label: 'Contract' },
                ]}
              />
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* LISTINGS TABLE                                               */}
        {/* ============================================================ */}
        {filteredJobs.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Role Title & Department</TableHead>
                <TableHead>Type & Mode</TableHead>
                <TableHead>Compensation</TableHead>
                <TableHead>Applicants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => {
                const isActive = job.status === 'Active';
                return (
                  <TableRow key={job.id}>
                    {/* Role Title & Dept */}
                    <TableCell>
                      <div className="space-y-1">
                        <Link
                          to={`${ROUTES.CANDIDATE_MANAGER}?jobId=${job.id}`}
                          className="font-semibold text-sm text-neutral-900 hover:text-primary-600 transition-colors flex items-center gap-1.5 group"
                        >
                          <span className="truncate">{job.title}</span>
                          <ExternalLink className="w-3 h-3 text-neutral-400 group-hover:text-primary-600 shrink-0" />
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-neutral-400" />
                            {job.location}
                          </span>
                        </div>
                        {/* Skills */}
                        <div className="flex items-center gap-1 pt-0.5 flex-wrap">
                          {job.skills?.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills?.length > 3 && (
                            <span className="text-[10px] text-neutral-400">
                              +{job.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Type & Mode */}
                    <TableCell>
                      <div className="space-y-1">
                        <Badge
                          variant={job.type === 'Internship' ? 'warning' : 'info'}
                          size="sm"
                        >
                          {job.type}
                        </Badge>
                        <div className="text-[11px] text-neutral-500 font-medium">
                          {job.workMode}
                        </div>
                      </div>
                    </TableCell>

                    {/* Compensation */}
                    <TableCell>
                      <div className="text-xs font-semibold text-neutral-800">
                        ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        per {job.salaryPeriod === 'mo' ? 'month' : 'year'}
                      </div>
                    </TableCell>

                    {/* Applicants */}
                    <TableCell>
                      <Link
                        to={`${ROUTES.CANDIDATE_MANAGER}?jobId=${job.id}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-50 hover:bg-primary-50 border border-neutral-200 hover:border-primary-200 text-neutral-700 hover:text-primary-700 transition-colors group"
                      >
                        <Users className="w-3.5 h-3.5 text-neutral-400 group-hover:text-primary-600" />
                        <span className="text-xs font-bold">{job.applicantsCount || 0}</span>
                      </Link>
                    </TableCell>

                    {/* Status & Quick Toggle */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            job.status === 'Active'
                              ? 'success'
                              : job.status === 'Paused'
                              ? 'warning'
                              : 'default'
                          }
                          size="sm"
                          dot
                        >
                          {job.status}
                        </Badge>

                        {/* Status Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => toggleJobStatus(job.id)}
                          className={clsx(
                            'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500',
                            isActive ? 'bg-emerald-500' : 'bg-neutral-300'
                          )}
                          title={`Switch to ${isActive ? 'Paused' : 'Active'}`}
                        >
                          <span
                            aria-hidden="true"
                            className={clsx(
                              'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out',
                              isActive ? 'translate-x-4' : 'translate-x-0'
                            )}
                          />
                        </button>
                      </div>
                    </TableCell>

                    {/* Deadline */}
                    <TableCell>
                      <div className="text-xs text-neutral-600 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                        {job.deadline}
                      </div>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Candidates"
                          onClick={() => navigate(`${ROUTES.CANDIDATE_MANAGER}?jobId=${job.id}`)}
                        >
                          <Users className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Edit Listing"
                          onClick={() => navigate(`${ROUTES.JOB_EDITOR}?id=${job.id}`)}
                        >
                          <Edit2 className="w-3.5 h-3.5 text-neutral-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Delete Listing"
                          onClick={() => setJobToDelete(job)}
                          className="hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-neutral-400 hover:text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="No vacancies match your criteria"
            description="Try modifying your status filter or search query, or create a brand new vacancy."
            actionLabel="Create New Listing"
            onAction={() => navigate(ROUTES.JOB_EDITOR)}
          />
        )}
      </div>

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION MODAL                                    */}
      {/* ============================================================ */}
      {jobToDelete && (
        <Modal
          isOpen={Boolean(jobToDelete)}
          onClose={() => setJobToDelete(null)}
          title="Delete Vacancy Listing"
          description={`Are you sure you want to remove "${jobToDelete.title}"?`}
        >
          <ModalBody className="space-y-3">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>
                This will delete the job listing and dissociate {jobToDelete.applicantsCount || 0} candidate applications from the portal. This action cannot be undone.
              </span>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setJobToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteConfirm}
            >
              Confirm Deletion
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
}
