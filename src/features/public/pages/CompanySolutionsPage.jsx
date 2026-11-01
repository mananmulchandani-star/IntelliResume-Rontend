import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Badge, Input, Select, Textarea } from '../../../components/ui';
import {
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
  Search,
  Filter,
  GraduationCap,
  Building2,
  Briefcase,
  Check,
  Zap,
  Target,
  BarChart3,
  Calendar,
} from 'lucide-react';

export default function CompanySolutionsPage() {
  const [selectedSkill, setSelectedSkill] = useState('react');
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    workEmail: '',
    contactName: '',
    hiringVolume: '10-50',
    notes: '',
  });

  const candidatesBySkill = {
    react: [
      {
        name: 'Sarah Chen',
        degree: 'B.S. Computer Science • Top 5% Cohort',
        university: 'University of Michigan',
        gpa: '3.92',
        verifiedScore: 98,
        quiz: 'React & Frontend Architecture',
        skills: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Jest'],
        impact: 'Engineered high-throughput dashboard for 120k MAU; cut p95 latency by 35%.',
      },
      {
        name: 'Devin Vance',
        degree: 'B.Tech Software Engineering',
        university: 'Purdue University',
        gpa: '3.86',
        verifiedScore: 94,
        quiz: 'Frontend Systems & Web Vitals',
        skills: ['React', 'JavaScript', 'GraphQL', 'Vite', 'Redux'],
        impact: 'Built modular component library used across 8 production applications.',
      },
    ],
    python: [
      {
        name: 'Kavita Patel',
        degree: 'M.S. Artificial Intelligence',
        university: 'Carnegie Mellon University',
        gpa: '3.95',
        verifiedScore: 99,
        quiz: 'Python Backend & Concurrency',
        skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'AsyncIO'],
        impact: 'Architected async ingestion pipeline handling 35k events/sec with Redis caching.',
      },
      {
        name: 'Marcus Bell',
        degree: 'B.S. Data Science',
        university: 'University of Texas at Austin',
        gpa: '3.88',
        verifiedScore: 95,
        quiz: 'Python for Data & ML',
        skills: ['Python', 'Pandas', 'XGBoost', 'SQL', 'scikit-learn'],
        impact: 'Trained predictive customer churn model lifting precision by 24%.',
      },
    ],
    distributed: [
      {
        name: 'Liam O’Connor',
        degree: 'B.S. Computer Systems',
        university: 'Georgia Institute of Technology',
        gpa: '3.91',
        verifiedScore: 97,
        quiz: 'Distributed Systems & Go',
        skills: ['Go', 'Kafka', 'Kubernetes', 'gRPC', 'PostgreSQL'],
        impact: 'Implemented distributed consensus protocol with sub-10ms inter-service latency.',
      },
    ],
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.workEmail) return;
    setDemoSubmitted(true);
  };

  const currentCandidates = candidatesBySkill[selectedSkill] || candidatesBySkill.react;

  const solutions = [
    {
      icon: <Award className="w-5 h-5 text-primary-600" />,
      title: 'Pre-Verified Technical Skills',
      desc: 'Eliminate resume embellishments. Candidates are evaluated through proctored, anti-cheat assessments before appearing in your talent pipeline.',
    },
    {
      icon: <Building2 className="w-5 h-5 text-primary-600" />,
      title: 'Direct Multi-Campus Drive Access',
      desc: 'Connect directly with university placement cells across 45+ accredited colleges. Publish campus drives, set hard cutoffs, and review shortlists in one view.',
    },
    {
      icon: <Target className="w-5 h-5 text-primary-600" />,
      title: 'Standardized High-Signal Profiles',
      desc: 'Review structured, parseable resumes formatted consistently with Google XYZ impact bullets, verified GPAs, and github project attachments.',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-primary-600" />,
      title: 'Collaborative Hiring Pipeline',
      desc: 'Share candidate profiles with team leads, record interview feedback, assign scorecards, and extend job offers with automated audit logs.',
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
            Enterprise Talent Acquisition
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Hire verified early-career talent with zero noise.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Access an elite network of university graduates and tech talent pre-screened through proctored technical assessments and standardized ATS profiles.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <a href="#recruiter-form">
              <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                Schedule Recruiter Briefing
              </Button>
            </a>
            <Link to={ROUTES.LOGIN}>
              <Button variant="outline" size="lg">
                Recruiter Portal Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Interactive Candidate Sourcing Widget
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Interactive Sourcing Preview
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              Discover verified candidates instantly.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Every candidate in the InsightResume network has passed rigorous ATS formatting checks and domain verification quizzes.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Skill Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <span className="text-xs font-semibold text-neutral-500 mr-2">Target Competency:</span>
              <button
                type="button"
                onClick={() => setSelectedSkill('react')}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  selectedSkill === 'react'
                    ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                React & Frontend Architecture
              </button>
              <button
                type="button"
                onClick={() => setSelectedSkill('python')}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  selectedSkill === 'python'
                    ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                Python & Backend Systems
              </button>
              <button
                type="button"
                onClick={() => setSelectedSkill('distributed')}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors cursor-pointer ${
                  selectedSkill === 'distributed'
                    ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                Distributed Systems & Go
              </button>
            </div>

            {/* Candidate Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentCandidates.map((cand, idx) => (
                <Card key={idx} className="p-6 bg-neutral-50 border-neutral-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between pb-3 border-b border-neutral-200">
                      <div>
                        <h4 className="font-bold text-base text-neutral-900">{cand.name}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5">{cand.university}</p>
                      </div>
                      <Badge variant="success" size="sm">
                        Verified {cand.verifiedScore}%
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-2 text-xs">
                      <div className="flex justify-between text-neutral-600">
                        <span>Degree & Standing:</span>
                        <span className="font-semibold text-neutral-800">{cand.degree}</span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Cumulative GPA:</span>
                        <span className="font-mono font-bold text-neutral-900">{cand.gpa} / 4.0</span>
                      </div>
                      <div className="flex justify-between text-neutral-600">
                        <span>Proctored Assessment:</span>
                        <span className="font-semibold text-primary-700">{cand.quiz}</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-white rounded-lg border border-neutral-200 text-xs text-neutral-700 leading-relaxed">
                      <span className="font-semibold text-neutral-900 block mb-1">Key Accomplishment:</span>
                      "{cand.impact}"
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {cand.skills.map((s, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 bg-neutral-200/60 rounded text-neutral-800 font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-500">Verified via Proctored Quiz</span>
                    <a href="#recruiter-form">
                      <Button size="sm" variant="outline">
                        Request Candidate Profile
                      </Button>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Core Enterprise Solutions
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Enterprise Suite
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              Accelerate your campus and early-talent hiring.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Save hundreds of engineering interviewing hours with objective pre-qualification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((s, idx) => (
              <Card key={idx} className="p-6 bg-white hover:border-neutral-300 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h3 className="font-bold text-base text-neutral-900">{s.title}</h3>
                <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Schedule Briefing Form
          ───────────────────────────────────────────────────────────── */}
      <section id="recruiter-form" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge variant="info" size="sm" className="mb-3">
              Recruiter Inquiries
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
              Schedule a recruiter consultation.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Tell us your early-career hiring targets, and we'll connect you directly to our verified university candidate pipeline.
            </p>
          </div>

          <Card className="p-6 sm:p-8 border-neutral-200 shadow-sm">
            {demoSubmitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-12 h-12 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto">
                  <Check size={24} />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Briefing Request Received</h3>
                <p className="text-xs text-neutral-600 max-w-md mx-auto">
                  Thank you. An Enterprise Talent Specialist has received your briefing request and will reach out to{' '}
                  <span className="font-semibold text-neutral-900">{formData.workEmail}</span> today.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setDemoSubmitted(false)}
                >
                  Submit another inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Company / Employer Name"
                    required
                    placeholder="e.g. Stripe, Datadog"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                  <Input
                    label="Corporate Work Email"
                    required
                    type="email"
                    placeholder="recruiting@company.com"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name & Title"
                    required
                    placeholder="Jane Doe, Head of Talent Acquisition"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                  <Select
                    label="Projected Annual Early-Career Hires"
                    value={formData.hiringVolume}
                    onChange={(e) => setFormData({ ...formData, hiringVolume: e.target.value })}
                    options={[
                      { value: 'under-10', label: '1 - 10 Hires' },
                      { value: '10-50', label: '10 - 50 Hires' },
                      { value: '50-200', label: '50 - 200 Hires' },
                      { value: '200+', label: '200+ Hires (Enterprise Campus Cohorts)' },
                    ]}
                  />
                </div>

                <Textarea
                  label="Target Roles & Disciplines"
                  rows={3}
                  placeholder="e.g. Frontend Engineers, Cloud SREs, Product Management Interns..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />

                <Button type="submit" size="md" fullWidth rightIcon={<ArrowRight size={15} />}>
                  Request Enterprise Recruiter Access
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
