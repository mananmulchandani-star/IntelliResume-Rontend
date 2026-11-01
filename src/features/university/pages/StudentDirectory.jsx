import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Card,
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
import { useUniversity, UniversityProvider } from '../context/UniversityContext';
import {
  Users,
  UserPlus,
  Upload,
  Mail,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  FileSpreadsheet,
  Trash2,
  Edit,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Download,
  AlertCircle,
  Eye,
} from 'lucide-react';

function StudentDirectoryContent() {
  const { students, addStudent, bulkAddStudents, updateStudent, deleteStudent } = useUniversity();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [cgpaFilter, setCgpaFilter] = useState('ALL');
  const [backlogsFilter, setBacklogsFilter] = useState('ALL');

  // Selected students for bulk action
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Add Student Form State
  const [addForm, setAddForm] = useState({
    name: '',
    rollNo: '',
    email: '',
    phone: '',
    department: 'Computer Science & Engineering',
    degree: 'B.Tech',
    batch: '2025',
    cgpa: '8.5',
    backlogs: '0',
    skills: 'Python, SQL, DSA',
  });

  // Bulk CSV Import State
  const [csvContent, setCsvContent] = useState('');
  const [parsedPreview, setParsedPreview] = useState([]);

  // Invite Student State
  const [inviteForm, setInviteForm] = useState({
    email: '',
    batch: '2025',
    department: 'Computer Science & Engineering',
    customNote: 'You have been invited to join the ITAS Placement Portal to build your verified AI resume and participate in campus drives.',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter logic
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesRoll = s.rollNo.toLowerCase().includes(query);
        const matchesEmail = s.email.toLowerCase().includes(query);
        const matchesSkill = (s.skills || []).some((sk) => sk.toLowerCase().includes(query));
        if (!matchesName && !matchesRoll && !matchesEmail && !matchesSkill) {
          return false;
        }
      }

      // Department
      if (deptFilter !== 'ALL' && s.department !== deptFilter) return false;

      // Batch
      if (batchFilter !== 'ALL' && s.batch !== batchFilter) return false;

      // Status
      if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;

      // CGPA
      if (cgpaFilter !== 'ALL') {
        const minVal = parseFloat(cgpaFilter);
        if (s.cgpa < minVal) return false;
      }

      // Backlogs
      if (backlogsFilter === '0' && s.backlogs > 0) return false;
      if (backlogsFilter === '1' && s.backlogs > 1) return false;

      return true;
    });
  }, [students, searchQuery, deptFilter, batchFilter, statusFilter, cgpaFilter, backlogsFilter]);

  // Bulk selection helpers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredStudents.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setDeptFilter('ALL');
    setBatchFilter('ALL');
    setStatusFilter('ALL');
    setCgpaFilter('ALL');
    setBacklogsFilter('ALL');
  };

  // Submit Add Student
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.rollNo || !addForm.email) return;

    addStudent({
      ...addForm,
      cgpa: parseFloat(addForm.cgpa) || 7.0,
      backlogs: parseInt(addForm.backlogs, 10) || 0,
      skills: addForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
    });

    setIsAddModalOpen(false);
    showToast(`Added ${addForm.name} to the directory successfully.`);
    setAddForm({
      name: '',
      rollNo: '',
      email: '',
      phone: '',
      department: 'Computer Science & Engineering',
      degree: 'B.Tech',
      batch: '2025',
      cgpa: '8.5',
      backlogs: '0',
      skills: 'Python, SQL, DSA',
    });
  };

  // Sample CSV generator
  const loadSampleCsv = () => {
    const sample = `name,rollNo,email,department,batch,cgpa,backlogs,skills\n` +
      `Siddharth Nair,21CS201,siddharth.n@itas.edu.in,Computer Science & Engineering,2025,8.95,0,"React, Node.js, AWS"\n` +
      `Pooja Hegde,21IT089,pooja.h@itas.edu.in,Information Technology,2025,9.20,0,"Python, Machine Learning, SQL"\n` +
      `Rishi Varma,21EC055,rishi.v@itas.edu.in,Electronics & Communication,2025,7.60,0,"Embedded C, IoT, Python"\n` +
      `Neha Saxena,21DS032,neha.s@itas.edu.in,Data Science & AI,2025,8.40,0,"PyTorch, Tableau, R"`;
    setCsvContent(sample);
    parseCsv(sample);
  };

  const parseCsv = (text) => {
    const lines = text.trim().split('\n');
    if (lines.length <= 1) {
      setParsedPreview([]);
      return;
    }
    const headers = lines[0].split(',').map((h) => h.trim());
    const rows = lines.slice(1).map((line) => {
      // Regex handling quoted commas
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',');
      const item = {};
      headers.forEach((h, i) => {
        item[h] = (matches[i] || '').replace(/^"|"$/g, '').trim();
      });
      return item;
    });
    setParsedPreview(rows);
  };

  const handleBulkImportConfirm = () => {
    if (!parsedPreview.length) return;
    const count = bulkAddStudents(parsedPreview);
    setIsBulkModalOpen(false);
    setCsvContent('');
    setParsedPreview([]);
    showToast(`Successfully imported ${count} students into the directory.`);
  };

  // Send Invite
  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteForm.email) return;
    setIsInviteModalOpen(false);
    showToast(`Invitation sent to ${inviteForm.email} with activation link.`);
    setInviteForm({
      email: '',
      batch: '2025',
      department: 'Computer Science & Engineering',
      customNote: 'You have been invited to join the ITAS Placement Portal.',
    });
  };

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Placed':
        return <Badge variant="success" size="sm" dot>Placed</Badge>;
      case 'In Process':
        return <Badge variant="warning" size="sm" dot>In Process</Badge>;
      case 'Eligible':
        return <Badge variant="info" size="sm">Eligible</Badge>;
      case 'Unplaced':
        return <Badge variant="default" size="sm">Unplaced</Badge>;
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  const breadcrumbs = [
    { label: 'University', href: '/university' },
    { label: 'Student Directory' },
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        leftIcon={<Mail className="w-3.5 h-3.5" />}
        onClick={() => setIsInviteModalOpen(true)}
      >
        Invite Student
      </Button>
      <Button
        variant="outline"
        size="sm"
        leftIcon={<Upload className="w-3.5 h-3.5" />}
        onClick={() => setIsBulkModalOpen(true)}
      >
        Bulk CSV Import
      </Button>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<UserPlus className="w-3.5 h-3.5" />}
        onClick={() => setIsAddModalOpen(true)}
      >
        Add Student
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Student Directory"
      subtitle="Manage student academic profiles, check drive eligibility, verify resumes, and track placement outcomes."
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

      {/* Directory Metrics Summary Card */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Showing in Directory
            </span>
            <div className="text-xl font-bold text-neutral-900">{filteredStudents.length} / {students.length}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Students matching filters</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Placed Students
            </span>
            <div className="text-xl font-bold text-success-700">
              {filteredStudents.filter((s) => s.status === 'Placed').length}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Offers secured & verified</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Zero Backlog Pool
            </span>
            <div className="text-xl font-bold text-neutral-900">
              {filteredStudents.filter((s) => s.backlogs === 0).length}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">100% clean academic record</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Average Cohort CGPA
            </span>
            <div className="text-xl font-bold text-primary-700">
              {filteredStudents.length > 0
                ? (filteredStudents.reduce((acc, curr) => acc + curr.cgpa, 0) / filteredStudents.length).toFixed(2)
                : '0.00'}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Cumulative Grade Point Avg</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="mb-6 p-4">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search student by name, roll no, email, or skill (e.g. Python, React)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>
            {(searchQuery || deptFilter !== 'ALL' || batchFilter !== 'ALL' || statusFilter !== 'ALL' || cgpaFilter !== 'ALL' || backlogsFilter !== 'ALL') && (
              <Button
                variant="ghost"
                size="md"
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={handleResetFilters}
              >
                Reset Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
            <Select
              label="Department"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Departments' },
                { value: 'Computer Science & Engineering', label: 'Computer Science (CSE)' },
                { value: 'Information Technology', label: 'Information Tech (IT)' },
                { value: 'Data Science & AI', label: 'Data Science & AI' },
                { value: 'Electronics & Communication', label: 'Electronics (ECE)' },
                { value: 'Electrical & Electronics', label: 'Electrical (EEE)' },
                { value: 'Mechanical Engineering', label: 'Mechanical (ME)' },
              ]}
            />

            <Select
              label="Graduation Batch"
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Batches' },
                { value: '2025', label: 'Class of 2025 (Graduating)' },
                { value: '2026', label: 'Class of 2026 (Pre-Final)' },
                { value: '2024', label: 'Class of 2024 (Alumni)' },
              ]}
            />

            <Select
              label="Placement Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'Placed', label: 'Placed with Offer' },
                { value: 'In Process', label: 'In Recruitment Process' },
                { value: 'Eligible', label: 'Eligible / Open' },
                { value: 'Unplaced', label: 'Unplaced' },
              ]}
            />

            <Select
              label="Min CGPA"
              value={cgpaFilter}
              onChange={(e) => setCgpaFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'Any CGPA' },
                { value: '8.5', label: 'CGPA ≥ 8.5 (Distinction)' },
                { value: '8.0', label: 'CGPA ≥ 8.0' },
                { value: '7.5', label: 'CGPA ≥ 7.5' },
                { value: '6.5', label: 'CGPA ≥ 6.5 (Standard Cutoff)' },
              ]}
            />

            <Select
              label="Backlogs Filter"
              value={backlogsFilter}
              onChange={(e) => setBacklogsFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'Any Backlogs' },
                { value: '0', label: 'Zero Backlogs Only' },
                { value: '1', label: 'Max 1 Backlog' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Bulk Action Banner when items selected */}
      {selectedIds.length > 0 && (
        <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2 text-primary-900 font-medium">
            <CheckCircle className="w-4 h-4 text-primary-600" />
            <span>{selectedIds.length} students selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                showToast(`Exported ${selectedIds.length} selected candidate resumes.`);
                setSelectedIds([]);
              }}
            >
              Export Candidate List
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* Main Student Directory Data Table */}
      {filteredStudents.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  aria-label="Select all students in table"
                  checked={selectedIds.length > 0 && selectedIds.length === filteredStudents.length}
                  onChange={handleSelectAll}
                  className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
              </TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Department & Batch</TableHead>
              <TableHead>Academic Record</TableHead>
              <TableHead>AI Resume Score</TableHead>
              <TableHead>Top Skills</TableHead>
              <TableHead>Placement Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => {
              const isSelected = selectedIds.includes(student.id);

              return (
                <TableRow key={student.id} isSelected={isSelected}>
                  <TableCell>
                    <input
                      type="checkbox"
                      aria-label={`Select student ${student.name}`}
                      checked={isSelected}
                      onChange={() => handleSelectOne(student.id)}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                  </TableCell>

                  {/* Student Name & Roll */}
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover border border-neutral-200 shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="min-w-0">
                        <div className="font-medium text-xs text-neutral-900 truncate flex items-center gap-1.5">
                          {student.name}
                          <span className="font-mono text-[10px] text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded">
                            {student.rollNo}
                          </span>
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">{student.email}</div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Dept & Batch */}
                  <TableCell>
                    <div className="text-xs text-neutral-800 font-medium">{student.department}</div>
                    <div className="text-[11px] text-neutral-500">{student.degree} • Batch {student.batch}</div>
                  </TableCell>

                  {/* CGPA & Backlogs */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                        {student.cgpa} CGPA
                      </span>
                      {student.backlogs === 0 ? (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          0 Backlogs
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {student.backlogs} Backlog{student.backlogs > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* AI Resume Score */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            student.resumeScore >= 90
                              ? 'bg-emerald-500'
                              : student.resumeScore >= 80
                              ? 'bg-primary-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${student.resumeScore}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-neutral-800">
                        {student.resumeScore}/100
                      </span>
                    </div>
                  </TableCell>

                  {/* Skills tags */}
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap max-w-xs">
                      {(student.skills || []).slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {(student.skills || []).length > 3 && (
                        <span className="text-[10px] text-neutral-400">
                          +{(student.skills || []).length - 3}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Placement Status */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <div>{getStatusBadge(student.status)}</div>
                      {student.placedCompany && (
                        <div className="text-[11px] font-medium text-neutral-800 flex items-center gap-1">
                          <span>{student.placedCompany}</span>
                          <span className="text-emerald-700 font-semibold">({student.packageCtc})</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingStudent(student)}
                        title="View Full Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-neutral-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (window.confirm(`Remove ${student.name} from directory?`)) {
                            deleteStudent(student.id);
                            showToast(`Deleted ${student.name}`);
                          }
                        }}
                        title="Delete Student"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
          icon={<Users className="w-6 h-6 text-neutral-400" />}
          title="No students match your criteria"
          description="Try relaxing your search terms or filter constraints to see more candidates."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      )}

      {/* Modal: Add Student */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Student to Directory"
        description="Enroll a new student into the placement portal with verified academic metrics."
        size="lg"
      >
        <form onSubmit={handleAddSubmit}>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                placeholder="e.g. Siddharth Menon"
                required
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              />
              <Input
                label="University Roll No"
                placeholder="e.g. 21CS099"
                required
                value={addForm.rollNo}
                onChange={(e) => setAddForm({ ...addForm, rollNo: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Official Email"
                type="email"
                placeholder="siddharth.m@itas.edu.in"
                required
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                placeholder="+91 98765 43210"
                value={addForm.phone}
                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Department"
                value={addForm.department}
                onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                options={[
                  { value: 'Computer Science & Engineering', label: 'Computer Science (CSE)' },
                  { value: 'Information Technology', label: 'Information Tech (IT)' },
                  { value: 'Data Science & AI', label: 'Data Science & AI' },
                  { value: 'Electronics & Communication', label: 'Electronics (ECE)' },
                  { value: 'Electrical & Electronics', label: 'Electrical (EEE)' },
                  { value: 'Mechanical Engineering', label: 'Mechanical (ME)' },
                ]}
              />
              <Select
                label="Degree"
                value={addForm.degree}
                onChange={(e) => setAddForm({ ...addForm, degree: e.target.value })}
                options={[
                  { value: 'B.Tech', label: 'B.Tech (Bachelor of Tech)' },
                  { value: 'M.Tech', label: 'M.Tech (Master of Tech)' },
                  { value: 'MCA', label: 'MCA' },
                ]}
              />
              <Select
                label="Graduation Batch"
                value={addForm.batch}
                onChange={(e) => setAddForm({ ...addForm, batch: e.target.value })}
                options={[
                  { value: '2025', label: 'Class of 2025' },
                  { value: '2026', label: 'Class of 2026' },
                  { value: '2024', label: 'Class of 2024' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current CGPA"
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={addForm.cgpa}
                onChange={(e) => setAddForm({ ...addForm, cgpa: e.target.value })}
              />
              <Select
                label="Active Backlogs"
                value={addForm.backlogs}
                onChange={(e) => setAddForm({ ...addForm, backlogs: e.target.value })}
                options={[
                  { value: '0', label: '0 Active Backlogs (Clean)' },
                  { value: '1', label: '1 Active Backlog' },
                  { value: '2', label: '2 Active Backlogs' },
                  { value: '3', label: '3+ Active Backlogs' },
                ]}
              />
            </div>

            <Input
              label="Key Skills (comma separated)"
              placeholder="e.g. React, Node.js, Python, PostgreSQL, AWS"
              value={addForm.skills}
              onChange={(e) => setAddForm({ ...addForm, skills: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Student
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: Bulk CSV Import */}
      <Modal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        title="Bulk Student CSV Import"
        description="Upload or paste student roster data formatted as comma-separated values."
        size="xl"
      >
        <ModalBody className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
            <span className="text-neutral-600">
              Format: <code>name,rollNo,email,department,batch,cgpa,backlogs,skills</code>
            </span>
            <Button variant="outline" size="sm" onClick={loadSampleCsv}>
              Load Sample CSV
            </Button>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              CSV Data (Paste below or edit):
            </label>
            <textarea
              rows={5}
              className="w-full font-mono text-xs p-3 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="name,rollNo,email,department,batch,cgpa,backlogs,skills&#10;John Doe,21CS001,john@itas.edu.in,Computer Science & Engineering,2025,8.8,0,Python,DSA"
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                parseCsv(e.target.value);
              }}
            />
          </div>

          {parsedPreview.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-800">
                  Preview ({parsedPreview.length} students detected)
                </span>
                <Badge variant="success" size="sm">Valid Format</Badge>
              </div>

              <div className="max-h-48 overflow-y-auto border border-neutral-200 rounded-md">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-50 text-neutral-500 border-b border-neutral-200">
                    <tr>
                      <th className="p-2">Name</th>
                      <th className="p-2">Roll No</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Dept</th>
                      <th className="p-2">CGPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {parsedPreview.map((row, i) => (
                      <tr key={i} className="hover:bg-neutral-50">
                        <td className="p-2 font-medium text-neutral-900">{row.name}</td>
                        <td className="p-2 font-mono text-neutral-600">{row.rollNo}</td>
                        <td className="p-2 text-neutral-500">{row.email}</td>
                        <td className="p-2 text-neutral-700 truncate max-w-[120px]">{row.department}</td>
                        <td className="p-2 font-semibold text-neutral-800">{row.cgpa}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="md" onClick={() => setIsBulkModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={parsedPreview.length === 0}
            onClick={handleBulkImportConfirm}
          >
            Import {parsedPreview.length} Students
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal: Invite Student */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Student"
        description="Send an official email invitation to access the InsightResume placement portal."
        size="md"
      >
        <form onSubmit={handleSendInvite}>
          <ModalBody className="space-y-4">
            <Input
              label="Student Email Address"
              type="email"
              placeholder="student.name@itas.edu.in"
              required
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Batch"
                value={inviteForm.batch}
                onChange={(e) => setInviteForm({ ...inviteForm, batch: e.target.value })}
                options={[
                  { value: '2025', label: 'Class of 2025' },
                  { value: '2026', label: 'Class of 2026' },
                ]}
              />

              <Select
                label="Department"
                value={inviteForm.department}
                onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                options={[
                  { value: 'Computer Science & Engineering', label: 'CSE' },
                  { value: 'Information Technology', label: 'IT' },
                  { value: 'Data Science & AI', label: 'DSAI' },
                  { value: 'Electronics & Communication', label: 'ECE' },
                ]}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Custom Welcome Note
              </label>
              <textarea
                rows={3}
                className="w-full text-xs p-2.5 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={inviteForm.customNote}
                onChange={(e) => setInviteForm({ ...inviteForm, customNote: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Send Invitation
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: View / Edit Student Details */}
      {viewingStudent && (
        <Modal
          isOpen={Boolean(viewingStudent)}
          onClose={() => setViewingStudent(null)}
          title={viewingStudent.name}
          description={`${viewingStudent.rollNo} • ${viewingStudent.department}`}
          size="lg"
        >
          <ModalBody className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
              <img
                src={viewingStudent.avatar}
                alt={viewingStudent.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base text-neutral-900">{viewingStudent.name}</h3>
                  {getStatusBadge(viewingStudent.status)}
                </div>
                <p className="text-xs text-neutral-500">{viewingStudent.email} • {viewingStudent.phone}</p>
                {viewingStudent.placedCompany && (
                  <p className="text-xs font-semibold text-emerald-700 mt-1">
                    Placed at {viewingStudent.placedCompany} ({viewingStudent.packageCtc})
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Cumulative CGPA</span>
                <span className="text-base font-bold text-neutral-900">{viewingStudent.cgpa}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Backlogs</span>
                <span className="text-base font-bold text-neutral-900">{viewingStudent.backlogs}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Resume Score</span>
                <span className="text-base font-bold text-primary-700">{viewingStudent.resumeScore}/100</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Graduating Batch</span>
                <span className="text-base font-bold text-neutral-900">{viewingStudent.batch}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-2">Verified Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {(viewingStudent.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-md font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-2">
                Placement Status Override
              </h4>
              <div className="flex items-center gap-2">
                <Select
                  value={viewingStudent.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    updateStudent(viewingStudent.id, { status: newStatus });
                    setViewingStudent({ ...viewingStudent, status: newStatus });
                    showToast(`Updated ${viewingStudent.name}'s status to ${newStatus}`);
                  }}
                  options={[
                    { value: 'Eligible', label: 'Eligible / Open to Drives' },
                    { value: 'In Process', label: 'In Recruitment Process' },
                    { value: 'Placed', label: 'Placed (Offer Confirmed)' },
                    { value: 'Unplaced', label: 'Unplaced' },
                  ]}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setViewingStudent(null)}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default function StudentDirectory() {
  return (
    <UniversityProvider>
      <StudentDirectoryContent />
    </UniversityProvider>
  );
}
