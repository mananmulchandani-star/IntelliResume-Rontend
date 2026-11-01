import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Badge, Input, Textarea } from '../../../components/ui';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
  RotateCw,
  Copy,
  Check,
  Layout,
  Wand2,
  ShieldCheck,
  Sliders,
  ChevronRight,
} from 'lucide-react';

export default function AIResumeBuilderPage() {
  const [selectedRole, setSelectedRole] = useState('fullstack');
  const [rawText, setRawText] = useState(
    'Built backend APIs with Node.js and worked on Postgres database queries to make data load quicker.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('harvard');

  const rolePresets = {
    fullstack: {
      label: 'Full-Stack Developer',
      raw: 'Built backend APIs with Node.js and worked on Postgres database queries to make data load quicker.',
      enhanced:
        'Architected high-throughput Node.js/Express REST microservices and optimized PostgreSQL indexing, reducing p95 query latency by 41% across 1.8M daily API transactions.',
      atsBefore: 54,
      atsAfter: 97,
      keywords: ['Node.js', 'PostgreSQL', 'Microservices', 'REST APIs', 'Query Optimization', 'Docker'],
      impactFormula: 'Action: Architected + Scope: 1.8M daily API transactions + Result: 41% latency drop',
    },
    devops: {
      label: 'Cloud & DevOps Engineer',
      raw: 'Configured Docker containers and set up CI/CD pipelines on GitHub Actions to deploy code to AWS.',
      enhanced:
        'Automated multi-stage Docker container build workflows and GitHub Actions CI/CD pipelines, decreasing deployment cycle time by 65% across 24 production AWS ECS clusters.',
      atsBefore: 58,
      atsAfter: 96,
      keywords: ['Docker', 'GitHub Actions', 'AWS ECS', 'CI/CD', 'Infrastructure as Code', 'Terraform'],
      impactFormula: 'Action: Automated + Scope: 24 production clusters + Result: 65% cycle reduction',
    },
    datascience: {
      label: 'Data Scientist / ML',
      raw: 'Trained machine learning models in Python and scikit-learn to predict customer churn.',
      enhanced:
        'Engineered predictive churn classification models using Python/XGBoost on 450k customer records, lifting recall by 23% and preventing an estimated $340k in annual revenue churn.',
      atsBefore: 52,
      atsAfter: 95,
      keywords: ['Python', 'XGBoost', 'scikit-learn', 'Feature Engineering', 'ROC-AUC', 'Pandas'],
      impactFormula: 'Action: Engineered + Scope: 450k records + Result: +23% recall / $340k saved',
    },
    pm: {
      label: 'Product Manager',
      raw: 'Led sprint planning and coordinated with developers and designers to launch new checkout flow.',
      enhanced:
        'Spearheaded cross-functional squad of 8 engineers and designers to deliver frictionless 2-step checkout flow, boosting conversion by 19.4% and reducing cart abandonment.',
      atsBefore: 60,
      atsAfter: 94,
      keywords: ['Agile / Scrum', 'Conversion Rate Optimization', 'Cross-Functional Leadership', 'A/B Testing'],
      impactFormula: 'Action: Spearheaded + Scope: Squad of 8 + Result: 19.4% conversion boost',
    },
  };

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setRawText(rolePresets[roleKey].raw);
  };

  const handleSimulateEnhance = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rolePresets[selectedRole].enhanced);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const templates = [
    {
      id: 'harvard',
      name: 'Harvard Academic Classic',
      badge: 'Most Popular',
      desc: 'Single-column timeless layout with strong serif headers, clean horizontal dividers, and 100% Fortune 500 ATS compliance.',
      features: ['Single-column hierarchy', 'Zero parsing traps', 'Ideal for campus placements'],
    },
    {
      id: 'tech',
      name: 'Modern Tech Minimalist',
      badge: 'Engineering Focused',
      desc: 'Optimized for software engineers, product managers, and data analysts with prominent technical skill taxonomy bars.',
      features: ['Compact skill grid', 'Git & project link tags', 'Metric-focused typography'],
    },
    {
      id: 'executive',
      name: 'Executive Leadership',
      badge: 'Mid & Senior Roles',
      desc: 'Designed for candidates with 4+ years of experience. Emphasizes organizational milestones, revenue impact, and team leadership.',
      features: ['Impact summary callout', 'Role scope timeline', 'Clean corporate font pairs'],
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
            AI Resume Copilot
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Turn raw drafts into high-impact, quantified resumes.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Input basic bullet points. Our AI engine converts passive responsibilities into verifiable achievements structured around Google's proven XYZ formula.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                Start Building Free
              </Button>
            </Link>
            <Link to={ROUTES.ATS_CHECKER}>
              <Button variant="outline" size="lg">
                View ATS Checker
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Interactive AI Builder Simulator
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Interactive Simulator
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              See the AI quantification engine in real-time.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Select a target role or test your own bullet points to watch how the engine rewrites content for maximum ATS impact.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Role preset chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
              <span className="text-xs font-semibold text-neutral-500 mr-2">Select Role Preset:</span>
              {Object.keys(rolePresets).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleRoleSelect(key)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                    selectedRole === key
                      ? 'bg-neutral-900 text-white border-neutral-900 font-semibold'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {rolePresets[key].label}
                </button>
              ))}
            </div>

            {/* Split Comparison Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-neutral-50 rounded-2xl border border-neutral-200 p-6 sm:p-8 shadow-xs">
              {/* Left: Raw Draft Input */}
              <div className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Raw Bullet Point (Unoptimized)
                    </span>
                    <Badge variant="warning" size="sm">
                      ATS Score: {rolePresets[selectedRole].atsBefore}/100
                    </Badge>
                  </div>

                  <Textarea
                    label="Draft Text"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    rows={4}
                    className="font-sans text-neutral-700 text-xs leading-relaxed"
                  />

                  <div className="mt-4 p-3 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-500 space-y-1">
                    <p className="font-semibold text-neutral-700">Diagnostic Findings:</p>
                    <p className="flex items-center gap-1.5 text-error-600">
                      • Passive phrasing ("Worked on", "Built APIs")
                    </p>
                    <p className="flex items-center gap-1.5 text-error-600">
                      • Missing quantifiable metrics or transaction volume
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Step 1 of 2</span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSimulateEnhance}
                    isLoading={isGenerating}
                    leftIcon={<Wand2 size={14} />}
                  >
                    Enhance with AI
                  </Button>
                </div>
              </div>

              {/* Right: AI Enhanced Result */}
              <div className="bg-white rounded-xl border border-primary-200 p-5 flex flex-col justify-between shadow-xs ring-1 ring-primary-100">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary-700 flex items-center gap-1.5">
                      <Sparkles size={14} /> AI Quantified Result
                    </span>
                    <Badge variant="success" size="sm">
                      ATS Score: {rolePresets[selectedRole].atsAfter}/100
                    </Badge>
                  </div>

                  <div className="p-3.5 rounded-lg bg-primary-50/50 border border-primary-200 text-xs leading-relaxed text-neutral-900 font-medium">
                    {rolePresets[selectedRole].enhanced}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500">
                      Google XYZ Structure Verified:
                    </div>
                    <p className="text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded border border-neutral-200 font-mono">
                      {rolePresets[selectedRole].impactFormula}
                    </p>

                    <div className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 mt-3">
                      Injected Industry Taxonomies:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {rolePresets[selectedRole].keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded bg-primary-100 text-primary-800 font-mono font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs text-success-700 font-medium flex items-center gap-1">
                    <CheckCircle2 size={14} /> Ready to export
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    leftIcon={copied ? <Check size={14} /> : <Copy size={14} />}
                  >
                    {copied ? 'Copied to Clipboard' : 'Copy Snippet'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Template Showcase
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Clean Document Layouts
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              Engineered for recruiters and ATS parsers.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Zero tables, zero floating graphics, zero broken columns. Select between clean aesthetic options with 100% vector font rendering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((tpl) => (
              <Card
                key={tpl.id}
                className={`p-6 flex flex-col justify-between transition-all ${
                  selectedTemplate === tpl.id
                    ? 'border-neutral-900 ring-2 ring-neutral-900/10'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={selectedTemplate === tpl.id ? 'info' : 'default'} size="sm">
                      {tpl.badge}
                    </Badge>
                    <span className="text-xs font-mono text-neutral-400">PDF A4 Ready</span>
                  </div>
                  <h3 className="font-bold text-base text-neutral-900">{tpl.name}</h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{tpl.desc}</p>

                  <ul className="mt-4 space-y-1.5 text-xs text-neutral-700">
                    {tpl.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={13} className="text-primary-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`w-full text-xs font-medium py-2 rounded-md transition-colors cursor-pointer ${
                      selectedTemplate === tpl.id
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {selectedTemplate === tpl.id ? 'Active Preview' : 'Select Layout'}
                  </button>
                </div>
              </Card>
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
            Build your professional resume today.
          </h2>
          <p className="mt-3 text-sm text-neutral-600 max-w-xl mx-auto">
            Take full advantage of our interactive AI copilot, real-time ATS auditing, and verified credential engine with zero subscription fees.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                Launch Full Resume Builder
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
