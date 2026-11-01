import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Badge, Tabs, Tab } from '../../../components/ui';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  FileText,
  Award,
  BarChart3,
  Building2,
  Users,
  GraduationCap,
  ShieldCheck,
  Search,
  Sliders,
  Zap,
  Code2,
  Check,
  Minus,
} from 'lucide-react';

export default function FeaturesPage() {
  const [activeTab, setActiveTab] = useState('students');

  const detailedFeatures = [
    {
      badge: 'Resume Intelligence',
      title: 'Google XYZ Bullet Generator',
      desc: 'Transforms passive duty listings ("Handled front-end tasks") into executive-grade achievements with quantified metrics ("Engineered 14 responsive UI modules in React/Tailwind, cutting user drop-off by 26%").',
      highlights: [
        'Context-aware active verb suggestions',
        'Automatic terminology alignment for 120+ roles',
        'Measurable metric injection hints',
        'Real-time grammar and conciseness tuning',
      ],
      icon: <Sparkles className="w-5 h-5 text-primary-600" />,
    },
    {
      badge: 'ATS Architecture',
      title: 'Deterministic Multi-ATS Audit Engine',
      desc: 'Simulates parsing behavior across Workday, Taleo, Greenhouse, and Lever. Tests document typography, margin spacing, section headers, and semantic token extraction.',
      highlights: [
        'Deterministic numerical score out of 100',
        'Missing keyword and taxonomy radar',
        'Section-by-section pass/fail status',
        '100% single-column PDF export compliance',
      ],
      icon: <BarChart3 className="w-5 h-5 text-primary-600" />,
    },
    {
      badge: 'Credentialing',
      title: 'Proctored Skill Verification Quizzes',
      desc: 'Lets candidates back up claims with empirical evidence. 10-minute adaptive evaluations in languages like Python, Java, React, SQL, and core CS fundamentals.',
      highlights: [
        'Anti-cheat and tab-switch telemetry',
        'Cryptographic verification badge generated',
        'Direct recruiter score stamp on resume exports',
        'Detailed domain percentile reporting',
      ],
      icon: <Award className="w-5 h-5 text-primary-600" />,
    },
    {
      badge: 'Campus Automation',
      title: 'Placement Drive Coordination Engine',
      desc: 'Empowers universities to automate corporate recruitment drives. Configure cutoff thresholds for CGPA, active backlogs, and branches; students are instantly filtered.',
      highlights: [
        'CSV batch onboarding for thousands of students',
        'Locked profile state before drive cutoffs',
        'Round-by-round candidate status tracking',
        'Comprehensive NIRF & institutional reporting',
      ],
      icon: <Building2 className="w-5 h-5 text-primary-600" />,
    },
    {
      badge: 'Document Rendering',
      title: 'Vector Multi-Template Layouts',
      desc: 'Four standard layout engines (Harvard Academic, Modern Tech, Minimalist Executive, Dual Compact) rendered with zero-bleed vector PDF output.',
      highlights: [
        'Dynamic margin and font-size scaling',
        'One-click layout swapping with zero data loss',
        'Print-optimized and web-responsive rendering',
        'Strict zero-table ASCII compliance for parsers',
      ],
      icon: <FileText className="w-5 h-5 text-primary-600" />,
    },
    {
      badge: 'Recruiter Discovery',
      title: 'High-Signal Candidate Sourcing',
      desc: 'Recruiters search pre-screened talent across universities by verified quiz scores, degree, graduation year, and GPA without sifting through spam applications.',
      highlights: [
        'Standardized, uniform candidate presentation',
        'Single-click interview shortlisting',
        'Direct university drive participation',
        'Batch export of verified candidate rosters',
      ],
      icon: <Users className="w-5 h-5 text-primary-600" />,
    },
  ];

  const comparisonRows = [
    {
      feature: 'Deterministic ATS Score Engine',
      insight: true,
      generic: 'Basic word count',
      spreadsheets: false,
    },
    {
      feature: 'Google XYZ Bullet Optimization',
      insight: true,
      generic: 'Generic AI text',
      spreadsheets: false,
    },
    {
      feature: 'Verified Proctored Skill Quizzes',
      insight: true,
      generic: false,
      spreadsheets: false,
    },
    {
      feature: 'University Placement Batch Management',
      insight: true,
      generic: false,
      spreadsheets: 'Manual chaos',
    },
    {
      feature: 'Automated Cutoff Enforcement (CGPA/Backlogs)',
      insight: true,
      generic: false,
      spreadsheets: 'Prone to human error',
    },
    {
      feature: 'Zero Public LLM Training on Resumes',
      insight: true,
      generic: 'Often sold/trained',
      spreadsheets: 'Unsecured',
    },
    {
      feature: '1-Click Direct Placement Applications',
      insight: true,
      generic: false,
      spreadsheets: false,
    },
  ];

  return (
    <div className="bg-white text-neutral-900">
      {/* ─────────────────────────────────────────────────────────────
          Hero Section
          ───────────────────────────────────────────────────────────── */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-200 bg-neutral-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="info" size="sm" className="mb-4">
            Platform Capabilities
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Engineered for hiring precision and placement velocity.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Discover the full technical feature set powering our resume intelligence engine, campus placement workflow, and recruiter talent pipeline.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link to={ROUTES.AI_RESUME_BUILDER}>
              <Button size="md" rightIcon={<ArrowRight size={15} />}>
                Launch AI Builder
              </Button>
            </Link>
            <Link to={ROUTES.ATS_CHECKER}>
              <Button variant="outline" size="md">
                Try ATS Checker
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Audience Lens Tabs
          ───────────────────────────────────────────────────────────── */}
      <section className="py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-10">
            <Tabs value={activeTab} onChange={setActiveTab}>
              <Tab value="students" icon={<GraduationCap size={16} />}>
                For Job Seekers
              </Tab>
              <Tab value="universities" icon={<Building2 size={16} />}>
                For Placement Cells
              </Tab>
              <Tab value="recruiters" icon={<Users size={16} />}>
                For Hiring Teams
              </Tab>
            </Tabs>
          </div>

          {/* Dynamic Lens Content */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 sm:p-8">
            {activeTab === 'students' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-lg border border-neutral-200">
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">Instant ATS Optimization</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Check formatting against Fortune 500 ATS systems and get actionable phrasing enhancements in seconds.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-neutral-200">
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">Skill Verification Badges</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Prove your engineering or analytical capabilities with proctored assessments stamped on your resume.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-neutral-200">
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">Campus Placement Access</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Apply directly to on-campus company drives with pre-verified student credentials and zero paperwork.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'universities' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-lg border border-neutral-200">
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">Batch Roster Management</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Import entire graduating cohorts via CSV with automated CGPA, branch, and backlog indexing.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-neutral-200">
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">Automated Drive Filters</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Set company-specific criteria. The platform automatically gates eligible students and prevents duplicate applications.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-neutral-200">
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">Institutional Analytics</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Generate NIRF and accreditation placement reports, median salary trends, and recruiter participation charts.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'recruiters' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 rounded-lg border border-neutral-200">
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">Pre-Screened Talent Pool</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Filter by verified assessment scores and university standing. Review standardized, noise-free profiles.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-neutral-200">
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">Multi-Campus Drives</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Conduct recruitment drives across multiple partner institutions concurrently through a unified portal.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg border border-neutral-200">
                  <h4 className="font-bold text-sm text-neutral-900 mb-1">Direct Pipeline Management</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Manage applicant stages from shortlisted to offer release with team notes and automated status emails.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Deep Dive 6 Features
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Technical Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              Deep dive into our core systems.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Every feature is built for performance, accuracy, and operational reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detailedFeatures.map((f, idx) => (
              <Card key={idx} className="p-6 flex flex-col justify-between hover:border-neutral-300 transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center">
                      {f.icon}
                    </div>
                    <Badge variant="default" size="sm">{f.badge}</Badge>
                  </div>
                  <h3 className="font-bold text-base text-neutral-900">{f.title}</h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{f.desc}</p>

                  <div className="mt-5 pt-4 border-t border-neutral-100 space-y-2">
                    {f.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                        <CheckCircle2 size={13} className="text-success-600 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Comparison Table
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Objective Comparison
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              How InsightResume compares.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              See why leading placement departments and candidates choose our integrated platform.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-100/70">
                    <th className="p-4 font-semibold text-neutral-700">Feature</th>
                    <th className="p-4 font-bold text-primary-700 bg-primary-50/50">InsightResume</th>
                    <th className="p-4 font-semibold text-neutral-600">Generic Resume Builders</th>
                    <th className="p-4 font-semibold text-neutral-600">Placement Spreadsheets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-150">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4 font-medium text-neutral-900">{row.feature}</td>
                      <td className="p-4 bg-primary-50/30 font-semibold text-primary-900">
                        {row.insight === true ? (
                          <span className="inline-flex items-center gap-1.5 text-success-700">
                            <Check size={14} className="stroke-[3]" /> Included
                          </span>
                        ) : (
                          row.insight
                        )}
                      </td>
                      <td className="p-4 text-neutral-600">
                        {row.generic === false ? (
                          <span className="inline-flex items-center gap-1 text-neutral-400">
                            <Minus size={14} /> None
                          </span>
                        ) : (
                          row.generic
                        )}
                      </td>
                      <td className="p-4 text-neutral-600">
                        {row.spreadsheets === false ? (
                          <span className="inline-flex items-center gap-1 text-neutral-400">
                            <Minus size={14} /> None
                          </span>
                        ) : (
                          row.spreadsheets
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CTA Section
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            Experience the platform in action.
          </h2>
          <p className="mt-3 text-sm text-neutral-600 max-w-xl mx-auto">
            Build your ATS-optimized resume in under 5 minutes or schedule a consultation for your institution.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to={ROUTES.REGISTER}>
              <Button size="md" rightIcon={<ArrowRight size={15} />}>
                Start Building Free
              </Button>
            </Link>
            <Link to={ROUTES.UNIVERSITY_SOLUTIONS}>
              <Button variant="outline" size="md">
                University Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
