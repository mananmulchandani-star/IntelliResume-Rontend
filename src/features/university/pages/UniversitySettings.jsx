import React, { useState } from 'react';
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
  Input,
  Select,
  Modal,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
} from '../../../components/ui';
import { useUniversity, UniversityProvider } from '../context/UniversityContext';
import {
  Building2,
  ShieldCheck,
  GraduationCap,
  Users,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  RotateCcw,
  Save,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';

function UniversitySettingsContent() {
  const {
    settings,
    updateUniversityProfile,
    addDepartment,
    removeDepartment,
    addBatch,
    toggleBatchStatus,
    addStaff,
    removeStaff,
    resetToDefaults,
  } = useUniversity();

  const [activeTab, setActiveTab] = useState('profile');
  const [toastMessage, setToastMessage] = useState('');

  // Profile Form
  const [profileForm, setProfileForm] = useState({ ...settings.profile });

  // Modals
  const [isAddDeptModalOpen, setIsAddDeptModalOpen] = useState(false);
  const [isAddBatchModalOpen, setIsAddBatchModalOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  // Department Form
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    head: '',
    totalStudents: '120',
  });

  // Batch Form
  const [batchForm, setBatchForm] = useState({
    year: '2027',
    name: 'Class of 2027 (Incoming)',
    enrolled: '850',
    placed: '0',
  });

  // Staff Form
  const [staffForm, setStaffForm] = useState({
    name: '',
    role: 'Placement Officer',
    email: '',
    phone: '',
    department: 'Central Placement Cell',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateUniversityProfile(profileForm);
    showToast('University profile settings updated successfully.');
  };

  const handleAddDeptSubmit = (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) return;
    addDepartment({
      name: deptForm.name,
      code: deptForm.code.toUpperCase(),
      head: deptForm.head || 'To be appointed',
      totalStudents: parseInt(deptForm.totalStudents, 10) || 100,
    });
    setIsAddDeptModalOpen(false);
    showToast(`Added ${deptForm.name} department.`);
    setDeptForm({ name: '', code: '', head: '', totalStudents: '120' });
  };

  const handleAddBatchSubmit = (e) => {
    e.preventDefault();
    if (!batchForm.year) return;
    addBatch({
      year: batchForm.year,
      name: batchForm.name,
      enrolled: parseInt(batchForm.enrolled, 10) || 800,
      placed: parseInt(batchForm.placed, 10) || 0,
    });
    setIsAddBatchModalOpen(false);
    showToast(`Added academic batch ${batchForm.year}`);
    setBatchForm({ year: '2027', name: 'Class of 2027', enrolled: '850', placed: '0' });
  };

  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.email) return;
    addStaff(staffForm);
    setIsAddStaffModalOpen(false);
    showToast(`Added ${staffForm.name} to placement officer staff directory.`);
    setStaffForm({ name: '', role: 'Placement Officer', email: '', phone: '', department: 'Central Placement Cell' });
  };

  const handleResetData = () => {
    if (window.confirm('Reset all interactive university data (students, drives, companies, settings) back to demo default values?')) {
      resetToDefaults();
      showToast('All placement demo data reset to default.');
    }
  };

  const breadcrumbs = [
    { label: 'University', href: '/university' },
    { label: 'University Settings' },
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
        onClick={handleResetData}
      >
        Reset Demo Data
      </Button>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<Save className="w-3.5 h-3.5" />}
        onClick={handleProfileSave}
      >
        Save Changes
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="University Settings"
      subtitle="Configure institution credentials, verify NAAC/NIRF accreditation, and manage academic departments and placement officers."
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

      {/* Verification Status Banner */}
      <Card className="mb-6 bg-gradient-to-r from-blue-900 to-indigo-950 text-white border-transparent shadow-xs">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 text-white">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {profileForm.name}
                  </h2>
                  <Badge variant="success" size="sm" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    Platform Certified
                  </Badge>
                </div>
                <p className="text-xs text-blue-200 mt-0.5">
                  Institution Code: <span className="font-mono text-white font-semibold">{profileForm.code}</span> • {profileForm.accreditation}
                </p>
                <div className="flex items-center gap-4 text-xs text-blue-300 pt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    NAAC A++ Accredited
                  </span>
                  <span>Autonomous Status</span>
                  <span>Verified since {profileForm.verificationBadgeDate}</span>
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <Badge size="md" className="bg-white/15 text-white border-white/20 px-3 py-1 font-semibold">
                Verified Higher Education Institute
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Navigation Tabs */}
      <div className="mb-6 border-b border-neutral-200">
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tab value="profile" icon={<Building2 className="w-4 h-4" />}>
            Institution Profile
          </Tab>
          <Tab value="departments" icon={<GraduationCap className="w-4 h-4" />}>
            Departments & Degrees ({settings.departments.length})
          </Tab>
          <Tab value="batches" icon={<Layers className="w-4 h-4" />}>
            Academic Batches ({settings.batches.length})
          </Tab>
          <Tab value="staff" icon={<Users className="w-4 h-4" />}>
            Placement Officers ({settings.staff.length})
          </Tab>
        </Tabs>
      </div>

      {/* Tab 1: Institution Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-neutral-900">
                General Institution Details
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500">
                Official institutional identity as displayed to partner recruiters during drive registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Institution Full Legal Name"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                />
                <Input
                  label="Institutional Code / AISHE Code"
                  required
                  value={profileForm.code}
                  onChange={(e) => setProfileForm({ ...profileForm, code: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Accreditation & NIRF Rank"
                  value={profileForm.accreditation}
                  onChange={(e) => setProfileForm({ ...profileForm, accreditation: e.target.value })}
                />
                <Input
                  label="Affiliation & Autonomous Status"
                  value={profileForm.affiliation}
                  onChange={(e) => setProfileForm({ ...profileForm, affiliation: e.target.value })}
                />
              </div>

              <Input
                label="Campus Physical Address"
                value={profileForm.address}
                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Official Website"
                  value={profileForm.website}
                  onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                />
                <Input
                  label="Placement Cell Email"
                  type="email"
                  value={profileForm.placementEmail}
                  onChange={(e) => setProfileForm({ ...profileForm, placementEmail: e.target.value })}
                />
                <Input
                  label="Placement Office Phone"
                  value={profileForm.placementPhone}
                  onChange={(e) => setProfileForm({ ...profileForm, placementPhone: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-neutral-900">
                Placement Leadership Contact
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500">
                Head of Placements signing MoUs and approving corporate criteria.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Dean / Head of Placements"
                  value={profileForm.deanName}
                  onChange={(e) => setProfileForm({ ...profileForm, deanName: e.target.value })}
                />
                <Input
                  label="Dean Direct Email"
                  type="email"
                  value={profileForm.deanEmail}
                  onChange={(e) => setProfileForm({ ...profileForm, deanEmail: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button variant="primary" size="md" type="submit" leftIcon={<Save className="w-4 h-4" />}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Departments & Degrees */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-neutral-900">
                    Academic Departments
                  </CardTitle>
                  <CardDescription className="text-xs text-neutral-500">
                    Departments participating in campus placement drives.
                  </CardDescription>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={() => setIsAddDeptModalOpen(true)}
                >
                  Add Department
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department Name</TableHead>
                    <TableHead>Branch Code</TableHead>
                    <TableHead>Head of Department (HOD)</TableHead>
                    <TableHead>Enrolled Students</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.departments.map((dept) => (
                    <TableRow key={dept.id}>
                      <TableCell>
                        <span className="font-semibold text-xs text-neutral-900">{dept.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                          {dept.code}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-neutral-700">{dept.head}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-medium text-neutral-900">{dept.totalStudents}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-neutral-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            if (window.confirm(`Remove department ${dept.name}?`)) {
                              removeDepartment(dept.id);
                              showToast(`Removed department ${dept.name}`);
                            }
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Degrees Offered */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-neutral-900">
                Offered Degree Programs
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500">
                Undergraduate and postgraduate degree tracks eligible for on-campus placements.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Degree Title</TableHead>
                    <TableHead>Degree Code</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settings.degrees.map((deg) => (
                    <TableRow key={deg.id}>
                      <TableCell>
                        <span className="font-medium text-xs text-neutral-900">{deg.name}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-xs text-neutral-600">{deg.code}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-neutral-600">{deg.duration}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="success" size="sm">Active</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Academic Batches */}
      {activeTab === 'batches' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-neutral-900">
                  Academic Batches & Cohorts
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  Manage active graduating classes, student enrolment count, and placement rates.
                </CardDescription>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsAddBatchModalOpen(true)}
              >
                Add Batch
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch Name</TableHead>
                  <TableHead>Graduation Year</TableHead>
                  <TableHead>Enrolled Students</TableHead>
                  <TableHead>Placed Students</TableHead>
                  <TableHead>Placement Rate</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Toggle</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <span className="font-semibold text-xs text-neutral-900">{batch.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded">
                        Class of {batch.year}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-neutral-800">{batch.enrolled}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-semibold text-emerald-700">{batch.placed}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900">{batch.placementRate}%</span>
                        <div className="w-16 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-primary-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(batch.placementRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={batch.status.includes('Active') ? 'success' : 'default'} size="sm">
                        {batch.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBatchStatus(batch.id)}
                      >
                        {batch.status.includes('Active') ? 'Archive' : 'Activate'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Tab 4: Placement Officers & Staff */}
      {activeTab === 'staff' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-neutral-900">
                  Placement Cell Officers & Coordinators
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  Staff authorized to review student resumes, launch recruitment drives, and communicate with employers.
                </CardDescription>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => setIsAddStaffModalOpen(true)}
              >
                Add Officer
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Officer Name</TableHead>
                  <TableHead>Designation & Role</TableHead>
                  <TableHead>Official Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">
                          {member.name[0]}
                        </div>
                        <span className="font-semibold text-xs text-neutral-900">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-neutral-700 font-medium">{member.role}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-neutral-500">{member.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-neutral-600">{member.phone}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="info" size="sm">{member.department}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-neutral-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (window.confirm(`Remove staff member ${member.name}?`)) {
                            removeStaff(member.id);
                            showToast(`Removed ${member.name}`);
                          }
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Modal: Add Department */}
      <Modal
        isOpen={isAddDeptModalOpen}
        onClose={() => setIsAddDeptModalOpen(false)}
        title="Add Academic Department"
        description="Register a new academic department to participate in campus placement drives."
        size="md"
      >
        <form onSubmit={handleAddDeptSubmit}>
          <ModalBody className="space-y-4">
            <Input
              label="Department Name"
              placeholder="e.g. Chemical Engineering"
              required
              value={deptForm.name}
              onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Department Code"
                placeholder="e.g. CHE"
                required
                value={deptForm.code}
                onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
              />
              <Input
                label="Enrolled Students"
                type="number"
                value={deptForm.totalStudents}
                onChange={(e) => setDeptForm({ ...deptForm, totalStudents: e.target.value })}
              />
            </div>
            <Input
              label="Head of Department (HOD)"
              placeholder="e.g. Dr. Sunita Rao"
              value={deptForm.head}
              onChange={(e) => setDeptForm({ ...deptForm, head: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setIsAddDeptModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Add Department
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: Add Batch */}
      <Modal
        isOpen={isAddBatchModalOpen}
        onClose={() => setIsAddBatchModalOpen(false)}
        title="Add Academic Batch"
        description="Register a new graduating cohort into placement operations."
        size="md"
      >
        <form onSubmit={handleAddBatchSubmit}>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Graduation Year"
                placeholder="e.g. 2027"
                required
                value={batchForm.year}
                onChange={(e) => setBatchForm({ ...batchForm, year: e.target.value })}
              />
              <Input
                label="Cohort Label"
                placeholder="Class of 2027"
                required
                value={batchForm.name}
                onChange={(e) => setBatchForm({ ...batchForm, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Total Enrolled Students"
                type="number"
                value={batchForm.enrolled}
                onChange={(e) => setBatchForm({ ...batchForm, enrolled: e.target.value })}
              />
              <Input
                label="Placed Students So Far"
                type="number"
                value={batchForm.placed}
                onChange={(e) => setBatchForm({ ...batchForm, placed: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setIsAddBatchModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Academic Batch
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: Add Staff Officer */}
      <Modal
        isOpen={isAddStaffModalOpen}
        onClose={() => setIsAddStaffModalOpen(false)}
        title="Add Placement Officer"
        description="Grant administrative placement cell privileges to a staff member or faculty coordinator."
        size="md"
      >
        <form onSubmit={handleAddStaffSubmit}>
          <ModalBody className="space-y-4">
            <Input
              label="Staff Member Full Name"
              placeholder="e.g. Dr. Vikram Sen"
              required
              value={staffForm.name}
              onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Designation / Role"
                placeholder="e.g. Corporate Relations Officer"
                required
                value={staffForm.role}
                onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
              />
              <Input
                label="Assigned Cell"
                placeholder="e.g. Central Placement Cell"
                value={staffForm.department}
                onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Official Email"
                type="email"
                placeholder="vikram.sen@itas.edu.in"
                required
                value={staffForm.email}
                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
              />
              <Input
                label="Mobile Phone"
                placeholder="+91 98765 43210"
                value={staffForm.phone}
                onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setIsAddStaffModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Add Placement Officer
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

export default function UniversitySettings() {
  return (
    <UniversityProvider>
      <UniversitySettingsContent />
    </UniversityProvider>
  );
}
