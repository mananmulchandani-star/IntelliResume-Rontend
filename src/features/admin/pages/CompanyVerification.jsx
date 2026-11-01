// src/features/admin/pages/CompanyVerification.jsx
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Input,
  Select,
  Modal,
  ModalBody,
  ModalFooter,
  Tabs,
  Tab,
  EmptyState,
} from '../../../components/ui';
import { ROUTES } from '../../../constants/routes';
import adminStorage from '../services/adminStorage';
import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Download,
  Eye,
  Globe,
  Mail,
  Phone,
  Clock,
  Briefcase,
  Hash,
  AlertTriangle,
  FileCheck,
  ExternalLink,
} from 'lucide-react';

export default function CompanyVerification() {
  const [companies, setCompanies] = useState([]);
  const [selectedTab, setSelectedTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Review & Audit Modal
  const [reviewCmp, setReviewCmp] = useState(null);
  const [decisionAction, setDecisionAction] = useState('approve'); // 'approve' | 'reject'
  const [auditNotes, setAuditNotes] = useState('');
  const [rejectionReasonCode, setRejectionReasonCode] = useState('tax_id_mismatch');
  const [docPreviewModal, setDocPreviewModal] = useState(null);

  const loadData = () => {
    setCompanies(adminStorage.getCompanies());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchTab = selectedTab === 'all' || c.status === selectedTab;
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.taxId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.recruiterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.corporateDomains?.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchTab && matchSearch;
    });
  }, [companies, selectedTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      pending: companies.filter((c) => c.status === 'pending').length,
      approved: companies.filter((c) => c.status === 'approved').length,
      rejected: companies.filter((c) => c.status === 'rejected').length,
      all: companies.length,
    };
  }, [companies]);

  const handleOpenReview = (cmp, defaultDecision = 'approve') => {
    setReviewCmp(cmp);
    setDecisionAction(defaultDecision);
    setAuditNotes(
      defaultDecision === 'approve'
        ? `Tax identification ${cmp.taxId} and corporate domain ${cmp.corporateDomains?.[0]} validated with state registry.`
        : ''
    );
  };

  const handleExecuteDecision = () => {
    if (!reviewCmp) return;

    if (decisionAction === 'approve') {
      adminStorage.updateCompany(reviewCmp.id, {
        status: 'approved',
        verifiedDate: new Date().toISOString().split('T')[0],
        verifiedBy: 'Admin Supervisor',
        rejectionReason: null,
      });
      adminStorage.addAuditLog({
        action: 'Employer Verified',
        target: `${reviewCmp.name} (${reviewCmp.taxId})`,
        type: 'success',
        details: `Approved business registration & whitelisted recruiting domains [${reviewCmp.corporateDomains?.join(', ')}]. Notes: ${auditNotes}`,
      });
      showToast(`${reviewCmp.name} is now a verified hiring partner.`);
    } else {
      const reasonsMap = {
        tax_id_mismatch: 'Tax registration number (EIN/CIN) does not match registered corporate legal entity.',
        domain_mismatch: 'Recruiting representative registered using generic/public email rather than official corporate domain.',
        invalid_docs: 'Submitted certificate of incorporation was expired, illegible, or unauthenticated.',
        other: auditNotes || 'Failed employer risk and trust verification guidelines.',
      };
      const finalReason = reasonsMap[rejectionReasonCode] || auditNotes;

      adminStorage.updateCompany(reviewCmp.id, {
        status: 'rejected',
        verifiedDate: null,
        verifiedBy: 'Admin Supervisor',
        rejectionReason: finalReason,
      });
      adminStorage.addAuditLog({
        action: 'Employer Verification Rejected',
        target: `${reviewCmp.name} (${reviewCmp.taxId})`,
        type: 'error',
        details: `Employer verification rejected: ${finalReason}`,
      });
      showToast(`${reviewCmp.name} verification was rejected.`);
    }

    setReviewCmp(null);
    loadData();
  };

  return (
    <DashboardLayout
      title="Employer Verification Queue"
      subtitle="Audit business tax identifiers, corporate recruitment domains, and hiring authority."
      breadcrumbs={[{ label: 'Platform Admin', href: ROUTES.ADMIN_DASHBOARD }, { label: 'Company Verification' }]}
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-neutral-900 text-white text-xs font-medium shadow-xl border border-neutral-800 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Filter and Tab Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <Tabs value={selectedTab} onChange={setSelectedTab}>
          <Tab value="pending" badge={counts.pending}>
            Pending Review
          </Tab>
          <Tab value="approved" badge={counts.approved}>
            Verified Employers
          </Tab>
          <Tab value="rejected" badge={counts.rejected}>
            Rejected
          </Tab>
          <Tab value="all" badge={counts.all}>
            All Employers
          </Tab>
        </Tabs>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search employer, tax ID, domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
          />
        </div>
      </div>

      {/* Listing Cards */}
      {filteredCompanies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={
            selectedTab === 'pending'
              ? 'No employer verification requests in queue'
              : 'No employers match this filter'
          }
          description="Employer business licenses and domain authorization dossiers submitted by recruiters will appear here."
          action={
            <Button variant="outline" size="sm" onClick={() => setSelectedTab('all')}>
              View All Employers
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredCompanies.map((cmp) => (
            <Card
              key={cmp.id}
              className="border border-neutral-200/90 hover:border-neutral-300 transition-all shadow-xs"
            >
              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Employer Details */}
                <div className="space-y-2 min-w-0 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-xl shrink-0">
                      {cmp.logo || '🏢'}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 leading-tight">
                        {cmp.name}
                      </h3>
                      <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-0.5">
                        <Globe className="w-3.5 h-3.5 text-neutral-400" />
                        HQ: {cmp.headquarters} &bull; {cmp.industry}
                      </p>
                    </div>
                    <div className="ml-auto lg:ml-2">
                      {cmp.status === 'pending' && (
                        <Badge variant="warning" size="sm" dot>Pending Review</Badge>
                      )}
                      {cmp.status === 'approved' && (
                        <Badge variant="success" size="sm" dot>Verified Employer</Badge>
                      )}
                      {cmp.status === 'rejected' && (
                        <Badge variant="error" size="sm" dot>Rejected</Badge>
                      )}
                    </div>
                  </div>

                  {/* Badges Strip */}
                  <div className="flex items-center gap-3 text-xs text-neutral-600 flex-wrap pt-1">
                    <span className="flex items-center gap-1 bg-neutral-100 px-2.5 py-1 rounded-md text-neutral-700 font-mono font-medium">
                      <Hash className="w-3.5 h-3.5 text-neutral-500" />
                      Tax ID: {cmp.taxId}
                    </span>
                    <span className="flex items-center gap-1 bg-neutral-100 px-2.5 py-1 rounded-md text-neutral-700 font-medium">
                      <Globe className="w-3.5 h-3.5 text-primary-600" />
                      Domains: {cmp.corporateDomains?.join(', ')}
                    </span>
                  </div>

                  {/* Recruiter Details */}
                  <div className="text-xs text-neutral-500 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      Representative: {cmp.recruiterName} ({cmp.recruiterEmail})
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      {cmp.phone}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Clock className="w-3.5 h-3.5" />
                      Submitted: {cmp.submittedDate}
                    </span>
                  </div>

                  {/* Rejection Note */}
                  {cmp.status === 'rejected' && cmp.rejectionReason && (
                    <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      <span className="font-semibold">Rejection Cause: </span>
                      {cmp.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Documents & Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-150">
                  <div className="space-y-1 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Business Filings ({cmp.documents?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {cmp.documents?.map((doc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDocPreviewModal(doc)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors border border-neutral-200"
                          title="Click to preview filing"
                        >
                          <FileText className="w-3 h-3 text-primary-600" />
                          <span className="truncate max-w-[130px]">{doc.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReview(cmp, cmp.status === 'approved' ? 'reject' : 'approve')}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Audit Dossier
                    </Button>
                    {cmp.status === 'pending' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenReview(cmp, 'approve')}
                        leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                      >
                        Verify Employer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={Boolean(reviewCmp)}
        onClose={() => setReviewCmp(null)}
        title={`Employer Verification Audit: ${reviewCmp?.name}`}
        description="Verify business tax identification against state records and confirm corporate domain whitelist."
        size="lg"
      >
        <ModalBody className="space-y-5">
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-neutral-900">{reviewCmp?.name}</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-600">
                {reviewCmp?.taxId}
              </span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              <strong className="text-neutral-800">Industry:</strong> {reviewCmp?.industry} &bull; <strong className="text-neutral-800">Headquarters:</strong> {reviewCmp?.headquarters}
            </p>
            <p className="text-neutral-500">
              <strong className="text-neutral-800">Authorized Recruiter:</strong> {reviewCmp?.recruiterName} ({reviewCmp?.recruiterEmail}) &bull; {reviewCmp?.phone}
            </p>
            <p className="text-neutral-500">
              <strong className="text-neutral-800">Recruiting Domains:</strong> {reviewCmp?.corporateDomains?.join(', ')}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Attached Corporate Filings & Tax Letters
            </h4>
            <div className="space-y-2">
              {reviewCmp?.documents?.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs font-semibold text-neutral-900">{doc.name}</p>
                      <p className="text-[11px] text-neutral-400">
                        {doc.type} &bull; {doc.size}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDocPreviewModal(doc)}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Inspect Document
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200">
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Verification Decision Action
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDecisionAction('approve');
                  setAuditNotes(`Verified business registration ${reviewCmp?.taxId}. Corporate domains authorized for recruitment.`);
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  decisionAction === 'approve'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Whitelist</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Grants Verified Employer status, authorizes campus hiring drives, and activates posting rights.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setDecisionAction('reject');
                  setAuditNotes('');
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  decisionAction === 'reject'
                    ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs">
                  <XCircle className="w-4 h-4" />
                  <span>Reject Application</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Denies verification with detailed audit justification and blocks job vacancy publication.
                </p>
              </button>
            </div>
          </div>

          {decisionAction === 'reject' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Primary Rejection Cause
              </label>
              <Select
                value={rejectionReasonCode}
                onChange={(e) => setRejectionReasonCode(e.target.value)}
                options={[
                  { value: 'tax_id_mismatch', label: 'Tax identification (EIN/CIN) unverified in official registry' },
                  { value: 'domain_mismatch', label: 'Recruiter domain mismatch (generic email used instead of corporate)' },
                  { value: 'invalid_docs', label: 'Incomplete or unverified Certificate of Incorporation' },
                  { value: 'other', label: 'Other policy violation (specify below)' },
                ]}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              {decisionAction === 'approve' ? 'Verification Audit Note' : 'Detailed Explanation for Rejection'}
            </label>
            <textarea
              rows={3}
              className="w-full text-xs p-2.5 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="Enter audit rationale..."
              value={auditNotes}
              onChange={(e) => setAuditNotes(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setReviewCmp(null)}>
            Cancel
          </Button>
          <Button
            variant={decisionAction === 'approve' ? 'primary' : 'danger'}
            size="sm"
            onClick={handleExecuteDecision}
            leftIcon={decisionAction === 'approve' ? <ShieldCheck className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          >
            {decisionAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Document Preview Modal */}
      <Modal
        isOpen={Boolean(docPreviewModal)}
        onClose={() => setDocPreviewModal(null)}
        title={`Document Preview: ${docPreviewModal?.name}`}
        description="Encrypted business filing stored on Supabase Enterprise Storage."
        size="md"
      >
        <ModalBody className="space-y-4">
          <div className="p-8 border-2 border-dashed border-neutral-200 rounded-lg text-center bg-neutral-50 flex flex-col items-center justify-center">
            <FileText className="w-12 h-12 text-primary-600 mb-3" />
            <h4 className="text-sm font-semibold text-neutral-900">{docPreviewModal?.name}</h4>
            <p className="text-xs text-neutral-500 mt-1">
              Document Category: {docPreviewModal?.type} &bull; Size: {docPreviewModal?.size}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated Business Document
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setDocPreviewModal(null)}>
            Close
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              showToast(`Downloading ${docPreviewModal?.name}...`);
              setDocPreviewModal(null);
            }}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Download Filing
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  );
}
