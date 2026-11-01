import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Badge, Input, Select, Textarea } from '../../../components/ui';
import {
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Users,
  BarChart3,
  Sliders,
  ShieldCheck,
  FileSpreadsheet,
  CalendarCheck,
  Lock,
  Download,
  Check,
} from 'lucide-react';

export default function UniversitySolutionsPage() {
  // Eligibility Simulator state
  const [minCgpa, setMinCgpa] = useState(7.5);
  const [maxBacklogs, setMaxBacklogs] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState('all');

  // Demo Request Form state
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    institutionName: '',
    workEmail: '',
    contactName: '',
    roleTitle: '',
    batchSize: '500-1500',
    notes: '',
  });

  const totalCohortSize = 850;

  // Calculate simulated eligible count
  const calculateEligibleStudents = () => {
    let base = totalCohortSize;
    // CGPA reduction
    if (minCgpa >= 8.5) base *= 0.35;
    else if (minCgpa >= 8.0) base *= 0.55;
    else if (minCgpa >= 7.5) base *= 0.72;
    else if (minCgpa >= 7.0) base *= 0.85;

    // Backlog reduction
    if (maxBacklogs === 0) base *= 0.88;

    // Branch reduction
    if (selectedBranch !== 'all') base *= 0.45;

    return Math.max(12, Math.round(base));
  };

  const eligibleCount = calculateEligibleStudents();
  const eligiblePercentage = Math.round((eligibleCount / totalCohortSize) * 100);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.institutionName || !formData.workEmail || !formData.contactName) return;
    setFormSubmitted(true);
  };

  const capabilities = [
    {
      icon: <FileSpreadsheet className="w-5 h-5 text-primary-600" />,
      title: 'Batch Roster CSV Onboarding',
      desc: 'Import thousands of students in seconds with verified registrar data: CGPA, department, roll numbers, and active backlog history. Eliminate manual student self-reporting errors.',
    },
    {
      icon: <Sliders className="w-5 h-5 text-primary-600" />,
      title: 'Automated Drive Eligibility Gating',
      desc: 'Set strict company-mandated criteria. The system automatically admits or screens out applicants in real-time, preventing ineligible students from cluttering interview slots.',
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-primary-600" />,
      title: 'End-to-End Drive Coordination',
      desc: 'Invite visiting enterprise employers to custom branded portals. Manage online assessment links, technical interview schedules, and release verified offer letters seamlessly.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-primary-600" />,
      title: 'NIRF & Accreditation Analytics',
      desc: 'Generate institutional placement audit reports in one click. Track median CTC, placement percentages by branch, gender ratios, and historical recruiter engagement trends.',
    },
    {
      icon: <Lock className="w-5 h-5 text-primary-600" />,
      title: 'Profile Freeze & Integrity Locks',
      desc: 'Lock student resumes and CGPA metrics before recruitment drives kick off, ensuring companies only evaluate verified, tamper-proof credentials.',
    },
    {
      icon: <Users className="w-5 h-5 text-primary-600" />,
      title: 'Multi-Department Coordinator Access',
      desc: 'Role-based permissions for Dean of Placements, departmental coordinators, and faculty advisors to oversee specific branches without data crosstalk.',
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
            Higher Education & Campus Placements
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            The operating system for campus placement cells.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Replace spreadsheet chaos with an automated placement engine. Verify student eligibility in real-time, invite enterprise recruiters, and track offers with zero administrative overhead.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <a href="#demo-form">
              <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                Request Institutional Demo
              </Button>
            </a>
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" size="lg">
                Placement Officer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Interactive Eligibility Simulator
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Interactive Tool
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              Automated drive eligibility calculator.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              See how our deterministic rules engine instantly filters a graduating cohort of 850 students.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-neutral-50 rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Controls Column */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-neutral-700 mb-2">
                    <span>Minimum CGPA Cutoff</span>
                    <span className="font-mono text-primary-600 text-sm font-extrabold">{minCgpa.toFixed(1)} / 10.0</span>
                  </div>
                  <input
                    type="range"
                    min="6.0"
                    max="9.0"
                    step="0.1"
                    value={minCgpa}
                    onChange={(e) => setMinCgpa(parseFloat(e.target.value))}
                    className="w-full accent-primary-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-400 mt-1">
                    <span>6.0</span>
                    <span>7.5</span>
                    <span>9.0</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-neutral-700 mb-2">
                    <span>Active Backlog Tolerance</span>
                    <span className="font-mono text-primary-600 text-sm font-extrabold">
                      {maxBacklogs === 0 ? 'Strict 0 Backlogs' : `Max ${maxBacklogs} Backlog`}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[0, 1].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setMaxBacklogs(num)}
                        className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors cursor-pointer flex-1 ${
                          maxBacklogs === num
                            ? 'bg-neutral-900 text-white border-neutral-900'
                            : 'bg-white text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {num === 0 ? '0 Active Backlogs (Default)' : 'Up to 1 Backlog Allowed'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2">
                    Department Gating
                  </label>
                  <select
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="w-full text-xs bg-white border border-neutral-200 rounded-md p-2 font-medium text-neutral-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="all">All Engineering & STEM Branches (CS, IT, ECE, Mech, Civil)</option>
                    <option value="circuit">Circuit Branches Only (Computer Science & Electronics)</option>
                  </select>
                </div>
              </div>

              {/* Real-time Result Card */}
              <div className="md:col-span-5 bg-white rounded-xl border border-neutral-200 p-6 text-center shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block mb-1">
                  Eligible Candidate Pool
                </span>
                <p className="text-4xl font-extrabold text-neutral-900 tracking-tight">
                  {eligibleCount}{' '}
                  <span className="text-base font-normal text-neutral-400">/ {totalCohortSize}</span>
                </p>
                <div className="mt-3 inline-block px-3 py-1 rounded-full bg-success-50 border border-success-200 text-xs font-bold text-success-700 font-mono">
                  {eligiblePercentage}% of Cohort Cleared
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 text-xs text-neutral-500 text-left space-y-1.5">
                  <p className="flex items-center gap-1.5 text-neutral-700">
                    <CheckCircle2 size={13} className="text-success-600 shrink-0" />
                    Automated email invitations ready
                  </p>
                  <p className="flex items-center gap-1.5 text-neutral-700">
                    <CheckCircle2 size={13} className="text-success-600 shrink-0" />
                    Verified registrar record validation
                  </p>
                  <p className="flex items-center gap-1.5 text-neutral-700">
                    <CheckCircle2 size={13} className="text-success-600 shrink-0" />
                    1-Click student list export for recruiter
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Core Capabilities Grid
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Institutional Capabilities
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              Built for placement teams of any scale.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Whether placing 500 or 15,000 students per season, InsightResume scales with zero latency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((c, idx) => (
              <Card key={idx} className="p-6 bg-white hover:border-neutral-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-4">
                  {c.icon}
                </div>
                <h3 className="font-bold text-base text-neutral-900">{c.title}</h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{c.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Schedule Institutional Demo Form
          ───────────────────────────────────────────────────────────── */}
      <section id="demo-form" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="info" size="sm" className="mb-3">
              Institutional Inquiries
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Schedule an institutional briefing.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Our campus engineering team will configure a sandbox environment tailored to your college's placement rules.
            </p>
          </div>

          <Card className="p-6 sm:p-8 border-neutral-200 shadow-sm">
            {formSubmitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Demo Request Submitted</h3>
                <p className="text-xs text-neutral-600 max-w-md mx-auto">
                  Thank you. Our higher education specialist has received your request and will reach out to{' '}
                  <span className="font-semibold text-neutral-900">{formData.workEmail}</span> within 24 business hours to arrange access.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setFormSubmitted(false)}
                >
                  Submit another inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="University / Institution Name"
                    required
                    placeholder="e.g. Stanford University"
                    value={formData.institutionName}
                    onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  />
                  <Input
                    label="Official Academic Email (.edu or institutional)"
                    required
                    type="email"
                    placeholder="officer@university.edu"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Coordinator / Dean Name"
                    required
                    placeholder="Prof. Robert Thorne"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                  <Select
                    label="Annual Graduating Cohort Size"
                    value={formData.batchSize}
                    onChange={(e) => setFormData({ ...formData, batchSize: e.target.value })}
                    options={[
                      { value: 'under-500', label: 'Under 500 Students' },
                      { value: '500-1500', label: '500 - 1,500 Students' },
                      { value: '1500-5000', label: '1,500 - 5,000 Students' },
                      { value: '5000+', label: '5,000+ Students (Multi-Campus)' },
                    ]}
                  />
                </div>

                <Textarea
                  label="Placement Goals or Specific Requirements (Optional)"
                  rows={3}
                  placeholder="Mention target visiting companies, current software stack, or timeline..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />

                <Button type="submit" size="md" fullWidth rightIcon={<ArrowRight size={15} />}>
                  Schedule Institutional Briefing
                </Button>

                <p className="text-[11px] text-neutral-400 text-center">
                  We maintain strict FERPA compliance and never share academic email addresses with third parties.
                </p>
              </form>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
