// src/features/student/pages/ApplicationTracker.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Button,
  Card,
  Badge,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Select,
} from '../../../components/ui';
import { Textarea } from '../../../components/ui/Input';
import {
  Layers,
  Plus,
  Search,
  Kanban,
  List,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Briefcase,
} from 'lucide-react';

const STAGES = [
  { id: 'Saved', label: 'Saved', color: 'bg-neutral-100 text-neutral-800' },
  { id: 'Applied', label: 'Applied', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  { id: 'Under Review', label: 'Under Review', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'Interviewing', label: 'Interviewing', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  { id: 'Offer Received', label: 'Offer Received', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { id: 'Rejected', label: 'Archived', color: 'bg-neutral-100 text-neutral-600' },
];

export default function ApplicationTracker() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const [newAppForm, setNewAppForm] = useState({
    company: '',
    position: '',
    location: 'Remote',
    status: 'Applied',
    salary: '',
    notes: '',
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('jobApplications');
      if (saved) {
        setApplications(JSON.parse(saved));
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Error loading applications:', err);
    }
  }, []);

  const saveApplications = (updated) => {
    setApplications(updated);
    try {
      localStorage.setItem('jobApplications', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving applications to localStorage:', e);
    }
  };

  const handleStatusChange = (appId, newStatus) => {
    const updated = applications.map((app) =>
      app.id === appId ? { ...app, status: newStatus } : app
    );
    saveApplications(updated);
  };

  const handleDelete = (appId) => {
    const updated = applications.filter((a) => a.id !== appId);
    saveApplications(updated);
  };

  const handleCreateApplication = (e) => {
    e.preventDefault();
    if (!newAppForm.company || !newAppForm.position) return;

    const newApp = {
      id: `app-${Date.now()}`,
      ...newAppForm,
      appliedDate: new Date().toISOString().split('T')[0],
    };

    saveApplications([newApp, ...applications]);
    setIsNewModalOpen(false);
    setNewAppForm({
      company: '',
      position: '',
      location: 'Remote',
      status: 'Applied',
      salary: '',
      notes: '',
    });
  };

  const filteredApps = applications.filter((app) =>
    app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const totalApps = applications.length;
  const interviewingCount = applications.filter((a) => a.status === 'Interviewing').length;
  const offersCount = applications.filter((a) => a.status === 'Offer Received').length;

  return (
    <DashboardLayout
      title="Application Pipeline"
      subtitle="Track your campus placements, interview stages, and offers in an interactive Kanban board."
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Briefcase className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.JOB_PORTAL)}
          >
            Explore Jobs
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsNewModalOpen(true)}
          >
            Add Application
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 border-neutral-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Total Tracked
              </p>
              <h3 className="text-2xl font-black text-neutral-900 mt-0.5">{totalApps}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-4 border-neutral-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
                Interviews Active
              </p>
              <h3 className="text-2xl font-black text-neutral-900 mt-0.5">{interviewingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-4 border-neutral-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                Offers Received
              </p>
              <h3 className="text-2xl font-black text-neutral-900 mt-0.5">{offersCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* Filters & View Switcher */}
        <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Input
              leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              Board
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Table
            </button>
          </div>
        </div>

        {/* KANBAN BOARD VIEW */}
        {viewMode === 'kanban' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
            {STAGES.map((stage) => {
              const stageApps = filteredApps.filter((a) => a.status === stage.id);
              return (
                <div
                  key={stage.id}
                  className="bg-neutral-100/60 rounded-xl p-3 border border-neutral-200/80 min-w-[220px] space-y-3"
                >
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      {stage.label}
                    </span>
                    <span className="text-xs font-bold text-neutral-500 bg-white px-2 py-0.5 rounded-full border border-neutral-200 shadow-2xs">
                      {stageApps.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {stageApps.map((app) => (
                      <Card
                        key={app.id}
                        className="p-3.5 border-neutral-200 shadow-2xs bg-white space-y-2 group hover:border-neutral-300 transition-all"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-xs text-neutral-900 leading-tight">
                            {app.company}
                          </h4>
                          <button
                            type="button"
                            aria-label="Delete Application"
                            onClick={() => handleDelete(app.id)}
                            className="text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] text-neutral-600 font-medium line-clamp-1">
                          {app.position}
                        </p>

                        <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {app.appliedDate}
                        </div>

                        {app.notes && (
                          <p className="text-[10px] text-neutral-500 bg-neutral-50 p-1.5 rounded border border-neutral-100 line-clamp-2">
                            {app.notes}
                          </p>
                        )}

                        {/* Move stage control */}
                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="text-[10px] bg-neutral-50 border border-neutral-200 rounded px-1.5 py-1 text-neutral-700 font-semibold cursor-pointer"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                Move: {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Card>
                    ))}

                    {stageApps.length === 0 && (
                      <div className="py-6 text-center text-[11px] text-neutral-400 font-medium">
                        No applications
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* TABULAR VIEW */
          <div className="bg-white rounded-lg border border-neutral-200 shadow-xs overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company & Role</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Compensation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-bold text-neutral-900 text-xs">{app.company}</div>
                      <div className="text-xs text-neutral-500">{app.position}</div>
                    </TableCell>
                    <TableCell className="text-xs text-neutral-600">{app.location}</TableCell>
                    <TableCell className="text-xs text-neutral-500">{app.appliedDate}</TableCell>
                    <TableCell>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="text-xs bg-neutral-50 border border-neutral-200 rounded px-2 py-1 font-semibold"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-neutral-700">{app.salary || '—'}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(app.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Manual Application Modal */}
      <Modal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} size="md">
        <ModalHeader onClose={() => setIsNewModalOpen(false)} showCloseButton={true}>
          <h3 className="text-base font-bold text-neutral-900">Track New Application</h3>
          <p className="text-xs text-neutral-500">Record a position applied through campus drives or external job portals.</p>
        </ModalHeader>
        <form onSubmit={handleCreateApplication}>
          <ModalBody className="space-y-4 p-6">
            <Input
              label="Company Name"
              required
              placeholder="e.g. Google, Amazon, Vercel"
              value={newAppForm.company}
              onChange={(e) => setNewAppForm({ ...newAppForm, company: e.target.value })}
            />
            <Input
              label="Job Title / Role"
              required
              placeholder="e.g. Software Engineering Intern"
              value={newAppForm.position}
              onChange={(e) => setNewAppForm({ ...newAppForm, position: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Location"
                placeholder="e.g. Remote, Seattle, WA"
                value={newAppForm.location}
                onChange={(e) => setNewAppForm({ ...newAppForm, location: e.target.value })}
              />
              <Input
                label="Salary / Hourly Rate"
                placeholder="e.g. $55/hr or $120k"
                value={newAppForm.salary}
                onChange={(e) => setNewAppForm({ ...newAppForm, salary: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Current Pipeline Stage
              </label>
              <select
                value={newAppForm.status}
                onChange={(e) => setNewAppForm({ ...newAppForm, status: e.target.value })}
                className="w-full text-xs bg-white border border-neutral-300 rounded-lg p-2.5 font-medium"
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <Textarea
              label="Notes & Interview Dates"
              rows={3}
              placeholder="e.g. HR round cleared, next technical round on Friday..."
              value={newAppForm.notes}
              onChange={(e) => setNewAppForm({ ...newAppForm, notes: e.target.value })}
            />
          </ModalBody>
          <ModalFooter className="flex justify-between">
            <Button variant="ghost" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Application
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
