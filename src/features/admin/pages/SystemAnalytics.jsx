// src/features/admin/pages/SystemAnalytics.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Select,
} from '../../../components/ui';
import { ROUTES } from '../../../constants/routes';
import AdminStatCard from '../components/AdminStatCard';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Award,
  Users,
  GraduationCap,
  Building2,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

const MONTHLY_SIGNUPS = [
  { month: 'Nov', students: 1200, unis: 8, companies: 24 },
  { month: 'Dec', students: 1450, unis: 12, companies: 30 },
  { month: 'Jan', students: 2100, unis: 15, companies: 45 },
  { month: 'Feb', students: 2400, unis: 18, companies: 52 },
  { month: 'Mar', students: 2850, unis: 22, companies: 60 },
  { month: 'Apr', students: 2600, unis: 14, companies: 48 },
  { month: 'May', students: 2300, unis: 10, companies: 38 },
  { month: 'Jun', students: 1900, unis: 6, companies: 28 },
  { month: 'Jul', students: 2100, unis: 9, companies: 34 },
  { month: 'Aug', students: 3400, unis: 28, companies: 82 },
  { month: 'Sep', students: 4200, unis: 34, companies: 96 },
  { month: 'Oct', students: 4850, unis: 42, companies: 114 },
];

const AI_GENERATIONS_MONTHLY = [
  { month: 'Nov', count: 8200 },
  { month: 'Dec', count: 9800 },
  { month: 'Jan', count: 14200 },
  { month: 'Feb', count: 16800 },
  { month: 'Mar', count: 19400 },
  { month: 'Apr', count: 18100 },
  { month: 'May', count: 15900 },
  { month: 'Jun', count: 13400 },
  { month: 'Jul', count: 14800 },
  { month: 'Aug', count: 24100 },
  { month: 'Sep', count: 31200 },
  { month: 'Oct', count: 38450 },
];

const ATS_DISTRIBUTION = [
  { range: '0 - 40', label: 'Needs Improvement', percentage: 6, count: '1,490', color: '#f43f5e' },
  { range: '41 - 60', label: 'Average Match', percentage: 18, count: '4,470', color: '#f59e0b' },
  { range: '61 - 75', label: 'Strong Baseline', percentage: 38, count: '9,440', color: '#3b82f6' },
  { range: '76 - 85', label: 'Optimal Match', percentage: 26, count: '6,460', color: '#10b981' },
  { range: '86 - 100', label: 'Exceptional (Top 12%)', percentage: 12, count: '2,980', color: '#8b5cf6' },
];

const TOP_UNIVERSITIES = [
  { name: 'Stanford University', country: 'USA', drives: 42, placed: '94.2%', avgPkg: '$164k' },
  { name: 'Indian Institute of Technology, Bombay', country: 'India', drives: 68, placed: '89.5%', avgPkg: '₹23.4L' },
  { name: 'National University of Singapore', country: 'Singapore', drives: 54, placed: '91.8%', avgPkg: 'S$92k' },
  { name: 'University of California, Berkeley', country: 'USA', drives: 48, placed: '90.1%', avgPkg: '$158k' },
  { name: 'BITS Pilani', country: 'India', drives: 52, placed: '86.4%', avgPkg: '₹19.8L' },
  { name: 'Technical University of Munich', country: 'Germany', drives: 38, placed: '87.0%', avgPkg: '€78k' },
];

export default function SystemAnalytics() {
  const [timeframe, setTimeframe] = useState('1y');
  const [hoveredSignup, setHoveredSignup] = useState(null);
  const [hoveredGeneration, setHoveredGeneration] = useState(null);

  // Maximum value for scaling the signup chart
  const maxSignup = Math.max(...MONTHLY_SIGNUPS.map((d) => d.students));
  const maxGenerations = Math.max(...AI_GENERATIONS_MONTHLY.map((d) => d.count));

  return (
    <DashboardLayout
      title="System Analytics & Benchmark Intelligence"
      subtitle="Deep-dive telemetry across user onboarding, AI resume inference, ATS score distributions, and campus drive success rates."
      breadcrumbs={[{ label: 'Platform Admin', href: ROUTES.ADMIN_DASHBOARD }, { label: 'System Analytics' }]}
      actions={
        <div className="flex items-center gap-3">
          <div className="w-40">
            <Select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              options={[
                { value: '30d', label: 'Past 30 Days' },
                { value: '90d', label: 'Past 90 Days' },
                { value: '1y', label: 'Past 12 Months' },
                { value: 'all', label: 'All Time' },
              ]}
            />
          </div>
        </div>
      }
    >
      {/* High-level Telemetry KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminStatCard
          title="Monthly User Signups"
          value="4,850"
          trend="+18.4% vs Sep"
          trendType="positive"
          icon={Users}
          subvalue="Current October velocity"
          badgeText="Student: 84% | Recruiter: 16%"
        />

        <AdminStatCard
          title="AI Resume Generations"
          value="38,450"
          trend="99.4% Success"
          trendType="positive"
          icon={Sparkles}
          subvalue="3.2M tokens consumed"
          badgeText="Avg inference latency: 1.4s"
        />

        <AdminStatCard
          title="Median ATS Benchmark Score"
          value="78.4 / 100"
          trend="+4.2 pts"
          trendType="positive"
          icon={Award}
          subvalue="Targeting top tier ATS parsers"
          badgeText="Evaluated over 24.8k resumes"
        />

        <AdminStatCard
          title="Campus Drive Placement Rate"
          value="88.6%"
          trend="84.2% Offer Accept"
          trendType="live"
          icon={GraduationCap}
          subvalue="Across 142 partner universities"
          badgeText="18,920 total offers verified"
        />
      </div>

      {/* Row 1: Charts (Signups & AI Generations) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Chart 1: Monthly Signups */}
        <Card className="border border-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" />
                <span>Monthly User Growth</span>
              </CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">
                New students, university admins, and employer accounts created per month.
              </p>
            </div>
            {hoveredSignup && (
              <Badge variant="info" size="sm">
                {hoveredSignup.month}: {hoveredSignup.students.toLocaleString()} students ({hoveredSignup.companies} recruiters)
              </Badge>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-1 border-b border-neutral-150">
              {MONTHLY_SIGNUPS.map((item, idx) => {
                const heightPercent = Math.max(12, Math.round((item.students / maxSignup) * 100));
                const isHovered = hoveredSignup?.month === item.month;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer"
                    onMouseEnter={() => setHoveredSignup(item)}
                    onMouseLeave={() => setHoveredSignup(null)}
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute -top-10 z-10 px-2 py-1 rounded bg-neutral-900 text-white text-[10px] font-semibold whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {item.students.toLocaleString()} students
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[28px] h-full flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all duration-200 ${
                          isHovered
                            ? 'bg-primary-600 ring-2 ring-primary-300'
                            : 'bg-primary-500/80 group-hover:bg-primary-600'
                        }`}
                      />
                    </div>
                    {/* Month Label */}
                    <span className="text-[10px] font-semibold text-neutral-500 mt-1 select-none">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-primary-600" />
                Active Student Registrations
              </span>
              <span className="font-semibold text-neutral-800">
                Peak: 4,850 in October
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: AI Resume Generations */}
        <Card className="border border-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>AI Resume Generations</span>
              </CardTitle>
              <p className="text-xs text-neutral-500 mt-0.5">
                Monthly AI-assisted resume drafts generated and intelligence scoring runs.
              </p>
            </div>
            {hoveredGeneration && (
              <Badge variant="default" size="sm" className="bg-purple-50 text-purple-700 border-purple-200">
                {hoveredGeneration.month}: {hoveredGeneration.count.toLocaleString()} runs
              </Badge>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 flex items-end gap-2 sm:gap-3 pt-6 pb-2 px-1 border-b border-neutral-150">
              {AI_GENERATIONS_MONTHLY.map((item, idx) => {
                const heightPercent = Math.max(12, Math.round((item.count / maxGenerations) * 100));
                const isHovered = hoveredGeneration?.month === item.month;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-1 group relative cursor-pointer"
                    onMouseEnter={() => setHoveredGeneration(item)}
                    onMouseLeave={() => setHoveredGeneration(null)}
                  >
                    {/* Tooltip */}
                    <div
                      className={`absolute -top-10 z-10 px-2 py-1 rounded bg-neutral-900 text-white text-[10px] font-semibold whitespace-nowrap shadow-md pointer-events-none transition-opacity ${
                        isHovered ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {item.count.toLocaleString()} resumes
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[28px] h-full flex items-end">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all duration-200 ${
                          isHovered
                            ? 'bg-purple-600 ring-2 ring-purple-300'
                            : 'bg-purple-500/80 group-hover:bg-purple-600'
                        }`}
                      />
                    </div>
                    {/* Month Label */}
                    <span className="text-[10px] font-semibold text-neutral-500 mt-1 select-none">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-3 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-purple-600" />
                Prompt Inference Runs
              </span>
              <span className="font-semibold text-neutral-800">
                38,450 runs in October (+23%)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: ATS Score Distribution & University Drive Success Rates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* ATS Score Distribution Curve */}
        <Card className="border border-neutral-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                ATS Score Distribution Curve
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Median: 78.4 / 100
              </span>
            </CardTitle>
            <p className="text-xs text-neutral-500">
              Histogram of applicant resume ATS compatibility ratings across candidate submissions.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {ATS_DISTRIBUTION.map((bracket, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-neutral-900 w-16">
                      {bracket.range}
                    </span>
                    <span className="text-neutral-500">{bracket.label}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-neutral-400">{bracket.count} resumes</span>
                    <span className="font-semibold text-neutral-800 w-10 text-right">
                      {bracket.percentage}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-3 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    style={{
                      width: `${bracket.percentage * 2}%`,
                      backgroundColor: bracket.color,
                    }}
                    className="h-full rounded-full transition-all duration-500"
                  />
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-neutral-100 text-xs text-neutral-500 flex items-center justify-between">
              <span>76% of student resumes score above the 60-point threshold.</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" /> High industry pass-rate
              </span>
            </div>
          </CardContent>
        </Card>

        {/* University Drive Success Rates */}
        <Card className="border border-neutral-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary-600" />
                Top Institutional Drive Success Rates
              </span>
              <Badge variant="info" size="sm">
                Top 6 Campuses
              </Badge>
            </CardTitle>
            <p className="text-xs text-neutral-500">
              Campus placement campaigns ranked by offer acceptance conversion and median package.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="divide-y divide-neutral-150">
              {TOP_UNIVERSITIES.map((uni, idx) => (
                <div
                  key={idx}
                  className="py-2.5 flex items-center justify-between text-xs hover:bg-neutral-50/60 px-2 rounded-md transition-colors"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <p className="font-semibold text-neutral-900 truncate">
                      {idx + 1}. {uni.name}
                    </p>
                    <p className="text-[11px] text-neutral-400">
                      {uni.country} &bull; {uni.drives} completed drives
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <div>
                      <p className="font-semibold text-emerald-600 font-mono">
                        {uni.placed}
                      </p>
                      <p className="text-[10px] text-neutral-400">Placement %</p>
                    </div>

                    <div className="min-w-[65px]">
                      <p className="font-semibold text-neutral-900 font-mono">
                        {uni.avgPkg}
                      </p>
                      <p className="text-[10px] text-neutral-400">Avg Package</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>Overall institutional drive completion: <strong>94.6%</strong></span>
              <span className="font-mono text-neutral-700">Cycle: 2025-2026</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Platform Telemetry Infrastructure Card */}
      <Card className="border border-neutral-200 p-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
          Edge Telemetry & Processing Efficiency
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-neutral-500">Average ATS Scoring Latency</span>
            <p className="text-lg font-bold font-mono text-neutral-900">420 ms</p>
            <span className="text-[11px] text-emerald-600 font-semibold">-40ms optimization</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-neutral-500">AI Prompt Accuracy</span>
            <p className="text-lg font-bold font-mono text-neutral-900">98.6%</p>
            <span className="text-[11px] text-emerald-600 font-semibold">&lt;0.2% hallucination</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-neutral-500">Offer Acceptance Rate</span>
            <p className="text-lg font-bold font-mono text-neutral-900">84.2%</p>
            <span className="text-[11px] text-emerald-600 font-semibold">+3.8% MoM</span>
          </div>

          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-neutral-500">Verified Credentials Issued</span>
            <p className="text-lg font-bold font-mono text-neutral-900">42,610</p>
            <span className="text-[11px] text-emerald-600 font-semibold">100% valid SHA-256</span>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
