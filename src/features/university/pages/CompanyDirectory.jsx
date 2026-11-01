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
import { ROUTES } from '../../../constants/routes';
import { useUniversity, UniversityProvider } from '../context/UniversityContext';
import {
  Building2,
  Plus,
  Mail,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Users,
  Trophy,
  Calendar,
  Phone,
  FileText,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';

function CompanyDirectoryContent() {
  const navigate = useNavigate();
  const { companies, addCompany, inviteCompany } = useUniversity();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [verificationFilter, setVerificationFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [viewingCompany, setViewingCompany] = useState(null);

  // Add Company Form State
  const [addForm, setAddForm] = useState({
    name: '',
    industry: 'Technology & Cloud',
    tier: 'Tier 1 / Super Dream',
    website: '',
    location: 'Bangalore, India',
    avgPackage: '₹24.0 LPA',
    highestPackage: '₹40.0 LPA',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactDesignation: 'Campus Hiring Lead',
  });

  // Invite Company Form State
  const [inviteForm, setInviteForm] = useState({
    name: '',
    industry: 'Technology & Cloud',
    tier: 'Tier 1 / Super Dream',
    website: '',
    location: 'Bangalore / Remote',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactDesignation: 'Lead University Recruiter',
    packageEstimate: '₹22.0 LPA',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesInd = (c.industry || '').toLowerCase().includes(q);
        const matchesLoc = (c.location || '').toLowerCase().includes(q);
        if (!matchesName && !matchesInd && !matchesLoc) return false;
      }

      // Tier filter
      if (tierFilter !== 'ALL' && !c.tier.includes(tierFilter)) return false;

      // Verification filter
      if (verificationFilter !== 'ALL' && c.verificationStatus !== verificationFilter) return false;

      return true;
    });
  }, [companies, searchQuery, tierFilter, verificationFilter]);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.contactEmail) return;

    addCompany({
      name: addForm.name,
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80',
      industry: addForm.industry,
      tier: addForm.tier,
      website: addForm.website || 'https://example.com/careers',
      location: addForm.location,
      avgPackage: addForm.avgPackage,
      highestPackage: addForm.highestPackage,
      contactPerson: {
        name: addForm.contactName || 'Corporate Recruiter',
        email: addForm.contactEmail,
        phone: addForm.contactPhone || '+91 (080) 4000-0000',
        designation: addForm.contactDesignation,
      },
    });

    setIsAddModalOpen(false);
    showToast(`Added ${addForm.name} to corporate partner directory.`);
    setAddForm({
      name: '',
      industry: 'Technology & Cloud',
      tier: 'Tier 1 / Super Dream',
      website: '',
      location: 'Bangalore, India',
      avgPackage: '₹24.0 LPA',
      highestPackage: '₹40.0 LPA',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      contactDesignation: 'Campus Hiring Lead',
    });
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (!inviteForm.name || !inviteForm.contactEmail) return;

    inviteCompany(inviteForm);
    setIsInviteModalOpen(false);
    showToast(`Official campus placement invitation sent to ${inviteForm.contactEmail}.`);
    setInviteForm({
      name: '',
      industry: 'Technology & Cloud',
      tier: 'Tier 1 / Super Dream',
      website: '',
      location: 'Bangalore / Remote',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      contactDesignation: 'Lead University Recruiter',
      packageEstimate: '₹22.0 LPA',
    });
  };

  const breadcrumbs = [
    { label: 'University', href: ROUTES.UNIVERSITY_DASHBOARD },
    { label: 'Partner Companies' },
  ];

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        leftIcon={<Mail className="w-3.5 h-3.5" />}
        onClick={() => setIsInviteModalOpen(true)}
      >
        Invite Company
      </Button>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<Plus className="w-3.5 h-3.5" />}
        onClick={() => setIsAddModalOpen(true)}
      >
        Add Partner Company
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Partner Companies"
      subtitle="Corporate hiring network, verified recruitment history, signed MoU agreements, and active campus partnerships."
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

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Active Partners
            </span>
            <div className="text-xl font-bold text-neutral-900">{companies.length}</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Corporate network</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Tier 1 Super Dream
            </span>
            <div className="text-xl font-bold text-primary-700">
              {companies.filter((c) => c.tier.includes('Super Dream')).length}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">CTC &gt; ₹20 LPA</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Total Alumni Hired
            </span>
            <div className="text-xl font-bold text-emerald-700">
              {companies.reduce((acc, curr) => acc + (curr.totalHires || 0), 0)}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Across batches</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3.5">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              MoU Agreements
            </span>
            <div className="text-xl font-bold text-neutral-900">
              {companies.filter((c) => (c.moUStatus || '').includes('Active')).length}
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">Active institutional pacts</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search by company name, industry, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Tiers' },
                { value: 'Super Dream', label: 'Tier 1 / Super Dream' },
                { value: 'Dream', label: 'Tier 2 / Dream' },
              ]}
            />
          </div>

          <div className="w-full sm:w-48">
            <Select
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Verification' },
                { value: 'Verified', label: 'Verified Partners Only' },
                { value: 'Pending Verification', label: 'Pending Verification' },
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Company Cards Grid */}
      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map((company) => {
            const isVerified = company.verificationStatus === 'Verified';

            return (
              <Card
                key={company.id}
                className="flex flex-col justify-between hover:border-neutral-300 transition-all shadow-xs"
              >
                <CardContent className="p-5">
                  {/* Top: Logo & Verification */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg border border-neutral-200 bg-white p-2 flex items-center justify-center shrink-0 shadow-xs">
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>

                    <div className="text-right">
                      {isVerified ? (
                        <Badge variant="success" size="sm" dot>Verified Partner</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Verification Pending</Badge>
                      )}
                    </div>
                  </div>

                  {/* Company Name & Industry */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-semibold text-base text-neutral-900 truncate">
                        {company.name}
                      </h3>
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-400 hover:text-neutral-700"
                          title="Visit careers website"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 truncate">{company.industry}</p>
                    <span className="inline-block mt-1 text-[10px] font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-100">
                      {company.tier}
                    </span>
                  </div>

                  {/* Key Metrics Matrix */}
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-neutral-50 rounded-lg border border-neutral-100 text-xs mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Total Hired</span>
                      <span className="font-bold text-neutral-900">{company.totalHires || 0} students</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Avg Package</span>
                      <span className="font-bold text-emerald-700">{company.avgPackage}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Highest CTC</span>
                      <span className="font-medium text-neutral-700">{company.highestPackage || 'N/A'}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block">Active Drives</span>
                      <span className="font-medium text-neutral-700">{company.activeDrivesCount} Live</span>
                    </div>
                  </div>

                  {/* MoU Status */}
                  <div className="flex items-center justify-between text-[11px] text-neutral-500 pb-3 border-b border-neutral-100">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-neutral-400" />
                      {company.moUStatus}
                    </span>
                    <span className="text-neutral-400">{company.location}</span>
                  </div>

                  {/* Contact Person */}
                  {company.contactPerson && (
                    <div className="mt-3 text-xs">
                      <span className="text-[10px] uppercase font-semibold text-neutral-400 block mb-0.5">
                        University Recruiter
                      </span>
                      <div className="font-medium text-neutral-900 truncate">
                        {company.contactPerson.name}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {company.contactPerson.email}
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Footer Actions */}
                <div className="px-5 py-3 bg-neutral-50/75 border-t border-neutral-100 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewingCompany(company)}
                  >
                    View Details
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => navigate(ROUTES.PLACEMENT_DRIVES)}
                  >
                    Schedule Drive
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<Building2 className="w-6 h-6 text-neutral-400" />}
          title="No companies found"
          description="No partner organizations matched your query. Invite new companies to begin partnerships."
          actionLabel="Invite Company"
          onAction={() => setIsInviteModalOpen(true)}
        />
      )}

      {/* Modal: Add Partner Company */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Partner Company"
        description="Enroll a corporate recruiter into your institution's approved company directory."
        size="lg"
      >
        <form onSubmit={handleAddSubmit}>
          <ModalBody className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                placeholder="e.g. Oracle, Salesforce"
                required
                value={addForm.name}
                onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              />
              <Select
                label="Industry Sector"
                value={addForm.industry}
                onChange={(e) => setAddForm({ ...addForm, industry: e.target.value })}
                options={[
                  { value: 'Technology & Cloud', label: 'Technology & Cloud' },
                  { value: 'Banking & Financial Services', label: 'Banking & Financial Services' },
                  { value: 'Consulting & Advisory', label: 'Consulting & Advisory' },
                  { value: 'E-Commerce & Retail Tech', label: 'E-Commerce & Retail Tech' },
                  { value: 'Automotive & Core Engineering', label: 'Automotive & Core Engineering' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Recruitment Tier"
                value={addForm.tier}
                onChange={(e) => setAddForm({ ...addForm, tier: e.target.value })}
                options={[
                  { value: 'Tier 1 / Super Dream', label: 'Tier 1 / Super Dream (>20 LPA)' },
                  { value: 'Tier 2 / Dream', label: 'Tier 2 / Dream (10-20 LPA)' },
                  { value: 'Tier 3 / Regular', label: 'Tier 3 / Regular (<10 LPA)' },
                ]}
              />
              <Input
                label="Average Package CTC"
                placeholder="e.g. ₹22.0 LPA"
                value={addForm.avgPackage}
                onChange={(e) => setAddForm({ ...addForm, avgPackage: e.target.value })}
              />
              <Input
                label="Highest Package CTC"
                placeholder="e.g. ₹36.0 LPA"
                value={addForm.highestPackage}
                onChange={(e) => setAddForm({ ...addForm, highestPackage: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Careers / Company Website"
                placeholder="https://company.com/careers"
                value={addForm.website}
                onChange={(e) => setAddForm({ ...addForm, website: e.target.value })}
              />
              <Input
                label="Location / Office"
                placeholder="Bangalore, Hyderabad"
                value={addForm.location}
                onChange={(e) => setAddForm({ ...addForm, location: e.target.value })}
              />
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2">
                Primary Campus Recruiter Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Contact Name"
                  placeholder="e.g. Meera Nair"
                  value={addForm.contactName}
                  onChange={(e) => setAddForm({ ...addForm, contactName: e.target.value })}
                />
                <Input
                  label="Official Email"
                  type="email"
                  placeholder="recruiter@company.com"
                  required
                  value={addForm.contactEmail}
                  onChange={(e) => setAddForm({ ...addForm, contactEmail: e.target.value })}
                />
                <Input
                  label="Phone / Mobile"
                  placeholder="+91 (080) 1234-5678"
                  value={addForm.contactPhone}
                  onChange={(e) => setAddForm({ ...addForm, contactPhone: e.target.value })}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Save Partner Company
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: Invite Company */}
      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Company to Campus"
        description="Issue an official university invitation to participate in upcoming campus placement drives."
        size="md"
      >
        <form onSubmit={handleInviteSubmit}>
          <ModalBody className="space-y-4">
            <Input
              label="Company Name"
              placeholder="e.g. Stripe, Uber, Nvidia"
              required
              value={inviteForm.name}
              onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Recruiter Name"
                placeholder="e.g. Talent Lead"
                value={inviteForm.contactName}
                onChange={(e) => setInviteForm({ ...inviteForm, contactName: e.target.value })}
              />
              <Input
                label="Recruiter Work Email"
                type="email"
                placeholder="university-recruiting@company.com"
                required
                value={inviteForm.contactEmail}
                onChange={(e) => setInviteForm({ ...inviteForm, contactEmail: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Proposed Tier"
                value={inviteForm.tier}
                onChange={(e) => setInviteForm({ ...inviteForm, tier: e.target.value })}
                options={[
                  { value: 'Tier 1 / Super Dream', label: 'Tier 1 / Super Dream' },
                  { value: 'Tier 2 / Dream', label: 'Tier 2 / Dream' },
                ]}
              />
              <Input
                label="Estimated Package CTC"
                placeholder="e.g. ₹28.0 LPA"
                value={inviteForm.packageEstimate}
                onChange={(e) => setInviteForm({ ...inviteForm, packageEstimate: e.target.value })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setIsInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Send Official Invitation
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: View Company Details */}
      {viewingCompany && (
        <Modal
          isOpen={Boolean(viewingCompany)}
          onClose={() => setViewingCompany(null)}
          title={viewingCompany.name}
          description={`${viewingCompany.industry} • ${viewingCompany.location}`}
          size="lg"
        >
          <ModalBody className="space-y-5">
            <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
              <div className="w-16 h-16 rounded-xl border border-neutral-200 bg-white p-2.5 flex items-center justify-center shrink-0">
                <img
                  src={viewingCompany.logo}
                  alt={viewingCompany.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg text-neutral-900">{viewingCompany.name}</h3>
                  <Badge variant={viewingCompany.verificationStatus === 'Verified' ? 'success' : 'warning'} size="sm">
                    {viewingCompany.verificationStatus}
                  </Badge>
                </div>
                <p className="text-xs text-neutral-500">{viewingCompany.industry} • {viewingCompany.tier}</p>
                <div className="mt-1 text-xs text-primary-600 font-medium">{viewingCompany.moUStatus}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 rounded border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Total Hires</span>
                <span className="text-base font-bold text-neutral-900">{viewingCompany.totalHires} Students</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Avg CTC</span>
                <span className="text-base font-bold text-emerald-700">{viewingCompany.avgPackage}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Highest CTC</span>
                <span className="text-base font-bold text-neutral-900">{viewingCompany.highestPackage}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-100">
                <span className="text-neutral-400 block text-[10px] uppercase font-semibold">Last Visit</span>
                <span className="text-base font-bold text-neutral-900">{viewingCompany.lastVisited}</span>
              </div>
            </div>

            {viewingCompany.contactPerson && (
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100 text-xs">
                <h4 className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  Official Campus Recruiting Representative
                </h4>
                <div className="font-semibold text-sm text-neutral-900">{viewingCompany.contactPerson.name}</div>
                <div className="text-neutral-600">{viewingCompany.contactPerson.designation}</div>
                <div className="mt-2 flex items-center gap-4 text-neutral-500">
                  <span>{viewingCompany.contactPerson.email}</span>
                  <span>{viewingCompany.contactPerson.phone}</span>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" size="md" onClick={() => setViewingCompany(null)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setViewingCompany(null);
                navigate(ROUTES.PLACEMENT_DRIVES);
              }}
            >
              Go to Drives
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
}

export default function CompanyDirectory() {
  return (
    <UniversityProvider>
      <CompanyDirectoryContent />
    </UniversityProvider>
  );
}
