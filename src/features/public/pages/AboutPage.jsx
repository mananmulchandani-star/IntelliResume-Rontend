import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Badge } from '../../../components/ui';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Cpu,
  Layers,
  HeartHandshake,
  FileCheck2,
  Lock,
  Globe2,
  Building,
  GraduationCap,
} from 'lucide-react';

export default function AboutPage() {
  const principles = [
    {
      icon: <Target className="w-5 h-5 text-primary-600" />,
      title: 'Merit Over Formatting Traps',
      desc: 'Over 75% of capable candidates are screened out simply because legacy ATS parsers trip over columns, non-standard fonts, or complex graphics. We believe candidate merit should never be lost in algorithmic translation.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-primary-600" />,
      title: 'Algorithmic Transparency',
      desc: 'No black-box rejections. We empower students and placement officers with deterministic diagnostic feedback, showing exactly why a resume parses or fails before submission.',
    },
    {
      icon: <Layers className="w-5 h-5 text-primary-600" />,
      title: 'Connected Institutional Protocol',
      desc: 'Higher education credentials, verified technical skills, and recruiter hiring drives shouldn’t exist on isolated islands. We provide a single source of truth for all three stakeholders.',
    },
    {
      icon: <Lock className="w-5 h-5 text-primary-600" />,
      title: 'Absolute Data Sovereignty',
      desc: 'Student academic records and career drafts are deeply personal. We enforce zero public AI model training on candidate records and zero reselling of user data.',
    },
  ];

  const milestones = [
    { value: '120,000+', label: 'Verified Resumes Created', sub: 'Across 120+ specialized disciplines' },
    { value: '45+', label: 'Colleges & Universities', sub: 'Active campus placement portals' },
    { value: '94.2%', label: 'First-Round ATS Pass Rate', sub: 'Tested against Workday, Greenhouse & Taleo' },
    { value: '850+', label: 'On-Campus Hiring Drives', sub: 'Automated eligibility & shortlisting' },
  ];

  const engineeringStandards = [
    {
      title: 'Sub-Second Deterministic Parsing',
      desc: 'Built on a custom vector text parsing engine that guarantees 100% optical character recognition (OCR) and layer extraction across any standard PDF document.',
    },
    {
      title: 'Google XYZ Quantification Logic',
      desc: 'Our semantic AI models assist candidates in formatting every bullet into a demonstrable metric formula: "Accomplished [X] measured by [Y] by doing [Z]".',
    },
    {
      title: 'FERPA & Enterprise Security Compliance',
      desc: 'Role-based access control (RBAC), SOC-2 compliant encryption at rest and in transit, and dedicated audit logging for university placement officers.',
    },
    {
      title: 'WCAG 2.1 AA Accessibility',
      desc: 'High contrast ratios, complete keyboard navigability, and screen-reader optimized semantics across every public page and internal student dashboard.',
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
            Our Purpose & Vision
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Democratizing career mobility with precision intelligence.
          </h1>
          <p className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto">
            InsightResume was founded to dismantle the broken divide between educational achievement, resume presentation, and corporate applicant tracking algorithms. We engineer tools that give every ambitious candidate a level playing field.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          The Problem We Solve
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
                The Core Problem
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 leading-snug">
                The hiring funnel is clogged with noise, guesswork, and unparseable documents.
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Every year, hundreds of thousands of qualified university students submit resumes formatted with graphical sidebars, intricate tables, and passive descriptions. Enterprise ATS software discards them into rejection bins before human recruiters ever see them.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Simultaneously, university placement cells are overwhelmed managing student eligibility, active backlogs, and visiting company drives across hundreds of fragmented spreadsheets.
              </p>
              <p className="text-sm font-medium text-neutral-900">
                InsightResume transforms this fragmented cycle into an automated, transparent career ecosystem.
              </p>
            </div>

            <div className="lg:col-span-6 bg-neutral-50 rounded-xl border border-neutral-200 p-6 sm:p-8 space-y-4">
              <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-error-50 text-error-600 flex items-center justify-center shrink-0">
                  <span className="font-bold text-xs">75%</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Silent ATS Drop-off</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Qualified applicants rejected purely for formatting and column parse errors.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-warning-50 text-warning-600 flex items-center justify-center shrink-0">
                  <span className="font-bold text-xs">80%</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Administrative Overhead</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Placement officer time spent verifying CGPA cutoffs and tracking batch records manually.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-md bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                  <span className="font-bold text-xs">10x</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Speed with InsightResume</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Faster drive shortlisting, zero parsing errors, and objective skill validation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Four Core Principles
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Founding Principles
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              How we build and operate.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Our engineering and product design are governed by strict ethical and technical commitments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((p, idx) => (
              <Card key={idx} className="p-6 bg-white hover:border-neutral-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-4">
                  {p.icon}
                </div>
                <h3 className="font-bold text-base text-neutral-900">{p.title}</h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Platform Milestones
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {milestones.map((m, idx) => (
              <div key={idx} className="p-4">
                <p className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
                  {m.value}
                </p>
                <p className="text-xs font-bold text-neutral-800 mt-2">{m.label}</p>
                <p className="text-[11px] text-neutral-500 mt-1">{m.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Engineering Standards
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Technical Rigor
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              Engineering standards that power InsightResume.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Reliability, deterministic document formatting, and uncompromised security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {engineeringStandards.map((std, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg border border-neutral-200 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <FileCheck2 size={16} className="text-primary-600 shrink-0" />
                  <h4 className="font-semibold text-sm text-neutral-900">{std.title}</h4>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed pl-6">{std.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Call to Action
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            Join the modern career movement.
          </h2>
          <p className="mt-3 text-sm text-neutral-600 max-w-xl mx-auto">
            Whether you are a student crafting your first resume or a university placement cell managing thousands of graduating seniors, InsightResume is built for you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to={ROUTES.REGISTER}>
              <Button size="md" rightIcon={<ArrowRight size={15} />}>
                Create Your Resume
              </Button>
            </Link>
            <Link to={ROUTES.CONTACT}>
              <Button variant="outline" size="md">
                Talk to Our Leadership
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
