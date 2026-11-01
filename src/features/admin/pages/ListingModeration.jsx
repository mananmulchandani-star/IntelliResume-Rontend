// src/features/admin/pages/ListingModeration.jsx
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
  CheckSquare,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Users,
  Eye,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Flag,
  FileText,
  ExternalLink,
} from 'lucide-react';

const RISK_OPTIONS = [
  { value: 'all', label: 'All Risk Levels' },
  { value: 'high', label: 'High Risk (Scam / Spam / Fraud)' },
  { value: 'medium', label: 'Medium Risk (Policy / Hour Violations)' },
  { value: 'low', label: 'Low Risk (Algorithmic Anomaly)' },
  { value: 'none', label: 'No Flag / Clean' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Listing Types' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
];

export default function ListingModeration() {
  const [listings, setListings] = useState([]);
  const [selectedTab, setSelectedTab] = useState('flagged'); // 'flagged' | 'live' | 'taken_down' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);

  // Moderation Review Modal
  const [reviewListing, setReviewListing] = useState(null);
  const [moderationAction, setModerationAction] = useState('approve'); // 'approve' | 'takedown'
  const [moderationReasonCode, setModerationReasonCode] = useState('scam_fraud');
  const [moderationNotes, setModerationNotes] = useState('');

  const loadData = () => {
    setListings(adminStorage.getListings());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchTab = selectedTab === 'all' || item.status === selectedTab;
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchRisk = selectedRisk === 'all' || item.riskLevel === selectedRisk;
      const matchType = selectedType === 'all' || item.type === selectedType;

      return matchTab && matchSearch && matchRisk && matchType;
    });
  }, [listings, selectedTab, searchQuery, selectedRisk, selectedType]);

  const counts = useMemo(() => {
    return {
      flagged: listings.filter((l) => l.status === 'flagged').length,
      live: listings.filter((l) => l.status === 'live').length,
      taken_down: listings.filter((l) => l.status === 'taken_down').length,
      all: listings.length,
    };
  }, [listings]);

  const handleOpenReview = (listing, defaultAction = 'approve') => {
    setReviewListing(listing);
    setModerationAction(defaultAction);
    setModerationNotes(
      defaultAction === 'approve'
        ? 'Reviewed listing details and verified fair recruitment guidelines.'
        : ''
    );
  };

  const handleExecuteModeration = () => {
    if (!reviewListing) return;

    if (moderationAction === 'approve') {
      adminStorage.updateListing(reviewListing.id, {
        status: 'live',
        riskLevel: 'none',
      });
      adminStorage.addAuditLog({
        action: 'Listing Approved & Cleared',
        target: `${reviewListing.company} - ${reviewListing.title}`,
        type: 'success',
        details: `Cleared policy flag. Re-authorized listing for student application portal. Note: ${moderationNotes}`,
      });
      showToast(`Listing "${reviewListing.title}" cleared and marked live.`);
    } else {
      const reasonsMap = {
        scam_fraud: 'Unrealistic compensation or third-party fee collection solicitation (Scam heuristic).',
        labor_violation: 'Unpaid full-time terms violating student employment labor limits.',
        pyramid_mlm: 'Multi-level marketing / token referral structure prohibited on platform.',
        inappropriate: 'Inappropriate, discriminatory, or hostile job specifications.',
        other: moderationNotes || 'Policy violation.',
      };
      const finalReason = reasonsMap[moderationReasonCode] || moderationNotes;

      adminStorage.updateListing(reviewListing.id, {
        status: 'taken_down',
        flags: [
          ...(reviewListing.flags || []),
          {
            reason: finalReason,
            detectedBy: 'Platform Administrator Moderation',
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            severity: 'high',
          },
        ],
      });
      adminStorage.addAuditLog({
        action: 'Listing Taken Down',
        target: `${reviewListing.company} - ${reviewListing.title}`,
        type: 'error',
        details: `Listing revoked and unlisted from all campus drives. Cause: ${finalReason}`,
      });
      showToast(`Listing "${reviewListing.title}" taken down from platform.`);
    }

    setReviewListing(null);
    loadData();
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'high':
        return <Badge variant="error" size="sm">High Risk</Badge>;
      case 'medium':
        return <Badge variant="warning" size="sm">Medium Risk</Badge>;
      case 'low':
        return <Badge variant="info" size="sm">Low Risk</Badge>;
      default:
        return <Badge variant="success" size="sm">Verified Clean</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return <Badge variant="success" size="sm" dot>Live & Active</Badge>;
      case 'flagged':
        return <Badge variant="error" size="sm" dot>Flagged / In Review</Badge>;
      case 'taken_down':
        return <Badge variant="default" size="sm" dot>Taken Down</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Listing Moderation Queue"
      subtitle="Safeguard students by inspecting job, internship, and campus drive postings for policy violations."
      breadcrumbs={[{ label: 'Platform Admin', href: ROUTES.ADMIN_DASHBOARD }, { label: 'Listing Moderation' }]}
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-neutral-900 text-white text-xs font-medium shadow-xl border border-neutral-800 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <Tabs value={selectedTab} onChange={setSelectedTab}>
          <Tab value="flagged" badge={counts.flagged}>
            Flagged & In Review
          </Tab>
          <Tab value="live" badge={counts.live}>
            Live Listings
          </Tab>
          <Tab value="taken_down" badge={counts.taken_down}>
            Taken Down
          </Tab>
          <Tab value="all" badge={counts.all}>
            All Vacancies
          </Tab>
        </Tabs>
      </div>

      {/* Filters Bar */}
      <Card className="p-4 mb-6 border border-neutral-200">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-80">
            <Input
              placeholder="Search by role, company, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full sm:w-56">
              <Select
                value={selectedRisk}
                onChange={(e) => setSelectedRisk(e.target.value)}
                options={RISK_OPTIONS}
              />
            </div>

            <div className="w-full sm:w-48">
              <Select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                options={TYPE_OPTIONS}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Listing Feed */}
      {filteredListings.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title={
            selectedTab === 'flagged'
              ? 'No listings currently require moderation'
              : 'No vacancies match these filter criteria'
          }
          description="Automated heuristic scanners and student feedback flags will surface suspicious postings here."
          action={
            <Button variant="outline" size="sm" onClick={() => { setSelectedTab('all'); setSelectedRisk('all'); }}>
              Reset View
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredListings.map((listing) => (
            <Card
              key={listing.id}
              className={`border transition-all shadow-xs ${
                listing.status === 'flagged'
                  ? 'border-amber-300/80 bg-amber-50/15'
                  : 'border-neutral-200/90'
              }`}
            >
              <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Details */}
                <div className="space-y-2 min-w-0 max-w-2xl">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-base font-bold text-neutral-900 leading-tight">
                      {listing.title}
                    </h3>
                    <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                      {listing.company}
                    </span>
                    {getRiskBadge(listing.riskLevel)}
                    {getStatusBadge(listing.status)}
                  </div>

                  {/* Compensation & Metadata */}
                  <div className="flex items-center gap-4 text-xs text-neutral-600 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-neutral-800">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      {listing.compensation}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-neutral-400" />
                      {listing.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {listing.location}
                    </span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Users className="w-3.5 h-3.5" />
                      {listing.applicantCount} applicants
                    </span>
                    <span className="flex items-center gap-1 text-neutral-400">
                      <Clock className="w-3.5 h-3.5" />
                      Posted {listing.postedDate}
                    </span>
                  </div>

                  {/* Flag alert box if flagged */}
                  {listing.flags && listing.flags.length > 0 && (
                    <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          Flagged Reason:
                        </span>
                        <span className="text-[10px] text-amber-700 font-mono">
                          {listing.flags[0].detectedBy}
                        </span>
                      </div>
                      <p className="leading-relaxed pl-5">
                        {listing.flags[0].reason}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                    {listing.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenReview(listing, 'approve')}
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Inspect Details
                  </Button>

                  {listing.status === 'flagged' && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenReview(listing, 'approve')}
                        leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                      >
                        Clear Flag & Publish
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleOpenReview(listing, 'takedown')}
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Take Down
                      </Button>
                    </>
                  )}

                  {listing.status === 'live' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReview(listing, 'takedown')}
                      className="text-neutral-600 hover:text-rose-600 hover:border-rose-300"
                    >
                      Take Down
                    </Button>
                  )}

                  {listing.status === 'taken_down' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenReview(listing, 'approve')}
                    >
                      Restore Listing
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Moderation Review Modal */}
      <Modal
        isOpen={Boolean(reviewListing)}
        onClose={() => setReviewListing(null)}
        title={`Listing Moderation: ${reviewListing?.title}`}
        description="Verify listing content against fair recruitment, anti-scam, and student welfare policies."
        size="lg"
      >
        <ModalBody className="space-y-4">
          <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-neutral-900">{reviewListing?.title}</span>
              <span className="font-semibold text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200">
                {reviewListing?.company}
              </span>
            </div>
            <div className="flex items-center gap-4 text-neutral-600">
              <span><strong>Compensation:</strong> {reviewListing?.compensation}</span>
              <span><strong>Type:</strong> {reviewListing?.type}</span>
              <span><strong>Location:</strong> {reviewListing?.location}</span>
            </div>
            <p className="text-neutral-500">
              <strong>Campus Drive:</strong> {reviewListing?.driveLinked || 'General Portal'} &bull; <strong>Applicants:</strong> {reviewListing?.applicantCount} students
            </p>
          </div>

          {/* Full description */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
              Full Job Description
            </h4>
            <div className="p-3.5 rounded-lg border border-neutral-200 bg-white text-xs text-neutral-700 max-h-48 overflow-y-auto leading-relaxed scrollbar-thin">
              {reviewListing?.description}
            </div>
          </div>

          {/* Flag alerts */}
          {reviewListing?.flags && reviewListing.flags.length > 0 && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Active Heuristic Flags:
              </span>
              <ul className="list-disc pl-5 space-y-1 mt-1">
                {reviewListing.flags.map((f, i) => (
                  <li key={i}>
                    {f.reason} (<span className="font-mono text-[11px]">{f.detectedBy}</span>)
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Choice */}
          <div className="pt-2 border-t border-neutral-200">
            <label className="block text-xs font-semibold text-neutral-700 mb-2">
              Moderation Decision
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setModerationAction('approve');
                  setModerationNotes('Verified listing complies with fair compensation and campus standards.');
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  moderationAction === 'approve'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Clear Listing</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Clears warning flags, restores status to Live, and makes posting available for students.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setModerationAction('takedown');
                  setModerationNotes('');
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  moderationAction === 'takedown'
                    ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500/20'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-2 text-rose-700 font-semibold text-xs">
                  <XCircle className="w-4 h-4" />
                  <span>Take Down & Revoke</span>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  Immediately unlists posting, prevents new applications, and notifies the employer.
                </p>
              </button>
            </div>
          </div>

          {moderationAction === 'takedown' && (
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Primary Policy Infraction
              </label>
              <Select
                value={moderationReasonCode}
                onChange={(e) => setModerationReasonCode(e.target.value)}
                options={[
                  { value: 'scam_fraud', label: 'Anti-Scam Heuristic / Fee Request / Fake Compensation' },
                  { value: 'labor_violation', label: 'Labor Regulations: Excessive unpaid hours for students' },
                  { value: 'pyramid_mlm', label: 'Multi-Level Marketing / Token pyramid referral scheme' },
                  { value: 'inappropriate', label: 'Discriminatory or inappropriate posting requirements' },
                  { value: 'other', label: 'Other platform policy violation (specify below)' },
                ]}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              {moderationAction === 'approve' ? 'Moderation Approval Note' : 'Detailed Justification Note'}
            </label>
            <textarea
              rows={3}
              className="w-full text-xs p-2.5 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder="Enter audit rationale..."
              value={moderationNotes}
              onChange={(e) => setModerationNotes(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" size="sm" onClick={() => setReviewListing(null)}>
            Cancel
          </Button>
          <Button
            variant={moderationAction === 'approve' ? 'primary' : 'danger'}
            size="sm"
            onClick={handleExecuteModeration}
            leftIcon={moderationAction === 'approve' ? <ShieldCheck className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          >
            {moderationAction === 'approve' ? 'Authorize & Publish' : 'Confirm Take Down'}
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  );
}
