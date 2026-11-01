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
  Select,
} from '../../../components/ui';
import { useUniversity, UniversityProvider } from '../context/UniversityContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  Building2,
  GraduationCap,
  Download,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowUpRight,
  PieChart,
} from 'lucide-react';

function PlacementAnalyticsContent() {
  const {
    kpis,
    analyticsTrends,
    salaryDistribution,
    departmentStats,
    companies,
  } = useUniversity();

  const [selectedCohort, setSelectedCohort] = useState('2025');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Top recruiters sorted by total hires
  const topRecruiters = [...companies]
    .sort((a, b) => (b.totalHires || 0) - (a.totalHires || 0))
    .slice(0, 6);

  const breadcrumbs = [
    { label: 'University', href: '/university' },
    { label: 'Placement Analytics' },
  ];

  const headerActions = (
    <div className="flex items-center gap-2.5">
      <div className="w-44">
        <Select
          value={selectedCohort}
          onChange={(e) => setSelectedCohort(e.target.value)}
          options={[
            { value: '2025', label: 'Class of 2025 (Graduating)' },
            { value: '2024', label: 'Class of 2024 (Completed)' },
            { value: '2023', label: 'Class of 2023 (Alumni)' },
          ]}
        />
      </div>

      <Button
        variant="primary"
        size="sm"
        leftIcon={<Download className="w-3.5 h-3.5" />}
        onClick={handleExport}
      >
        {downloadSuccess ? 'Downloaded!' : 'Export Insights'}
      </Button>
    </div>
  );

  return (
    <DashboardLayout
      title="Placement Analytics & Intelligence"
      subtitle="Comprehensive data insights on salary distributions, departmental hiring velocity, and corporate recruiting trends."
      breadcrumbs={breadcrumbs}
      actions={headerActions}
    >
      {/* Toast */}
      {downloadSuccess && (
        <div className="mb-6 p-3.5 bg-success-50 border border-success-200 text-success-800 rounded-lg flex items-center justify-between text-xs animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-success-600 shrink-0" />
            <span>Executive Placement Report for Cohort {selectedCohort} exported successfully.</span>
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-success-700">Ready</span>
        </div>
      )}

      {/* Top Level Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="hover:border-neutral-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Placement Rate</span>
              <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 tracking-tight">{kpis.placementRate}%</div>
            <div className="mt-1 flex items-center text-xs text-neutral-500">
              <span className="text-success-600 font-semibold inline-flex items-center mr-1">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +4.2% YoY
              </span>
              <span>vs Class of 2024</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-neutral-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Average Package</span>
              <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700 tracking-tight">{kpis.avgPackage}</div>
            <div className="mt-1 flex items-center text-xs text-neutral-500">
              <span className="text-neutral-700 font-medium mr-1">Median: ₹14.5 LPA</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-neutral-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Highest Package</span>
              <div className="w-7 h-7 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 tracking-tight">{kpis.highestPackage}</div>
            <div className="mt-1 text-xs text-neutral-500">
              Secured at <span className="font-semibold text-neutral-800">Google India</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:border-neutral-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Offers</span>
              <div className="w-7 h-7 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 tracking-tight">{kpis.totalOffers} Offers</div>
            <div className="mt-1 text-xs text-neutral-500">
              <span>32% multiple offer ratio</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 1: Department Placement Velocity + Salary Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Department Placement Comparison (2 cols) */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-neutral-900">
                    Departmental Placement Performance
                  </CardTitle>
                  <CardDescription className="text-xs text-neutral-500">
                    Verified placement percentage, placed students vs enrolled pool, and average compensation.
                  </CardDescription>
                </div>
                <Badge variant="info" size="sm">Cohort 2025</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              {departmentStats.map((dept) => (
                <div key={dept.department} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900">{dept.department}</span>
                      <span className="text-neutral-400">
                        ({dept.placed}/{dept.enrolled} placed)
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-emerald-700">Avg {dept.avgPackage}</span>
                      <span className="font-bold text-neutral-900 w-12 text-right">{dept.rate}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden flex">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${
                        dept.rate >= 90
                          ? 'bg-primary-600'
                          : dept.rate >= 80
                          ? 'bg-primary-500'
                          : 'bg-neutral-400'
                      }`}
                      style={{ width: `${dept.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Salary Distribution Breakdown (1 col) */}
        <div>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-neutral-900">
                CTC / Salary Distribution
              </CardTitle>
              <CardDescription className="text-xs text-neutral-500">
                Percentage of student cohort across compensation bands.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {salaryDistribution.map((item) => (
                <div key={item.range} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-neutral-800">{item.range}</span>
                    <span className="font-semibold text-neutral-900">
                      {item.count} offers ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: `${item.percentage * 2.5}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 mt-4 text-xs text-neutral-600">
                <span className="font-semibold text-neutral-900 block mb-0.5">Linear Tiering:</span>
                Offers above ₹20 LPA qualify for institutional Super Dream category exemptions.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Row 2: Top Recruiting Partners Leaderboard + 5-Year Historical Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Recruiting Companies Leaderboard */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-neutral-900">
                  Top Campus Recruiters Leaderboard
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  Organizations hiring the highest student volume from our campus.
                </CardDescription>
              </div>
              <Badge variant="default" size="sm">All Time</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Alumni Hired</TableHead>
                  <TableHead className="text-right">Average Package</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topRecruiters.map((comp, idx) => (
                  <TableRow key={comp.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-bold text-neutral-400 w-4">#{idx + 1}</span>
                        <div className="w-7 h-7 rounded border border-neutral-200 bg-white p-1 flex items-center justify-center shrink-0">
                          <img
                            src={comp.logo}
                            alt={comp.name}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=100&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <div className="font-semibold text-xs text-neutral-900">{comp.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] text-neutral-600 font-medium">
                        {comp.tier.split('/')[0]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-neutral-900">
                        {comp.totalHires} Students
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {comp.avgPackage}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 5-Year Historical Trends */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-neutral-900">
                  5-Year Institutional Placement Trends
                </CardTitle>
                <CardDescription className="text-xs text-neutral-500">
                  Evolution of institutional placement rate and average package from 2021 to 2025.
                </CardDescription>
              </div>
              <Badge variant="success" size="sm">5-Yr Growth</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div className="space-y-3">
              {analyticsTrends.map((trend) => (
                <div key={trend.year} className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/70">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900">Year {trend.year}</span>
                      {trend.year === '2025' && (
                        <span className="text-[10px] font-semibold text-primary-700 bg-primary-100 px-1.5 py-0.2 rounded">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span>Offers: <strong className="text-neutral-800">{trend.totalOffers}</strong></span>
                      <span>Avg CTC: <strong className="text-emerald-700">₹{trend.avgCtc} LPA</strong></span>
                      <span className="font-bold text-neutral-900">{trend.rate}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-200/80 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-primary-600 h-1.5 rounded-full"
                      style={{ width: `${trend.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-primary-50/50 rounded-lg border border-primary-100 text-xs text-primary-800 flex items-center justify-between">
              <span>Overall Average CTC Growth (2021 → 2025):</span>
              <strong className="text-sm font-bold text-primary-900">+111.9% (₹8.4L → ₹17.8L)</strong>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function PlacementAnalytics() {
  return (
    <UniversityProvider>
      <PlacementAnalyticsContent />
    </UniversityProvider>
  );
}
