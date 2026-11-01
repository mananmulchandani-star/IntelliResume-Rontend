// src/features/admin/pages/UserManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Button,
  Badge,
  Input,
  Select,
  Modal,
  ModalBody,
  ModalFooter,
  Card,
  EmptyState,
} from '../../../components/ui';
import Pagination from '../../../components/shared/Pagination';
import { ROUTES } from '../../../constants/routes';
import { ROLE_LABELS, ROLES } from '../../../constants/roles';
import adminStorage from '../services/adminStorage';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Shield,
  ShieldAlert,
  CheckCircle,
  XCircle,
  MoreVertical,
  Mail,
  Building,
  Calendar,
  Clock,
  KeyRound,
  UserCheck,
  UserX,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: ROLES.STUDENT, label: 'Student' },
  { value: ROLES.UNIVERSITY_ADMIN, label: 'University Admin / Placement Officer' },
  { value: ROLES.COMPANY_RECRUITER, label: 'Employer / Recruiter' },
  { value: ROLES.PLATFORM_ADMIN, label: 'Platform Administrator' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending Verification' },
  { value: 'deactivated', label: 'Deactivated' },
];

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState(null);

  // Modals
  const [roleModalUser, setRoleModalUser] = useState(null);
  const [newRoleValue, setNewRoleValue] = useState('');
  const [roleChangeReason, setRoleChangeReason] = useState('');

  const [statusModalUser, setStatusModalUser] = useState(null);
  const [statusChangeReason, setStatusChangeReason] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    role: ROLES.STUDENT,
    organization: '',
    department: '',
  });

  const loadUsers = () => {
    setUsers(adminStorage.getUsers());
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchQuery =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.organization && u.organization.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchRole = selectedRole === 'all' || u.role === selectedRole;
      const matchStatus = selectedStatus === 'all' || u.status === selectedStatus;

      return matchQuery && matchRole && matchStatus;
    });
  }, [users, searchQuery, selectedRole, selectedStatus]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  // Handle Role Change
  const handleOpenRoleModal = (user) => {
    setRoleModalUser(user);
    setNewRoleValue(user.role);
    setRoleChangeReason('');
  };

  const handleConfirmRoleChange = () => {
    if (!roleModalUser) return;
    adminStorage.updateUser(roleModalUser.id, { role: newRoleValue });
    adminStorage.addAuditLog({
      action: 'User Role Modified',
      target: `${roleModalUser.name} (${roleModalUser.email})`,
      type: 'info',
      details: `Role updated to ${ROLE_LABELS[newRoleValue] || newRoleValue}. Reason: ${roleChangeReason || 'Administrative update'}`,
    });
    triggerToast(`Role for ${roleModalUser.name} updated to ${ROLE_LABELS[newRoleValue] || newRoleValue}.`);
    setRoleModalUser(null);
    loadUsers();
  };

  // Handle Status Toggle (Activate / Deactivate)
  const handleOpenStatusModal = (user) => {
    setStatusModalUser(user);
    setStatusChangeReason('');
  };

  const handleConfirmStatusToggle = () => {
    if (!statusModalUser) return;
    const isCurrentlyActive = statusModalUser.status === 'active';
    const nextStatus = isCurrentlyActive ? 'deactivated' : 'active';

    adminStorage.updateUser(statusModalUser.id, { status: nextStatus });
    adminStorage.addAuditLog({
      action: isCurrentlyActive ? 'User Account Deactivated' : 'User Account Activated',
      target: `${statusModalUser.name} (${statusModalUser.email})`,
      type: isCurrentlyActive ? 'error' : 'success',
      details: `Status changed to ${nextStatus}. Reason: ${statusChangeReason || 'Administrative action'}`,
    });
    triggerToast(`Account for ${statusModalUser.name} marked as ${nextStatus}.`);
    setStatusModalUser(null);
    loadUsers();
  };

  // Handle Create User
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;

    adminStorage.addUser({
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role,
      organization: newUserForm.organization || 'Independent',
      department: newUserForm.department || '',
      status: 'active',
    });

    adminStorage.addAuditLog({
      action: 'New Account Provisioned',
      target: `${newUserForm.name} (${newUserForm.email})`,
      type: 'success',
      details: `Provisioned with role: ${ROLE_LABELS[newUserForm.role] || newUserForm.role} for ${newUserForm.organization}`,
    });

    triggerToast(`User account created for ${newUserForm.name}.`);
    setIsCreateModalOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      role: ROLES.STUDENT,
      organization: '',
      department: '',
    });
    loadUsers();
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case ROLES.PLATFORM_ADMIN:
        return <Badge variant="error" size="sm">Platform Admin</Badge>;
      case ROLES.UNIVERSITY_ADMIN:
      case ROLES.UNIVERSITY_STAFF:
        return <Badge variant="info" size="sm">University Admin</Badge>;
      case ROLES.COMPANY_RECRUITER:
      case ROLES.COMPANY_ADMIN:
        return <Badge variant="warning" size="sm">Employer</Badge>;
      default:
        return <Badge variant="default" size="sm">Student</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" size="sm" dot>Active</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm" dot>Pending</Badge>;
      case 'deactivated':
        return <Badge variant="error" size="sm" dot>Deactivated</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="User Management"
      subtitle="Search, audit, provision roles, and govern accounts across the platform ecosystem."
      breadcrumbs={[{ label: 'Platform Admin', href: ROUTES.ADMIN_DASHBOARD }, { label: 'User Directory' }]}
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Provision User
        </Button>
      }
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-neutral-900 text-white text-xs font-medium shadow-xl border border-neutral-800 animate-slide-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Directory Filter Bar */}
      <Card className="p-4 mb-6 border border-neutral-200">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search by name, email, or institution..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full sm:w-56">
              <Select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setCurrentPage(1);
                }}
                options={ROLE_OPTIONS}
              />
            </div>

            <div className="w-full sm:w-48">
              <Select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                options={STATUS_OPTIONS}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Directory Table */}
      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No users match your filters"
          description="Try broadening your search query or reset the role and status filters."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedRole('all');
                setSelectedStatus('all');
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <Card className="border border-neutral-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Account</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Affiliation / Org</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-700 font-semibold text-xs flex items-center justify-center shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-neutral-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {getRoleBadge(user.role)}
                  </TableCell>

                  <TableCell>
                    <div className="text-xs text-neutral-800 font-medium">
                      {user.organization || 'Independent'}
                    </div>
                    {user.department && (
                      <div className="text-[11px] text-neutral-400">
                        {user.department}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-neutral-500 whitespace-nowrap">
                    {user.joinedDate}
                  </TableCell>

                  <TableCell className="text-xs text-neutral-500 whitespace-nowrap">
                    {user.lastLogin}
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenRoleModal(user)}
                        title="Modify user role"
                        className="text-neutral-600 hover:text-neutral-900 !h-8 !px-2 text-xs"
                      >
                        Modify Role
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenStatusModal(user)}
                        title={user.status === 'active' ? 'Deactivate account' : 'Activate account'}
                        className={`!h-8 !px-2 text-xs ${
                          user.status === 'active'
                            ? 'text-neutral-500 hover:text-rose-600 hover:bg-rose-50'
                            : 'text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50'
                        }`}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Table Footer with Pagination */}
          <div className="p-3 border-t border-neutral-150 bg-neutral-50/50">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
            />
          </div>
        </Card>
      )}

      {/* Role Modifier Modal */}
      <Modal
        isOpen={Boolean(roleModalUser)}
        onClose={() => setRoleModalUser(null)}
        title={`Modify Platform Role: ${roleModalUser?.name}`}
        description="Changes user permissions across student, university, employer, and admin portals."
        size="md"
      >
        <ModalBody className="space-y-4">
          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-1">
            <p className="font-semibold text-neutral-900">{roleModalUser?.name}</p>
            <p className="text-neutral-500">{roleModalUser?.email}</p>
            <p className="text-neutral-400">Current Role: <span className="font-medium text-neutral-700">{ROLE_LABELS[roleModalUser?.role] || roleModalUser?.role}</span></p>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Assigned Platform Role
            </label>
            <Select
              value={newRoleValue}
              onChange={(e) => setNewRoleValue(e.target.value)}
              options={[
                { value: ROLES.STUDENT, label: 'Student (Resume Builder & Job Applications)' },
                { value: ROLES.UNIVERSITY_ADMIN, label: 'University Admin (Drives, Students, Stats)' },
                { value: ROLES.COMPANY_RECRUITER, label: 'Company Recruiter (Vacancies & Pipeline)' },
                { value: ROLES.PLATFORM_ADMIN, label: 'Platform Administrator (Root Operations)' },
              ]}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Reason for Role Escalation / Transition (For Audit Trail)
            </label>
            <textarea
              rows={3}
              className="w-full text-xs p-2.5 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="e.g., Authorized by Dean for institutional campus placement management."
              value={roleChangeReason}
              onChange={(e) => setRoleChangeReason(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setRoleModalUser(null)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirmRoleChange}>
            Save Role Update
          </Button>
        </ModalFooter>
      </Modal>

      {/* Account Deactivation / Activation Modal */}
      <Modal
        isOpen={Boolean(statusModalUser)}
        onClose={() => setStatusModalUser(null)}
        title={
          statusModalUser?.status === 'active'
            ? `Deactivate Account: ${statusModalUser?.name}`
            : `Activate Account: ${statusModalUser?.name}`
        }
        description={
          statusModalUser?.status === 'active'
            ? 'Deactivating this user will revoke their session credentials immediately and prevent logging into their portal.'
            : 'Re-activating this user will restore their portal access and login privileges.'
        }
        size="md"
      >
        <ModalBody className="space-y-4">
          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs">
            <p className="font-semibold text-neutral-900">{statusModalUser?.name}</p>
            <p className="text-neutral-500">{statusModalUser?.email}</p>
            <p className="text-neutral-400 mt-1">
              Affiliation: <span className="font-medium text-neutral-700">{statusModalUser?.organization}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Reason for Status Change (Recorded in Platform Audit Log)
            </label>
            <textarea
              rows={3}
              className="w-full text-xs p-2.5 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder={
                statusModalUser?.status === 'active'
                  ? 'e.g., Reported policy violation or security suspension.'
                  : 'e.g., Verified identity and lifted temporary restriction.'
              }
              value={statusChangeReason}
              onChange={(e) => setStatusChangeReason(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setStatusModalUser(null)}>
            Cancel
          </Button>
          <Button
            variant={statusModalUser?.status === 'active' ? 'danger' : 'primary'}
            size="sm"
            onClick={handleConfirmStatusToggle}
          >
            {statusModalUser?.status === 'active' ? 'Confirm Deactivation' : 'Confirm Activation'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Provision New User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Provision Platform User"
        description="Create and onboard an authorized user directly with specific portal role access."
        size="md"
      >
        <form onSubmit={handleCreateUser}>
          <ModalBody className="space-y-3.5">
            <div>
              <Input
                label="Full Name"
                required
                placeholder="e.g. Dr. Catherine Hall"
                value={newUserForm.name}
                onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
              />
            </div>

            <div>
              <Input
                label="Official Email Address"
                type="email"
                required
                placeholder="e.g. c.hall@university.edu"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5 select-none">
                Initial Role Assignment <span className="text-error-500">*</span>
              </label>
              <Select
                value={newUserForm.role}
                onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                options={[
                  { value: ROLES.STUDENT, label: 'Student' },
                  { value: ROLES.UNIVERSITY_ADMIN, label: 'University Administrator' },
                  { value: ROLES.COMPANY_RECRUITER, label: 'Employer Recruiter' },
                  { value: ROLES.PLATFORM_ADMIN, label: 'Platform Administrator' },
                ]}
              />
            </div>

            <div>
              <Input
                label="Organization / University / Employer"
                placeholder="e.g. University of California, Berkeley"
                value={newUserForm.organization}
                onChange={(e) => setNewUserForm({ ...newUserForm, organization: e.target.value })}
              />
            </div>

            <div>
              <Input
                label="Department / Unit"
                placeholder="e.g. Career Services / Tech Recruiting"
                value={newUserForm.department}
                onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="sm" type="button" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Provision Account
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
