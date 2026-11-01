// src/features/admin/pages/UniversityVerification.jsx
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
import { supabase } from '../../../services/supabase';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Building,
  ShieldCheck,
  ShieldAlert,
  Download,
  Eye,
  ExternalLink,
  Users,
  Award,
  Globe,
  Mail,
  Phone,
  Clock,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export default function UniversityVerification() {
  const [universities, setUniversities] = useState([]);
  const [selectedTab, setSelectedTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Review & Audit Modal
  const [reviewUni, setReviewUni] = useState(null);
  const [decisionAction, setDecisionAction] = useState('approve'); // 'approve' | 'reject'
  const [auditNotes, setAuditNotes] = useState('');
  const [rejectionReasonCode, setRejectionReasonCode] = useState('accreditation_deficiency');
  const [docPreviewModal, setDocPreviewModal] = useState(null);

  const loadData = async () => {
    let list = adminStorage.getUniversities();
    try {
      const { data, error } = await supabase.from('universities').select('*');
      if (!error && data && data.length > 0) {
        const formatted = data.map((d) => ({
          id: d.id,
          name: d.name,
          country: d.location || 'India',
          state: '',
          domain: d.domain || `${d.name.toLowerCase().replace(/[^a-z]/g, '')}.edu`,
          accreditationBoard: d.accreditation_board || 'UGC / State Approved',
          ranking: 'Institutional Partner',
          batchCapacity: d.batch_capacity || 1000,
          deanName: d.dean_name,
          deanEmail: d.dean_email,
          phone: d.phone,
          status: d.status || 'pending',
          submittedDate: d.created_at ? d.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
          verifiedDate: d.verified_at,
          documents: [],
        }));
        const existingNames = new Set(list.map((u) => u.name.toLowerCase()));
        const uniqueRemote = formatted.filter((f) => !existingNames.has(f.name.toLowerCase()));
        list = [...uniqueRemote, ...list];
      }
    } catch {
      // ignore
    }
    setUniversities(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredUnis = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return universities.filter((u) => {
      const matchTab = selectedTab === 'all' || u.status === selectedTab;
      if (!q) return matchTab;
      const matchSearch =
        (u.name || '').toLowerCase().includes(q) ||
        (u.country || '').toLowerCase().includes(q) ||
        (u.domain || '').toLowerCase().includes(q) ||
        (u.deanName || '').toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [universities, selectedTab, searchQuery]);

  const counts = useMemo(() => {
    return {
      pending: universities.filter((u) => u.status === 'pending').length,
      approved: universities.filter((u) => u.status === 'approved').length,
      rejected: universities.filter((u) => u.status === 'rejected').length,
      all: universities.length,
    };
  }, [universities]);

  const handleOpenReview = (uni, defaultDecision = 'approve') => {
    setReviewUni(uni);
    setDecisionAction(defaultDecision);
    setAuditNotes(
      defaultDecision === 'approve'
        ? `Accreditation credentials verified against ${uni.accreditationBoard}. Domain ${uni.domain} validated.`
        : ''
    );
  };

  const handleExecuteDecision = () => {
    if (!reviewUni) return;

    if (decisionAction === 'approve') {
      adminStorage.updateUniversity(reviewUni.id, {
        status: 'approved',
        verifiedDate: new Date().toISOString().split('T')[0],
        verifiedBy: 'Admin Supervisor',
        rejectionReason: null,
      });
      adminStorage.addAuditLog({
        action: 'University Verified',
        target: `${reviewUni.name} (${reviewUni.domain})`,
        type: 'success',
        details: `Approved institutional accreditation. Student capacity: ${reviewUni.batchCapacity?.toLocaleString()}. Notes: ${auditNotes}`,
      });
      showToast(`${reviewUni.name} has been verified & approved.`);
    } else {
      const reasonsMap = {
        accreditation_deficiency: 'Lacks valid institutional accreditation from recognized national board.',
        domain_unverified: 'Institutional registrar email domain could not be verified.',
        incomplete_docs: 'Missing mandated MoA charter and Dean authorization signatory letters.',
        other: auditNotes || 'Failed institutional trust verification guidelines.',
      };
      const finalReason = reasonsMap[rejectionReasonCode] || auditNotes;

      adminStorage.updateUniversity(reviewUni.id, {
        status: 'rejected',
        verifiedDate: null,
        verifiedBy: 'Admin Supervisor',
        rejectionReason: finalReason,
      });
      adminStorage.addAuditLog({
        action: 'University Application Rejected',
        target: `${reviewUni.name} (${reviewUni.domain})`,
        type: 'error',
        details: `Application rejected: ${finalReason}`,
      });
      showToast(`${reviewUni.name} verification was rejected.`);
    }

    setReviewUni(null);
    loadData();
  };

  return (
    <DashboardLayout
      title="University Verification Queue"
      subtitle="Authenticate degree-granting accreditation documents, domain credentials, and student capacity."
      breadcrumbs={[{ label: 'Platform Admin', href: ROUTES.ADMIN_DASHBOARD }, { label: 'University Verification' }]}
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
            Approved & Verified
          </Tab>
          <Tab value="rejected" badge={counts.rejected}>
            Rejected
          </Tab>
          <Tab value="all" badge={counts.all}>
            All Institutions
          </Tab>
        </Tabs>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search institution, domain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
          />
        </div>
      </div>

      {/* Listing Cards */}
      {filteredUnis.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title={
            selectedTab === 'pending'
              ? 'No universities currently pending verification'
              : 'No institutions match this filter'
          }
          description="Institutional accreditation dossiers submitted by university placement cells will appear here."
          action={
            <Button variant="outline" size="sm" onClick={() => setSelectedTab('all')}>
              View All Universities
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredUnis.map((uni) => (
            <Card
              key={uni.id}
              className="border border-neutral-200/90 hover:border-neutral-300 transition-all shadow-xs"
            >
              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Institution Core Info */}
                <div className="space-y-2 min-w-0 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-700 border border-primary-100 flex items-center justify-center font-bold text-sm shrink-0">
                      <GraduationCap className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 leading-tight">
                        {uni.name}
                      </h3>
                      <p className="text-xs text-neutral-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <Globe className="w-3.5 h-3.5 text-neutral-400" />
                        {uni.domain} &bull; {uni.state}, {uni.country}
                      </p>
                    </div>
                    <div className="ml-auto lg:ml-2">
                      {uni.status === 'pending' && (
                        <Badge variant="warning" size="sm" dot>Pending Review</Badge>
                      )}
                      {uni.status === 'approved' && (
                        <Badge variant="success" size="sm" dot>Verified & Active</Badge>
                      )}
                      {uni.status === 'rejected' && (
                        <Badge variant="error" size="sm" dot>Rejected</Badge>
                      )}
                    </div>
                  </div>

                  {/* Badges / Metrics Strip */}
                  <div className="flex items-center gap-3 text-xs text-neutral-600 flex-wrap pt-1">
                    <span className="flex items-center gap-1 bg-neutral-100 px-2.5 py-1 rounded-md text-neutral-700 font-medium">
                      <Award className="w-3.5 h-3.5 text-primary-600" />
                      {uni.accreditationBoard}
                    </span>
                    <span className="flex items-center gap-1 bg-neutral-100 px-2.5 py-1 rounded-md text-neutral-700 font-medium">
                      <Users className="w-3.5 h-3.5 text-neutral-500" />
                      Batch Capacity: {uni.batchCapacity?.toLocaleString()} students
                    </span>
                    <span className="bg-neutral-100 px-2 py-1 rounded-md text-neutral-600 font-mono text-[11px]">
                      {uni.ranking}
                    </span>
                  </div>

                  {/* Dean / Submitter Contact */}
                  <div className="text-xs text-neutral-500 flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      {uni.deanName} ({uni.deanEmail})
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      {uni.phone}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Clock className="w-3.5 h-3.5" />
                      Submitted: {uni.submittedDate}
                    </span>
                  </div>

                  {/* Rejection Note if applicable */}
                  {uni.status === 'rejected' && uni.rejectionReason && (
                    <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-800">
                      <span className="font-semibold">Rejection Cause: </span>
                      {uni.rejectionReason}
                    </div>
                  )}
                </div>

                {/* Verification Documents & Action Buttons */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-150">
                  {/* Documents attached */}
                  <div className="space-y-1 text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      Accreditation Dossier ({uni.documents?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {uni.documents?.map((doc, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDocPreviewModal(doc)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors border border-neutral-200"
                          title="Click to preview credential"
                        >
                          <FileText className="w-3 h-3 text-primary-600" />
                          <span className="truncate max-w-[130px]">{doc.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action triggers */}
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReview(uni, uni.status === 'approved' ? 'reject' : 'approve')}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Audit Dossier
                    </Button>
                    {uni.status === 'pending' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenReview(uni, 'approve')}
                        leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                      >
                        Approve Institution
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Review & Audit Modal */}
      <Modal
        isOpen={Boolean(reviewUni)}
        onClose={() => setReviewUni(null)}
        title={`Audit Accreditation: ${reviewUni?.name}`}
        description="Review accreditation board compliance, campus batch authorization, and official MoA agreements."
        size="lg"
      >
        <ModalBody className="space-y-5">
          {/* Institutional summary banner */}
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-neutral-900">{reviewUni?.name}</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-600">
                {reviewUni?.domain}
              </span>
            </div>
            <p className="text-neutral-600 leading-relaxed">
              <strong className="text-neutral-800">Accreditation Board:</strong> {reviewUni?.accreditationBoard} &bull; <strong className="text-neutral-800">Capacity:</strong> {reviewUni?.batchCapacity?.toLocaleString()} graduates/year &bull; <strong className="text-neutral-800">Ranking:</strong> {reviewUni?.ranking}
            </p>
            <p className="text-neutral-500">
              <strong className="text-neutral-800">Dean of Career Services:</strong> {reviewUni?.deanName} ({reviewUni?.deanEmail}) &bull; {reviewUni?.phone}
            </p>
          </div>

          {/* Documents verification list */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
              Attached Accreditation Documents
            </h4>
            <div className="space-y-2">
              {reviewUni?.documents?.map((doc, idx) => (
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

          {/* Decision Selector */}
          <div className="pt-2 border-t border-neutral-200">
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Verification Decision Action
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setDecisionAction('approve');
                  setAuditNotes(`Verified accreditation against ${reviewUni?.accreditationBoard}. Authorized for platform placement drives.`);
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  decisionAction === 'approve'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Approve</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Issues verified university credentials, opens campus drive management, and whitelists domain.
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
                  Denies verification with documented audit reason and notifies the Dean of Career Services.
                </p>
              </button>
            </div>
          </div>

          {/* Conditional Input based on decision */}
          {decisionAction === 'reject' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Primary Rejection Cause
              </label>
              <Select
                value={rejectionReasonCode}
                onChange={(e) => setRejectionReasonCode(e.target.value)}
                options={[
                  { value: 'accreditation_deficiency', label: 'Accreditation board unrecognized or expired' },
                  { value: 'domain_unverified', label: 'Institutional .edu domain mismatch or failed SPF/DKIM' },
                  { value: 'incomplete_docs', label: 'Missing mandated charter agreement or Dean authorization' },
                  { value: 'other', label: 'Other custom violation (specify below)' },
                ]}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              {decisionAction === 'approve' ? 'Verification Audit Note' : 'Detailed Explanation for Rejection (Sent to Submitter)'}
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
          <Button variant="outline" size="sm" onClick={() => setReviewUni(null)}>
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
        title={`Credential Preview: ${docPreviewModal?.name}`}
        description="Cryptographically signed institutional document stored on Supabase Secure Vault."
        size="md"
      >
        <ModalBody className="space-y-4">
          <div className="p-8 border-2 border-dashed border-neutral-200 rounded-lg text-center bg-neutral-50 flex flex-col items-center justify-center">
            <FileText className="w-12 h-12 text-primary-600 mb-3" />
            <h4 className="text-sm font-semibold text-neutral-900">{docPreviewModal?.name}</h4>
            <p className="text-xs text-neutral-500 mt-1">
              File type: {docPreviewModal?.type} &bull; Size: {docPreviewModal?.size}
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Digital Seal Intact
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
            Download Original PDF
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  );
}
