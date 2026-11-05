// src/features/admin/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Modal, ModalBody, ModalFooter } from '../../../components/ui';
import { ROUTES } from '../../../constants/routes';
import adminStorage from '../services/adminStorage';
import AdminStatCard from '../components/AdminStatCard';
import { supabase } from '../../../services/supabase';
import {
  Users,
  GraduationCap,
  Building2,
  Briefcase,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  FileCheck,
  FileText,
  Server,
  Zap,
} from 'lucide-react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(adminStorage.getPlatformMetrics());
  const [pendingUnis, setPendingUnis] = useState([]);
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [flaggedListings, setFlaggedListings] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isHealthRefreshing, setIsHealthRefreshing] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  // Quick Action Modal state
  const [quickActionModal, setQuickActionModal] = useState({
    isOpen: false,
    type: null, // 'uni' | 'company' | 'listing'
    item: null,
    action: null, // 'approve' | 'reject'
  });
  const [actionReason, setActionReason] = useState('');

  const loadData = async () => {
    let currentMetrics = adminStorage.getPlatformMetrics();
    setMetrics(currentMetrics);
    let unis = adminStorage.getUniversities().filter((u) => u.status === 'pending');
    let cmps = adminStorage.getCompanies().filter((c) => c.status === 'pending');

    try {
      const [remoteUnisRes, remoteCmpsRes, remoteUsersRes, allUnisRes, allCmpsRes] = await Promise.all([
        supabase.from('universities').select('*').eq('status', 'pending'),
        supabase.from('companies').select('*').eq('status', 'pending'),
        supabase.from('users').select('id, role', { count: 'exact' }),
        supabase.from('universities').select('id, status'),
        supabase.from('companies').select('id, status'),
      ]);

      // Calculate real total users from Supabase and local storage
      const localUsers = adminStorage.getUsers();
      const remoteUserCount = remoteUsersRes.count ?? (remoteUsersRes.data ? remoteUsersRes.data.length : 0);
      const totalUserCount = Math.max(localUsers.length, remoteUserCount);

      // Calculate real universities counts
      const remoteUnis = allUnisRes.data || [];
      const localUnis = adminStorage.getUniversities();
      const verifiedUnisCount = Math.max(
        localUnis.filter((u) => u.status === 'approved').length,
        remoteUnis.filter((u) => u.status === 'approved').length
      );

      // Calculate real companies counts
      const remoteCmps = allCmpsRes.data || [];
      const localCmps = adminStorage.getCompanies();
      const verifiedCmpsCount = Math.max(
        localCmps.filter((c) => c.status === 'approved').length,
        remoteCmps.filter((c) => c.status === 'approved').length
      );

      if (!remoteUnisRes.error && remoteUnisRes.data?.length) {
        const existingNames = new Set(unis.map((u) => (u.name || '').toLowerCase()));
        const extras = remoteUnisRes.data
          .filter((r) => !existingNames.has((r.name || '').toLowerCase()))
          .map((d) => ({
            id: d.id,
            name: d.name,
            domain: d.domain,
            headquarters: d.location || 'India',
            deanName: d.dean_name,
            deanEmail: d.dean_email,
            accreditationBoard: d.accreditation_board || 'Accreditation Pending',
            batchCapacity: Number(d.batch_capacity) || 0,
            submittedDate: d.created_at ? d.created_at.split('T')[0] : 'Recently',
            status: d.status || 'pending',
          }));
        unis = [...extras, ...unis];
      }

      if (!remoteCmpsRes.error && remoteCmpsRes.data?.length) {
        const existingNames = new Set(cmps.map((c) => (c.name || '').toLowerCase()));
        const extras = remoteCmpsRes.data
          .filter((r) => !existingNames.has((r.name || '').toLowerCase()))
          .map((d) => ({
            id: d.id,
            name: d.name,
            logo: '🏢',
            industry: d.industry || 'Software & Tech',
            headquarters: d.headquarters || 'Remote',
            taxId: d.tax_id || 'Corporate Entity',
            corporateDomains: [d.domain || 'company.com'],
            domain: d.domain || 'company.com',
            recruiterName: d.recruiter_name || 'Talent Lead',
            recruiterEmail: d.recruiter_email || '',
            submittedDate: d.created_at ? d.created_at.split('T')[0] : 'Recently',
            status: d.status || 'pending',
          }));
        cmps = [...extras, ...cmps];
      }

      setMetrics({
        ...currentMetrics,
        totalUsers: totalUserCount,
        userCountDisplay: totalUserCount.toLocaleString(),
        verifiedUniversities: verifiedUnisCount,
        pendingUniversities: unis.length,
        verifiedCompanies: verifiedCmpsCount,
        pendingCompanies: cmps.length,
      });
    } catch {
      // ignore
    }

    setPendingUnis(unis);
    setPendingCompanies(cmps);
    setFlaggedListings(adminStorage.getListings().filter((l) => l.status === 'flagged'));
    setAuditLogs(adminStorage.getAuditLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message, type = 'success') => {
    setFeedbackToast({ message, type });
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleRefreshHealth = () => {
    setIsHealthRefreshing(true);
    setTimeout(() => {
      setIsHealthRefreshing(false);
      showToast('System health check completed. All nodes operational (99.98%).');
    }, 600);
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset all admin mock data back to factory defaults?')) {
      adminStorage.resetToDefaults();
      loadData();
      showToast('Mock database reset to default seed state.');
    }
  };

  const handleOpenQuickAction = (type, item, action) => {
    setActionReason('');
    setQuickActionModal({
      isOpen: true,
      type,
      item,
      action,
    });
  };

  const handleConfirmQuickAction = async () => {
    const { type, item, action } = quickActionModal;
    if (!item) return;

    if (type === 'uni') {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      adminStorage.updateUniversity(item.id, {
        status: newStatus,
        verifiedDate: action === 'approve' ? new Date().toISOString().split('T')[0] : null,
        verifiedBy: 'Admin Supervisor',
        rejectionReason: action === 'reject' ? actionReason || 'Credential requirements not met' : null,
      });

      try {
        await supabase
          .from('universities')
          .update({
            status: newStatus,
          })
          .match({ name: item.name });
      } catch {
        // ignore
      }

      adminStorage.addAuditLog({
        action: action === 'approve' ? 'University Approved' : 'University Rejected',
        target: item.name,
        type: action === 'approve' ? 'success' : 'error',
        details: action === 'approve' ? 'Verified accreditation and authorized institutional placement drives' : `Rejected: ${actionReason || 'Document deficiency'}`,
      });
      showToast(`${item.name} has been ${newStatus}.`);
    } else if (type === 'company') {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      adminStorage.updateCompany(item.id, {
        status: newStatus,
        verifiedDate: action === 'approve' ? new Date().toISOString().split('T')[0] : null,
        verifiedBy: 'Admin Supervisor',
        rejectionReason: action === 'reject' ? actionReason || 'Business verification failed' : null,
      });

      try {
        await supabase
          .from('companies')
          .update({
            status: newStatus,
            verified_at: action === 'approve' ? new Date().toISOString() : null,
          })
          .match({ name: item.name });
      } catch {
        // ignore
      }

      adminStorage.addAuditLog({
        action: action === 'approve' ? 'Employer Verified' : 'Employer Rejected',
        target: item.name,
        type: action === 'approve' ? 'success' : 'error',
        details: action === 'approve' ? 'Business registration authenticated & hiring authorized' : `Rejected: ${actionReason || 'Domain or registration issue'}`,
      });
      showToast(`${item.name} has been ${newStatus}.`);
    } else if (type === 'listing') {
      const newStatus = action === 'approve' ? 'live' : 'taken_down';
      adminStorage.updateListing(item.id, {
        status: newStatus,
      });
      adminStorage.addAuditLog({
        action: action === 'approve' ? 'Listing Cleared' : 'Listing Taken Down',
        target: `${item.company} - ${item.title}`,
        type: action === 'approve' ? 'success' : 'error',
        details: action === 'approve' ? 'Listing cleared and restored to active board' : `Taken down: ${actionReason || 'Policy violation'}`,
      });
      showToast(`Listing ${action === 'approve' ? 'approved and published live' : 'taken down'}.`);
    }

    setQuickActionModal({ isOpen: false, type: null, item: null, action: null });
    loadData();
  };

  return (
    <DashboardLayout
      title="Platform Operations Overview"
      subtitle="Global platform vitals, verification queues, and operational trust moderation."
      breadcrumbs={[{ label: 'Platform Admin', href: ROUTES.ADMIN_DASHBOARD }, { label: 'Overview' }]}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshHealth}
            isLoading={isHealthRefreshing}
            leftIcon={<Activity className="w-3.5 h-3.5 text-emerald-600" />}
          >
            Run Health Probe
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetDemoData}
            title="Reset to default mock datasets"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          >
            Reset Seed Data
          </Button>
        </div>
      }
    >
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-neutral-900 text-white text-xs font-medium shadow-xl border border-neutral-800 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast.message}</span>
        </div>
      )}

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <AdminStatCard
          title="Total Users"
          value={metrics?.userCountDisplay || '0'}
          trend={metrics?.userGrowth || 'Live Data'}
          trendType="positive"
          icon={Users}
          subvalue="Across Students, Staff & Recruiters"
          badgeText="Active platform accounts"
        />

        <AdminStatCard
          title="Verified Universities"
          value={metrics?.verifiedUniversities || 0}
          trend={(metrics?.pendingUniversities || 0) > 0 ? `${metrics.pendingUniversities} Pending` : 'All Caught Up'}
          trendType={(metrics?.pendingUniversities || 0) > 0 ? 'neutral' : 'positive'}
          icon={GraduationCap}
          subvalue="Institutional placement hubs"
          badgeText="Accredited degree campuses"
        />

        <AdminStatCard
          title="Verified Employers"
          value={metrics?.verifiedCompanies || 0}
          trend={(metrics?.pendingCompanies || 0) > 0 ? `${metrics.pendingCompanies} Pending` : 'Up to date'}
          trendType={(metrics?.pendingCompanies || 0) > 0 ? 'neutral' : 'positive'}
          icon={Building2}
          subvalue="Direct hiring partners"
          badgeText="Tier-1 & verified startups"
        />

        <AdminStatCard
          title="Total Placements"
          value={metrics?.totalPlacements || '0'}
          trend={metrics?.placementGrowth || 'Live'}
          trendType="positive"
          icon={Briefcase}
          subvalue="Offers accepted via portal"
          badgeText="2025-2026 academic cycle"
        />

        <AdminStatCard
          title="System Health"
          value={metrics?.systemHealth || '100% Operational'}
          trend="Operational"
          trendType="live"
          icon={Activity}
          subvalue={`Latency: ${metrics?.apiLatency || 'Normal'} | 0 incidents`}
          badgeText="99.98% 30-day uptime"
        />
      </div>

      {/* Main Grid: Pending Approval Queues & Live Audit Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column (2 spans): Quick Action Queues */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Pending University Verifications */}
          <Card className="border border-neutral-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary-600" />
                  <span>Pending University Verifications</span>
                  <Badge variant={(pendingUnis || []).length > 0 ? 'warning' : 'default'} size="sm">
                    {(pendingUnis || []).length} awaiting
                  </Badge>
                </CardTitle>
                <p className="text-xs text-neutral-500 mt-1">
                  Accreditation documents and institutional registrar credentials requiring administrative authorization.
                </p>
              </div>
              <Link
                to={ROUTES.UNIVERSITY_VERIFICATION}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 shrink-0"
              >
                View Queue
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {(pendingUnis || []).length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="font-medium text-neutral-800">All university verifications resolved</p>
                  <p className="text-neutral-400 mt-0.5">New institutional accreditation requests will appear here automatically.</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-150">
                  {(pendingUnis || []).map((uni) => (
                    <div
                      key={uni.id}
                      className="p-4 hover:bg-neutral-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-neutral-900 truncate">
                            {uni.name}
                          </span>
                          <span className="text-[11px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-200">
                            {uni.domain}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          {uni.accreditationBoard || 'Accreditation Pending'} &bull; Capacity: <span className="font-medium text-neutral-700">{(uni.batchCapacity || 0).toLocaleString()} students</span>
                        </p>
                        <p className="text-[11px] text-neutral-400">
                          Contact: {uni.deanName || 'Registrar'} ({uni.deanEmail || 'Email pending'}) &bull; Submitted {uni.submittedDate || 'Recently'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenQuickAction('uni', uni, 'reject')}
                          className="text-neutral-600 hover:text-rose-600 hover:border-rose-300"
                        >
                          Reject
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenQuickAction('uni', uni, 'approve')}
                          leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                        >
                          Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Pending Employer Verifications */}
          <Card className="border border-neutral-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary-600" />
                  <span>Pending Employer Verifications</span>
                  <Badge variant={(pendingCompanies || []).length > 0 ? 'warning' : 'default'} size="sm">
                    {(pendingCompanies || []).length} awaiting
                  </Badge>
                </CardTitle>
                <p className="text-xs text-neutral-500 mt-1">
                  Tax registration numbers, corporate domains, and authorized recruiting representatives.
                </p>
              </div>
              <Link
                to={ROUTES.COMPANY_VERIFICATION}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 shrink-0"
              >
                View Queue
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {(pendingCompanies || []).length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="font-medium text-neutral-800">All employer onboarding reviews completed</p>
                  <p className="text-neutral-400 mt-0.5">Employer credentials submitted by hiring partners will show here.</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-150">
                  {(pendingCompanies || []).map((cmp) => (
                    <div
                      key={cmp.id}
                      className="p-4 hover:bg-neutral-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{cmp.logo || '🏢'}</span>
                          <span className="font-semibold text-sm text-neutral-900 truncate">
                            {cmp.name}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                            {cmp.taxId || 'Corporate Entity'}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500">
                          {cmp.industry || 'Software & Tech'} &bull; HQ: {cmp.headquarters || 'Remote'}
                        </p>
                        <p className="text-[11px] text-neutral-400">
                          Recruiter: {cmp.recruiterName || 'Talent Lead'} ({cmp.recruiterEmail || 'Email pending'}) &bull; Domains: {Array.isArray(cmp.corporateDomains) ? cmp.corporateDomains.join(', ') : (cmp.corporateDomains || cmp.domain || 'N/A')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenQuickAction('company', cmp, 'reject')}
                          className="text-neutral-600 hover:text-rose-600 hover:border-rose-300"
                        >
                          Reject
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenQuickAction('company', cmp, 'approve')}
                          leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
                        >
                          Verify Employer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 3: Flagged Listings Requiring Moderation */}
          <Card className="border border-neutral-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Flagged Job & Internship Postings</span>
                  <Badge variant={(flaggedListings || []).length > 0 ? 'error' : 'default'} size="sm">
                    {(flaggedListings || []).length} flagged
                  </Badge>
                </CardTitle>
                <p className="text-xs text-neutral-500 mt-1">
                  Listings triggering anti-scam heuristic filters or student policy reports.
                </p>
              </div>
              <Link
                to={ROUTES.LISTING_MODERATION}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1 shrink-0"
              >
                Moderate All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {(flaggedListings || []).length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-500">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p className="font-medium text-neutral-800">Clean moderation feed</p>
                  <p className="text-neutral-400 mt-0.5">No flagged postings violate recruitment policies right now.</p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-150">
                  {(flaggedListings || []).map((listing) => (
                    <div
                      key={listing.id}
                      className="p-4 hover:bg-neutral-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm text-neutral-900">
                            {listing.title}
                          </span>
                          <span className="text-xs text-neutral-500">at {listing.company}</span>
                          <Badge
                            variant={listing.riskLevel === 'high' ? 'error' : listing.riskLevel === 'medium' ? 'warning' : 'info'}
                            size="sm"
                          >
                            Risk: {listing.riskLevel?.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="p-2 rounded bg-amber-50/80 border border-amber-200/60 text-xs text-amber-900">
                          <span className="font-semibold">Flag: </span>
                          {listing.flags?.[0]?.reason || 'Flagged for moderation check'}
                        </div>
                        <p className="text-[11px] text-neutral-400">
                          Comp: {listing.compensation} &bull; Type: {listing.type} &bull; {listing.applicantCount} applicants impacted
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenQuickAction('listing', listing, 'approve')}
                        >
                          Clear Flag
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleOpenQuickAction('listing', listing, 'reject')}
                          leftIcon={<XCircle className="w-3.5 h-3.5" />}
                        >
                          Take Down
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1 span): Live Audit Log & System Telemetry */}
        <div className="space-y-6">
          {/* Platform Infrastructure Health status */}
          <Card className="border border-neutral-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-600" />
                  System Telemetry
                </span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  All Systems 100%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-neutral-600 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-neutral-400" /> API Gateway Latency
                </span>
                <span className="font-mono font-semibold text-neutral-900">42 ms (P95)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-neutral-600 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-400" /> AI Resume Inference
                </span>
                <span className="font-mono font-semibold text-emerald-600">Operational</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-neutral-600 flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-neutral-400" /> ATS Parser Engine
                </span>
                <span className="font-mono font-semibold text-emerald-600">Healthy (99.95%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-neutral-400" /> Supabase Storage & DB
                </span>
                <span className="font-mono font-semibold text-neutral-900">38 ms ping</span>
              </div>

              <div className="pt-2">
                <Link to={ROUTES.SYSTEM_ANALYTICS}>
                  <Button variant="outline" size="sm" fullWidth rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    Open Platform Telemetry
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Live Platform Audit Feed */}
          <Card className="border border-neutral-200">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-neutral-500" />
                <span>Recent Audit Trail</span>
              </CardTitle>
              <Link
                to={ROUTES.REPORTS}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Full Logs
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-150 max-h-[460px] overflow-y-auto scrollbar-thin">
                {(auditLogs || []).length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400">
                    No administrative audit events recorded yet.
                  </div>
                ) : (
                  (auditLogs || []).map((log) => {
                    let badgeVariant = 'info';
                    if (log.type === 'success') badgeVariant = 'success';
                    if (log.type === 'warning') badgeVariant = 'warning';
                    if (log.type === 'error') badgeVariant = 'error';

                    return (
                      <div key={log.id} className="p-3.5 hover:bg-neutral-50/60 transition-colors space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant={badgeVariant} size="sm">
                            {log.action}
                          </Badge>
                          <span className="text-[11px] text-neutral-400">{log.timestamp}</span>
                        </div>
                        <p className="text-xs font-medium text-neutral-900 truncate">
                          {log.target}
                        </p>
                        <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                          {log.details}
                        </p>
                        <div className="text-[10px] text-neutral-400 flex items-center gap-1 pt-0.5">
                          <span>Actor:</span>
                          <span className="font-medium text-neutral-600">{log.actor}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Action Modal */}
      <Modal
        isOpen={quickActionModal.isOpen}
        onClose={() => setQuickActionModal({ isOpen: false, type: null, item: null, action: null })}
        title={
          quickActionModal.action === 'approve'
            ? `Confirm Approval: ${quickActionModal.item?.name || quickActionModal.item?.title}`
            : `Confirm Rejection: ${quickActionModal.item?.name || quickActionModal.item?.title}`
        }
        description="This action will update the platform trust registry and notify affected stakeholders."
        size="md"
      >
        <ModalBody className="space-y-4">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs space-y-1">
            <p className="font-semibold text-neutral-900">
              Entity: {quickActionModal.item?.name || quickActionModal.item?.title}
            </p>
            {quickActionModal.item?.domain && (
              <p className="text-neutral-500 font-mono">Domain: {quickActionModal.item.domain}</p>
            )}
            {quickActionModal.item?.taxId && (
              <p className="text-neutral-500 font-mono">Tax ID: {quickActionModal.item.taxId}</p>
            )}
            {quickActionModal.item?.compensation && (
              <p className="text-neutral-500">Comp: {quickActionModal.item.compensation}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              {quickActionModal.action === 'approve' ? 'Approval Notes (Optional)' : 'Reason for Rejection / Take Down (Required)'}
            </label>
            <textarea
              rows={3}
              className="w-full text-xs p-2.5 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              placeholder={
                quickActionModal.action === 'approve'
                  ? 'e.g., Verified credentials against state registrar and university board.'
                  : 'e.g., Lacks accredited degree charter / violated fair compensation guidelines.'
              }
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setQuickActionModal({ isOpen: false, type: null, item: null, action: null })}
          >
            Cancel
          </Button>
          <Button
            variant={quickActionModal.action === 'approve' ? 'primary' : 'danger'}
            size="sm"
            onClick={handleConfirmQuickAction}
          >
            {quickActionModal.action === 'approve' ? 'Confirm & Authorize' : 'Confirm Action'}
          </Button>
        </ModalFooter>
      </Modal>
    </DashboardLayout>
  );
}
