// src/features/admin/pages/Reports.jsx
import React, { useState, useMemo } from 'react';
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
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  Tab,
} from '../../../components/ui';
import { ROUTES } from '../../../constants/routes';
import adminStorage from '../services/adminStorage';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Table as TableIcon,
  FileSpreadsheet,
  FileCheck,
  TrendingUp,
  Building2,
  GraduationCap,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

const REPORT_TYPES = [
  {
    id: 'placement_success',
    title: 'Placement Success Report',
    description: 'Campus placement drive volume, offers accepted, package distributions, and branch conversion benchmarks.',
    icon: TrendingUp,
    defaultFormat: 'CSV',
  },
  {
    id: 'drive_summary',
    title: 'Drive Participation Summary',
    description: 'Institutional drive registration counts, student shortlist ratios, interview attendance, and company participation.',
    icon: GraduationCap,
    defaultFormat: 'CSV',
  },
  {
    id: 'employer_hiring',
    title: 'Employer Hiring & Conversion Report',
    description: 'Corporate vacancy pipelines, candidate conversion funnels, offer acceptance rates, and average time-to-hire.',
    icon: Building2,
    defaultFormat: 'CSV',
  },
  {
    id: 'platform_audit',
    title: 'Platform Activity & Audit Log',
    description: 'Immutable administrative action logs, verification decisions, moderation events, and security audit records.',
    icon: Clock,
    defaultFormat: 'CSV',
  },
];

const DATE_RANGES = [
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last Quarter (90 Days)' },
  { value: 'ytd', label: 'Year to Date (2025-2026)' },
  { value: 'all', label: 'All-Time Historical' },
];

export default function Reports() {
  const [selectedReportId, setSelectedReportId] = useState('placement_success');
  const [dateRange, setDateRange] = useState('90d');
  const [exportFormat, setExportFormat] = useState('csv'); // 'csv' | 'pdf'
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [downloadHistory, setDownloadHistory] = useState([
    {
      id: 'rep-1',
      name: 'Placement_Success_Report_Q3_2026.csv',
      type: 'Placement Success Report',
      format: 'CSV',
      size: '142 KB',
      generatedAt: 'Today, 11:20 AM',
      generatedBy: 'Admin Supervisor',
    },
    {
      id: 'rep-2',
      name: 'Employer_Hiring_Funnel_YTD.csv',
      type: 'Employer Hiring Report',
      format: 'CSV',
      size: '98 KB',
      generatedAt: 'Yesterday, 16:45 PM',
      generatedBy: 'Admin Supervisor',
    },
    {
      id: 'rep-3',
      name: 'Platform_Audit_Log_October_2026.pdf',
      type: 'Platform Activity Log',
      format: 'PDF',
      size: '310 KB',
      generatedAt: 'Oct 28, 2026',
      generatedBy: 'Admin Supervisor',
    },
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Mock datasets for preview and generation
  const activeReport = useMemo(() => {
    return REPORT_TYPES.find((r) => r.id === selectedReportId) || REPORT_TYPES[0];
  }, [selectedReportId]);

  const reportData = useMemo(() => {
    switch (selectedReportId) {
      case 'placement_success':
        return {
          headers: [
            'Institution',
            'Academic Cohort',
            'Total Eligible',
            'Offers Extended',
            'Offers Accepted',
            'Placement Rate',
            'Avg Package (LPA / $k)',
            'Top Recruiter',
          ],
          rows: [
            ['Stanford University', '2026', '7,200', '6,840', '6,498', '90.2%', '$164,000', 'Stripe'],
            ['IIT Bombay', '2025-26', '4,800', '4,320', '4,104', '85.5%', '₹23.4 LPA', 'Google LLC'],
            ['National University of Singapore', '2026', '12,000', '11,160', '10,713', '89.3%', 'S$92,000', 'Microsoft'],
            ['BITS Pilani', '2025-26', '3,900', '3,393', '3,276', '84.0%', '₹19.8 LPA', 'Anthropic'],
            ['Technical Univ of Munich', '2026', '9,200', '8,096', '7,728', '84.0%', '€78,000', 'SAP SE'],
            ['UC Berkeley', '2026', '8,400', '7,644', '7,308', '87.0%', '$158,000', 'Apple Inc.'],
          ],
        };

      case 'drive_summary':
        return {
          headers: [
            'Campus Drive Campaign',
            'Host Institution',
            'Participating Firms',
            'Registrations',
            'Shortlisted',
            'Offers Released',
            'Attendance Rate',
          ],
          rows: [
            ['Global Tech Campus Blitz 2026', 'Multi-Campus', '48 Employers', '14,200', '3,840', '1,240', '96.4%'],
            ['Autumn Engineering Drive', 'IIT Bombay', '24 Employers', '3,450', '980', '412', '98.1%'],
            ['Silicon Valley University Exchange', 'Stanford University', '32 Employers', '5,120', '1,420', '580', '94.8%'],
            ['FinTech & Quant Fellowship Drive', 'NUS Singapore', '18 Employers', '4,100', '720', '290', '97.2%'],
            ['European Frontier Tech Fair', 'TUM Germany', '28 Employers', '6,300', '1,650', '620', '92.5%'],
          ],
        };

      case 'employer_hiring':
        return {
          headers: [
            'Employer Partner',
            'Industry',
            'Active Postings',
            'Total Applicants',
            'Interviewed',
            'Offers Extended',
            'Offer Accept %',
            'Avg Time-to-Offer',
          ],
          rows: [
            ['Stripe Technologies Inc.', 'Fintech & Infrastructure', '18', '2,420', '480', '142', '88.7%', '14 days'],
            ['Google LLC', 'Cloud & AI Systems', '34', '5,890', '910', '284', '91.2%', '21 days'],
            ['Anthropic PBC', 'AI Safety & Research', '8', '1,640', '240', '58', '86.2%', '12 days'],
            ['Microsoft Corporation', 'Enterprise Software', '42', '6,100', '1,120', '340', '89.4%', '18 days'],
            ['Citadel Securities', 'Quantitative Finance', '6', '1,890', '180', '38', '94.7%', '10 days'],
          ],
        };

      case 'platform_audit': {
        const auditLogs = adminStorage.getAuditLogs();
        return {
          headers: ['Timestamp', 'Action Event', 'Target Entity', 'Actor', 'Audit Outcome', 'Details'],
          rows: auditLogs.slice(0, 10).map((log) => [
            log.timestamp,
            log.action,
            log.target,
            log.actor,
            log.type?.toUpperCase() || 'INFO',
            log.details,
          ]),
        };
      }

      default:
        return { headers: [], rows: [] };
    }
  }, [selectedReportId]);

  // Generate & Download Trigger (CSV / Text / PDF simulation)
  const handleDownloadReport = (format = exportFormat) => {
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);

      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${activeReport.title.replace(/\s+/g, '_')}_${timestamp}.${format}`;

      let content = '';
      let mimeType = 'text/plain';

      if (format === 'csv') {
        mimeType = 'text/csv;charset=utf-8;';
        const csvHeader = reportData.headers.map((h) => `"${h}"`).join(',');
        const csvRows = reportData.rows
          .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
          .join('\n');
        content = `${csvHeader}\n${csvRows}`;
      } else {
        // PDF / formatted text summary
        mimeType = 'application/pdf;charset=utf-8;';
        content = `%PDF-1.4\n% INSIGHTRESUME PLATFORM REPORT: ${activeReport.title}\nDate: ${new Date().toLocaleString()}\n` +
          `Generated By: Admin Supervisor\n\n` +
          reportData.headers.join(' | ') + '\n' +
          '='.repeat(80) + '\n' +
          reportData.rows.map((r) => r.join(' | ')).join('\n');
      }

      // Create Blob & download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Record in history
      const newEntry = {
        id: `rep-${Date.now()}`,
        name: filename,
        type: activeReport.title,
        format: format.toUpperCase(),
        size: format === 'csv' ? `${(content.length / 1024).toFixed(1)} KB` : '245 KB',
        generatedAt: 'Just now',
        generatedBy: 'Admin Supervisor',
      };
      setDownloadHistory([newEntry, ...downloadHistory]);

      // Record in platform audit log
      adminStorage.addAuditLog({
        action: 'Report Generated & Exported',
        target: filename,
        type: 'info',
        details: `Platform report exported in ${format.toUpperCase()} format with timeframe ${dateRange}.`,
      });

      showToast(`Exported "${filename}" successfully.`);
    }, 600);
  };

  return (
    <DashboardLayout
      title="Platform Reports & Data Export"
      subtitle="Generate, preview, and export high-fidelity institutional, recruiter, and compliance reports."
      breadcrumbs={[{ label: 'Platform Admin', href: ROUTES.ADMIN_DASHBOARD }, { label: 'Reports' }]}
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDownloadReport('csv')}
            isLoading={isGenerating}
            leftIcon={<FileSpreadsheet className="w-4 h-4 text-emerald-600" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleDownloadReport('pdf')}
            isLoading={isGenerating}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export PDF
          </Button>
        </div>
      }
    >
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg bg-neutral-900 text-white text-xs font-medium shadow-xl border border-neutral-800 animate-slide-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {REPORT_TYPES.map((rep) => {
          const Icon = rep.icon;
          const isSelected = selectedReportId === rep.id;

          return (
            <Card
              key={rep.id}
              onClick={() => setSelectedReportId(rep.id)}
              className={`p-4 cursor-pointer transition-all border ${
                isSelected
                  ? 'border-primary-600 bg-primary-50/20 ring-2 ring-primary-500/20'
                  : 'border-neutral-200/90 hover:border-neutral-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    isSelected
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-xs font-bold text-neutral-900 leading-snug">
                    {rep.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                    {rep.description}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Generator Configuration Bar */}
      <Card className="p-4 mb-6 border border-neutral-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Filter className="w-4 h-4 text-neutral-400" />
            <div>
              <p className="text-xs font-semibold text-neutral-900">
                Configuring: {activeReport.title}
              </p>
              <p className="text-[11px] text-neutral-400">
                Filtered real-time data preview based on active telemetry store.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="w-full sm:w-44">
              <Select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                options={DATE_RANGES}
              />
            </div>

            <div className="w-full sm:w-36">
              <Select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                options={[
                  { value: 'csv', label: 'CSV Export' },
                  { value: 'pdf', label: 'PDF Export' },
                ]}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast('Report dataset refreshed from latest database logs.')}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh Preview
            </Button>
          </div>
        </div>
      </Card>

      {/* Live Preview Table */}
      <Card className="border border-neutral-200 mb-8 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-3 bg-neutral-50/50">
          <div>
            <CardTitle className="text-sm flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-primary-600" />
              <span>Live Dataset Preview ({reportData.rows.length} records)</span>
            </CardTitle>
            <p className="text-xs text-neutral-500 mt-0.5">
              Timeframe: <span className="font-semibold text-neutral-700">{DATE_RANGES.find((d) => d.value === dateRange)?.label}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownloadReport('csv')}
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Download CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                {reportData.headers.map((h, i) => (
                  <TableHead key={i} className="whitespace-nowrap">
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.rows.map((row, rIdx) => (
                <TableRow key={rIdx}>
                  {row.map((cell, cIdx) => (
                    <TableCell
                      key={cIdx}
                      className={`text-xs ${
                        cIdx === 0 ? 'font-semibold text-neutral-900' : 'text-neutral-600'
                      }`}
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Export History */}
      <Card className="border border-neutral-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-neutral-500" />
            <span>Recent Platform Report Exports</span>
          </CardTitle>
          <p className="text-xs text-neutral-500">
            Audit history of generated files and download packages.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Report Type</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Generated When</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloadHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-xs font-mono font-semibold text-neutral-900">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-600">
                    {item.type}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.format === 'CSV' ? 'success' : 'info'} size="sm">
                      {item.format}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-neutral-500 font-mono">
                    {item.size}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-500">
                    {item.generatedAt}
                  </TableCell>
                  <TableCell className="text-xs text-neutral-700">
                    {item.generatedBy}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleDownloadReport(item.format.toLowerCase());
                      }}
                      className="!h-8 !px-2.5 text-xs text-primary-600 hover:text-primary-700"
                      leftIcon={<Download className="w-3.5 h-3.5" />}
                    >
                      Re-download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
