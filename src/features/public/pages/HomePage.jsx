import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Badge } from '../../../components/ui';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  FileText,
  Search,
  Sliders,
  ChevronDown,
  ChevronUp,
  Cpu,
  BarChart3,
  Award,
  Zap,
  Lock,
  ExternalLink,
} from 'lucide-react';

export default function HomePage() {
  // Interactive Hero Preview state
  const [activeRole, setActiveRole] = useState('swe');
  const [isOptimized, setIsOptimized] = useState(true);

  // Workflow breakdown state
  const [activeStep, setActiveStep] = useState(0);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const sampleRoles = {
    swe: {
      name: 'Frontend Engineer',
      before: {
        score: 62,
        bullet: 'Worked on React web application and made the dashboard pages load faster.',
        keywords: ['JavaScript', 'HTML/CSS'],
        issues: ['Missing quantifiable impact', 'Weak passive verbs', 'Low technical keyword density'],
      },
      after: {
        score: 96,
        bullet: 'Engineered high-throughput React dashboard handling 180k daily active users; cut p95 load latency by 43% through code-splitting and Redis query caching.',
        keywords: ['React', 'TypeScript', 'Redis', 'Vite', 'REST APIs', 'Performance Tuning'],
        issues: ['Zero formatting errors detected', 'Meets Fortune 500 ATS parser threshold'],
      },
    },
    backend: {
      name: 'Backend Systems Architect',
      before: {
        score: 58,
        bullet: 'Created database schemas and microservices for user transactions in Python.',
        keywords: ['Python', 'SQL'],
        issues: ['Vague scope of responsibility', 'Unquantified transaction scale'],
      },
      after: {
        score: 95,
        bullet: 'Architected distributed Python/FastAPI microservices processing $4.2M monthly transaction volume with 99.99% uptime across AWS ECS clusters.',
        keywords: ['FastAPI', 'PostgreSQL', 'Docker', 'AWS ECS', 'Kafka', 'CI/CD'],
        issues: ['XYZ impact formula satisfied', '100% Workday/Taleo compliance score'],
      },
    },
    pm: {
      name: 'Product Manager',
      before: {
        score: 64,
        bullet: 'Helped engineering team build features and communicated with stakeholders.',
        keywords: ['Agile', 'Roadmapping'],
        issues: ['No commercial metric linkage', 'Missing methodology terminology'],
      },
      after: {
        score: 94,
        bullet: 'Spearheaded end-to-end launch of enterprise B2B self-serve portal, increasing Q3 trial-to-paid conversion by 28% and generating $620k in ARR.',
        keywords: ['Product Strategy', 'B2B SaaS', 'A/B Testing', 'Product Analytics', 'SQL'],
        issues: ['Executive quantification verified', 'Keyword coverage: 98%'],
      },
    },
  };

  const currentSample = sampleRoles[activeRole];
  const activeContent = isOptimized ? currentSample.after : currentSample.before;

  const workflowSteps = [
    {
      title: '1. Ingest & Parse Draft',
      desc: 'Upload an existing PDF or input career milestones through guided prompts. Our deterministic parser extracts structure, timelines, and technical skill taxonomy.',
      tag: 'Step 01',
      badge: 'Zero OCR Glitches',
    },
    {
      title: '2. AI Metric Quantification',
      desc: 'Our role-specialized copilot rewrites passive responsibilities into high-impact Google XYZ-format achievements ("Accomplished [X] measured by [Y] by doing [Z]").',
      tag: 'Step 02',
      badge: 'Context-Aware AI',
    },
    {
      title: '3. ATS Multi-Parser Audit',
      desc: 'Your resume is simulated through Workday, Taleo, Greenhouse, and Lever parsing heuristics to verify 100% column parseability and keyword density.',
      tag: 'Step 03',
      badge: '94+ Target Score',
    },
    {
      title: '4. Direct Drive Matching',
      desc: 'One-click application to campus placement drives and enterprise listings with cryptographically verified technical skill badges attached.',
      tag: 'Step 04',
      badge: 'Instant Application',
    },
  ];

  const faqs = [
    {
      q: 'How does InsightResume guarantee ATS compatibility?',
      a: 'Unlike generic visual builders that inject complex columns, SVG shapes, and non-standard Unicode fonts, InsightResume outputs semantic HTML-to-PDF structures engineered specifically to parse cleanly across major enterprise ATS solutions including Workday, Taleo, Greenhouse, and Lever.',
    },
    {
      q: 'Is my resume data used to train public AI models?',
      a: 'Never. We uphold enterprise-grade zero-retention data privacy. Your personal information, academic transcripts, and professional histories remain strictly yours and are never sold or contributed to public machine learning weights.',
    },
    {
      q: 'How does the platform integrate with university placement cells?',
      a: 'Universities receive a dedicated administrative dashboard. Placement officers can bulk onboard students via CSV, enforce academic eligibility cutoffs (CGPA, active backlogs, department gates), invite visiting companies, and monitor campus drive outcomes in real-time.',
    },
    {
      q: 'What are skill verification quizzes?',
      a: 'Students can optionally complete proctored 10-minute adaptive quizzes for programming languages and business disciplines. Earning 80%+ awards a verified digital badge embedded directly into your resume that recruiters can validate.',
    },
    {
      q: 'Can recruiters directly search for qualified talent?',
      a: 'Yes. Employers have access to an enterprise candidate discovery engine where they can filter candidates by verified skills, degree level, graduation year, and academic standing without sifting through spam submissions.',
    },
  ];

  return (
    <div className="bg-white text-neutral-900">
      {/* ─────────────────────────────────────────────────────────────
          Hero Section with Interactive ATS Widget
          ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Badge & Header */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-700 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
              <span>InsightResume Platform 2.4</span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-500">Enterprise AI Recruitment & Placement</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-900 leading-[1.12]">
              The unified career intelligence & campus placement platform.
            </h1>

            <p className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto font-normal">
              Build Fortune-500 ATS-verified resumes in minutes, validate technical competencies with proctored quizzes, and connect students, universities, and leading employers on one transparent protocol.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to={ROUTES.REGISTER}>
                <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                  Create Free Resume
                </Button>
              </Link>
              <Link to={ROUTES.UNIVERSITY_SOLUTIONS}>
                <Button variant="outline" size="lg">
                  Explore University Solutions
                </Button>
              </Link>
              <Link to={ROUTES.JOB_DISCOVERY}>
                <Button variant="ghost" size="lg">
                  Browse Verified Jobs
                </Button>
              </Link>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-neutral-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-success-600" /> Free 1-click PDF export
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-success-600" /> 100% ATS parser compliant
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-success-600" /> Zero credit card required
              </span>
            </div>
          </div>

          {/* Interactive Live Resume & ATS Inspector Widget */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="rounded-xl border border-neutral-200/90 bg-neutral-50 p-2 sm:p-4 shadow-sm">
              {/* Controller Bar */}
              <div className="bg-white rounded-lg border border-neutral-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 shrink-0">
                    Sample Role:
                  </span>
                  <div className="flex bg-neutral-100 p-0.5 rounded-md text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setActiveRole('swe')}
                      className={`px-3 py-1 rounded transition-colors ${
                        activeRole === 'swe' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Frontend
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveRole('backend')}
                      className={`px-3 py-1 rounded transition-colors ${
                        activeRole === 'backend' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Backend
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveRole('pm')}
                      className={`px-3 py-1 rounded transition-colors ${
                        activeRole === 'pm' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      Product
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <span className="text-xs font-medium text-neutral-600">Simulate State:</span>
                  <div className="flex bg-neutral-100 p-0.5 rounded-md text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setIsOptimized(false)}
                      className={`px-2.5 py-1 rounded transition-colors ${
                        !isOptimized ? 'bg-error-50 text-error-700 font-semibold shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      Before AI
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOptimized(true)}
                      className={`px-2.5 py-1 rounded transition-colors flex items-center gap-1 ${
                        isOptimized ? 'bg-primary-600 text-white font-semibold shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
                      }`}
                    >
                      <Sparkles size={12} /> After Insight AI
                    </button>
                  </div>
                </div>
              </div>

              {/* Split Interactive View */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left: Rendered Resume Snippet */}
                <div className="lg:col-span-7 bg-white rounded-lg border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                      <div>
                        <h3 className="font-bold text-base text-neutral-900">Alex Morgan</h3>
                        <p className="text-xs text-neutral-500">Candidate Profile • {currentSample.name}</p>
                      </div>
                      <Badge variant={isOptimized ? 'success' : 'warning'}>
                        {isOptimized ? 'ATS Optimized (96%)' : 'Draft Stage (62%)'}
                      </Badge>
                    </div>

                    {/* Section: Experience */}
                    <div className="mt-4">
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mb-2">
                        Professional Experience • Lead Engineer
                      </div>
                      <div className={`p-3 rounded-md text-xs leading-relaxed transition-all ${
                        isOptimized ? 'bg-primary-50/50 border border-primary-200 text-neutral-800' : 'bg-neutral-50 border border-neutral-200 text-neutral-600'
                      }`}>
                        <div className="flex items-start gap-2">
                          {isOptimized ? (
                            <Sparkles size={14} className="text-primary-600 shrink-0 mt-0.5" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                          )}
                          <p>{activeContent.bullet}</p>
                        </div>
                      </div>
                    </div>

                    {/* Section: Keywords Extracted */}
                    <div className="mt-4">
                      <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400 mb-2">
                        Extracted Taxonomies
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeContent.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className={`text-[11px] px-2 py-0.5 rounded border font-mono ${
                              isOptimized
                                ? 'bg-primary-50 text-primary-700 border-primary-200'
                                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                            }`}
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                    <span>Document Engine: Harvard Standard v1.2</span>
                    <Link to={ROUTES.AI_RESUME_BUILDER} className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1">
                      Open full builder <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>

                {/* Right: ATS Diagnostic Meter */}
                <div className="lg:col-span-5 bg-white rounded-lg border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        ATS Diagnostic Score
                      </span>
                      <span className="text-xs font-mono text-neutral-400">RFC-5532 Compliant</span>
                    </div>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className={`text-4xl font-extrabold tracking-tight ${
                        isOptimized ? 'text-success-600' : 'text-warning-600'
                      }`}>
                        {activeContent.score}
                      </span>
                      <span className="text-neutral-400 text-sm font-medium">/ 100</span>
                      <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${
                        isOptimized ? 'bg-success-50 text-success-700' : 'bg-warning-50 text-warning-700'
                      }`}>
                        {isOptimized ? 'Interview Guaranteed' : 'High Rejection Risk'}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3 w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isOptimized ? 'bg-success-600' : 'bg-warning-500'
                        }`}
                        style={{ width: `${activeContent.score}%` }}
                      />
                    </div>

                    {/* Audit Checklist */}
                    <div className="mt-5 space-y-2">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-400">
                        Diagnostics & Recommendations
                      </span>
                      {activeContent.issues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700">
                          {isOptimized ? (
                            <CheckCircle2 size={14} className="text-success-600 shrink-0 mt-0.5" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-warning-500 shrink-0 mt-1.5" />
                          )}
                          <span>{issue}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Live Simulator</span>
                    <Link to={ROUTES.ATS_CHECKER}>
                      <Button variant="outline" size="sm">
                        Test Your Own Resume
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Three-Pillar Stakeholder Ecosystem
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Three-Sided Ecosystem
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              Purpose-built for every stakeholder in the placement journey.
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              InsightResume replaces disconnected spreadsheets, resume fraud, and black-box hiring filters with an aligned, shared career infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1: Students */}
            <Card className="flex flex-col justify-between hover:border-neutral-300 transition-colors">
              <Card.Content className="p-6">
                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center mb-4">
                  <GraduationCap size={20} />
                </div>
                <Badge variant="info" size="sm" className="mb-2">For Students & Alumni</Badge>
                <h3 className="text-lg font-bold text-neutral-900">Break Through the Filter</h3>
                <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                  Turn classroom projects and internships into quantified achievements. Run deterministic ATS checks, earn verified skill credentials, and apply directly to exclusive drives.
                </p>
                <ul className="mt-5 space-y-2 text-xs text-neutral-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-primary-600 shrink-0" />
                    Google XYZ-formula bullet suggestions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-primary-600 shrink-0" />
                    Adaptive technical skill quizzes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-primary-600 shrink-0" />
                    Single-click applications to partner jobs
                  </li>
                </ul>
              </Card.Content>
              <Card.Footer className="p-6 pt-0">
                <Link to={ROUTES.AI_RESUME_BUILDER} className="w-full">
                  <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
                    Explore Builder
                  </Button>
                </Link>
              </Card.Footer>
            </Card>

            {/* Pillar 2: Universities */}
            <Card className="flex flex-col justify-between border-primary-200 bg-white hover:border-primary-300 transition-colors relative shadow-xs">
              <div className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                High Impact
              </div>
              <Card.Content className="p-6">
                <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center mb-4">
                  <Building2 size={20} />
                </div>
                <Badge variant="default" size="sm" className="mb-2">For Placement Cells & Deans</Badge>
                <h3 className="text-lg font-bold text-neutral-900">Campus Placement Engine</h3>
                <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                  Eliminate administrative spreadsheet chaos. Centralize batch rosters, automate eligibility gating by CGPA and branch, coordinate campus drives, and generate NIRF-ready reports.
                </p>
                <ul className="mt-5 space-y-2 text-xs text-neutral-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-success-600 shrink-0" />
                    Automated eligibility enforcement (Backlogs, CGPA)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-success-600 shrink-0" />
                    CSV student roster batch import
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-success-600 shrink-0" />
                    Real-time offer acceptance & CTC tracking
                  </li>
                </ul>
              </Card.Content>
              <Card.Footer className="p-6 pt-0">
                <Link to={ROUTES.UNIVERSITY_SOLUTIONS} className="w-full">
                  <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
                    University Operating System
                  </Button>
                </Link>
              </Card.Footer>
            </Card>

            {/* Pillar 3: Companies */}
            <Card className="flex flex-col justify-between hover:border-neutral-300 transition-colors">
              <Card.Content className="p-6">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center mb-4">
                  <Users size={20} />
                </div>
                <Badge variant="default" size="sm" className="mb-2">For Recruiter Teams</Badge>
                <h3 className="text-lg font-bold text-neutral-900">Pre-Verified Talent Sourcing</h3>
                <p className="mt-2 text-xs text-neutral-600 leading-relaxed">
                  Stop parsing poorly formatted submissions. Search standard, high-signal profiles backed by verified test benchmarks. Run multi-college recruitment drives in a single interface.
                </p>
                <ul className="mt-5 space-y-2 text-xs text-neutral-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-primary-600 shrink-0" />
                    Zero resume formatting parse errors
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-primary-600 shrink-0" />
                    Proctored skill quiz threshold filters
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-primary-600 shrink-0" />
                    Direct campus placement drive access
                  </li>
                </ul>
              </Card.Content>
              <Card.Footer className="p-6 pt-0">
                <Link to={ROUTES.COMPANY_SOLUTIONS} className="w-full">
                  <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight size={14} />}>
                    Recruiter Solutions
                  </Button>
                </Link>
              </Card.Footer>
            </Card>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Interactive 4-Step Workflow
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Precision Architecture
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              From raw milestone to interview shortlists in four steps.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              InsightResume standardizes the unstructured resume authoring journey into an empirical, algorithmic pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Step Selection List */}
            <div className="lg:col-span-5 space-y-3">
              {workflowSteps.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-neutral-50 border-neutral-300 shadow-xs ring-1 ring-neutral-300'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-neutral-400">
                        {step.tag}
                      </span>
                      <Badge variant={isActive ? 'info' : 'default'} size="sm">
                        {step.badge}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-sm text-neutral-900">{step.title}</h4>
                    <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Interactive Step Preview Graphic */}
            <div className="lg:col-span-7 bg-neutral-900 rounded-xl p-6 text-white font-mono text-xs border border-neutral-800 shadow-lg min-h-[380px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-neutral-400 text-[11px]">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-error-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-warning-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-success-500 inline-block" />
                    <span className="ml-2 font-mono text-neutral-300">pipeline://insight-engine/v2.4</span>
                  </span>
                  <span>status: ACTIVE</span>
                </div>

                <div className="mt-5 space-y-4 font-mono">
                  {activeStep === 0 && (
                    <div className="space-y-3">
                      <p className="text-neutral-400">// Ingesting structured resume schema</p>
                      <p className="text-primary-400">&gt; Parsing text layers from uploaded document...</p>
                      <p className="text-neutral-300 font-sans text-xs bg-neutral-800/80 p-3 rounded border border-neutral-700">
                        "Extracted 4 education entries, 3 technical projects, 12 skill keywords. Layout: Single Column Clean. Zero unparseable tables detected."
                      </p>
                      <p className="text-success-400">&gt; OCR Quality Check: 100% vector text parseable.</p>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-3">
                      <p className="text-neutral-400">// Applying XYZ Google Action Framework</p>
                      <div className="bg-neutral-800/80 p-3 rounded border border-neutral-700 space-y-2">
                        <div className="text-error-400 text-[11px]">- Before: "Built website using React and fixed bugs."</div>
                        <div className="text-success-400 text-[11px] font-semibold">
                          + Enhanced: "Engineered responsive client portal in React/Tailwind, decreasing initial payload size by 38% and servicing 45k monthly users."
                        </div>
                      </div>
                      <p className="text-neutral-400">&gt; Metric density score boosted: +32 points.</p>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-3">
                      <p className="text-neutral-400">// Deterministic Applicant Tracking Simulator</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 rounded bg-neutral-800 border border-neutral-700">
                          <span className="text-neutral-400">Workday Parser</span>
                          <p className="text-success-400 font-bold mt-1">98% Match Rate</p>
                        </div>
                        <div className="p-2.5 rounded bg-neutral-800 border border-neutral-700">
                          <span className="text-neutral-400">Greenhouse Heuristic</span>
                          <p className="text-success-400 font-bold mt-1">96% Match Rate</p>
                        </div>
                        <div className="p-2.5 rounded bg-neutral-800 border border-neutral-700">
                          <span className="text-neutral-400">Taleo Semantic Extractor</span>
                          <p className="text-success-400 font-bold mt-1">94% Match Rate</p>
                        </div>
                        <div className="p-2.5 rounded bg-neutral-800 border border-neutral-700">
                          <span className="text-neutral-400">Lever Keyword Density</span>
                          <p className="text-success-400 font-bold mt-1">99% Match Rate</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-3">
                      <p className="text-neutral-400">// Direct Campus & Industry Placement Dispatch</p>
                      <p className="text-primary-400">&gt; Verified Student Token Attached: #IND-90231</p>
                      <div className="p-3 rounded bg-neutral-800/80 border border-neutral-700 text-xs">
                        <div className="flex items-center justify-between text-neutral-300">
                          <span>Google Cloud Solutions Drive</span>
                          <Badge variant="success" size="sm">Eligible</Badge>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          Criteria check passed: CGPA 8.6 &gt;= 7.5 | 0 Backlogs | Branch: CS/IT
                        </p>
                      </div>
                      <p className="text-success-400">&gt; Direct transmission ready. 1-Click submit enabled.</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-neutral-400 text-[11px]">
                <span>Insight Engine Pipeline ver 2.4.9</span>
                <Link to={ROUTES.FEATURES} className="text-primary-400 hover:text-primary-300 flex items-center gap-1 font-sans">
                  Deep Dive Features <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Enterprise Features Grid
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Platform Features
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              Everything required to scale career placement.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Built on strict engineering principles with zero fluff, clean data isolation, and actionable automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:border-neutral-300 transition-colors">
              <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-800 mb-4">
                <Cpu size={18} />
              </div>
              <h3 className="font-bold text-base text-neutral-900">AI Phrasing & Quantification</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Transform casual bullet points into punchy, metric-backed accomplishments with domain-specific vocabulary tailored to 120+ career roles.
              </p>
            </Card>

            <Card className="p-6 hover:border-neutral-300 transition-colors">
              <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-800 mb-4">
                <BarChart3 size={18} />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Real-Time ATS Score Checker</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Receive instant granular feedback on keyword density, section taxonomy, date formatting, and margin parseability as you type.
              </p>
            </Card>

            <Card className="p-6 hover:border-neutral-300 transition-colors">
              <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-800 mb-4">
                <Award size={18} />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Adaptive Skill Verification</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Validate candidate assertions through proctored 10-minute micro-quizzes, attaching cryptographically verifiable badges to candidates' portfolios.
              </p>
            </Card>

            <Card className="p-6 hover:border-neutral-300 transition-colors">
              <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-800 mb-4">
                <Sliders size={18} />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Campus Drive Automations</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Configure automated eligibility thresholds for visiting recruiters. Students are automatically approved or screened out based on verified registrar records.
              </p>
            </Card>

            <Card className="p-6 hover:border-neutral-300 transition-colors">
              <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-800 mb-4">
                <FileText size={18} />
              </div>
              <h3 className="font-bold text-base text-neutral-900">Pixel-Perfect PDF Generation</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Export ATS-friendly vector PDF files that preserve typography standards across any operating system or screen resolution without table clipping.
              </p>
            </Card>

            <Card className="p-6 hover:border-neutral-300 transition-colors">
              <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-800 mb-4">
                <Lock size={18} />
              </div>
              <h3 className="font-bold text-base text-neutral-900">FERPA & SOC-2 Aligned</h3>
              <p className="text-xs text-neutral-600 mt-2 leading-relaxed">
                Strict data segregation, end-to-end encryption at rest (AES-256), and guaranteed zero commercial data reselling or public LLM training.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Trust & Security Standards Strip
          ───────────────────────────────────────────────────────────── */}
      <section className="py-12 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-neutral-100 last:border-0">
              <p className="text-2xl font-extrabold text-neutral-900 tracking-tight">120,000+</p>
              <p className="text-xs text-neutral-500 mt-1">Resumes Generated</p>
            </div>
            <div className="p-4 border-r border-neutral-100 last:border-0">
              <p className="text-2xl font-extrabold text-neutral-900 tracking-tight">94.2%</p>
              <p className="text-xs text-neutral-500 mt-1">Average ATS Pass Rate</p>
            </div>
            <div className="p-4 border-r border-neutral-100 last:border-0">
              <p className="text-2xl font-extrabold text-neutral-900 tracking-tight">45+</p>
              <p className="text-xs text-neutral-500 mt-1">Partner Universities</p>
            </div>
            <div className="p-4">
              <p className="text-2xl font-extrabold text-neutral-900 tracking-tight">850+</p>
              <p className="text-xs text-neutral-500 mt-1">Hiring Placement Drives</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Frequently Asked Questions (Accordion)
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Frequently Asked Questions
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              Common questions from students and institutions.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Can't find what you need? Visit our{' '}
              <Link to={ROUTES.FAQ} className="text-primary-600 hover:underline font-medium">
                full knowledge base
              </Link>{' '}
              or{' '}
              <Link to={ROUTES.CONTACT} className="text-primary-600 hover:underline font-medium">
                contact our support team
              </Link>
              .
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between text-sm font-semibold text-neutral-900 hover:text-primary-600 focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={16} className="text-neutral-400 shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Final Call to Action Banner
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-neutral-900 text-white p-8 sm:p-12 lg:p-16 border border-neutral-800 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-medium text-neutral-300 mb-6">
                Start Building Today
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Ready to elevate your placement outcomes?
              </h2>
              <p className="mt-4 text-sm text-neutral-400 leading-relaxed">
                Join thousands of students and university placement cells using InsightResume to streamline their hiring pipeline.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to={ROUTES.REGISTER}>
                  <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100" rightIcon={<ArrowRight size={16} />}>
                    Get Started Free
                  </Button>
                </Link>
                <Link to={ROUTES.CONTACT}>
                  <Button variant="ghost" size="lg" className="text-white hover:bg-neutral-800 border border-neutral-700">
                    Schedule Institution Demo
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-xs text-neutral-500">
                Institutional partnerships include custom single sign-on (SSO) and registrar database integration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
