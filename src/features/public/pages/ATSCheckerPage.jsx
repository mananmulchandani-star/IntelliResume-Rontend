import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Badge, Textarea } from '../../../components/ui';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BarChart3,
  Search,
  FileCheck2,
  Cpu,
  Layers,
  Wand2,
  RefreshCw,
} from 'lucide-react';

const SAMPLE_RESUMES = {
  swe: {
    label: 'Software Engineer (High Score)',
    text: `ALEX MORGAN
Email: alex.morgan@example.com | Phone: (555) 019-2834 | GitHub: github.com/alexm | LinkedIn: linkedin.com/in/alexm

PROFESSIONAL SUMMARY
Results-driven Full-Stack Software Engineer with 3+ years of experience architecting distributed web applications in React, TypeScript, Node.js, and PostgreSQL. Proven track record reducing API latency by 41% and scaling services to 1.8M daily users.

WORK EXPERIENCE
Senior Frontend Engineer | CloudMatrix Solutions | 2023 - Present
• Architected scalable single-page application using React, TypeScript, and Tailwind CSS, increasing page load speed by 38% for 240,000 active monthly users.
• Spearheaded migration from monolithic REST API to GraphQL microservices, reducing unnecessary payload size by 52%.
• Implemented automated CI/CD unit and end-to-end testing with Jest and Cypress, elevating test coverage from 64% to 92%.

Software Engineer | DevPulse Technologies | 2021 - 2023
• Developed and maintained customer-facing dashboards utilizing Node.js, Express, and PostgreSQL, handling $3.4M in processed transactions.
• Containerized 12 core backend services with Docker and orchestrated deployment via AWS ECS clusters.

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML5, CSS3
Frameworks & Libraries: React, Node.js, Next.js, Express, GraphQL, Tailwind CSS
Tools & Cloud: Git, Docker, AWS (ECS, S3, RDS), Redis, CI/CD, Jest, Cypress

EDUCATION
B.S. in Computer Science | State University | CGPA: 3.8 / 4.0 | Graduated 2021`,
    score: 94,
    subscores: {
      keywords: 96,
      parseability: 100,
      impact: 91,
      headers: 95,
    },
    foundKeywords: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Docker', 'AWS', 'CI/CD', 'Jest'],
    missingKeywords: ['Kubernetes', 'Micro-frontends', 'Terraform'],
    warnings: [],
    passedChecks: [
      'Single-column linear text layout detected',
      'Standard contact details properly extracted',
      'Zero problematic table or icon graphics found',
      'Demonstrated Google XYZ metric phrasing across 85% of bullets',
    ],
  },
  grad: {
    label: 'Recent Graduate (Needs Work)',
    text: `JORDAN LEE
Phone: 555-442-1209
Location: New York, NY

Objective:
Hardworking recent college graduate looking for an entry-level software job where I can use my computer skills to help a great company grow.

Education:
B.Tech Computer Engineering, 2024
University of Technology
Relevant Coursework: Data Structures, Web Development, Databases

Projects:
E-Commerce Website
• Made an online shopping cart website using React and Firebase.
• Implemented user login and product listings.
• Worked with friends on styling and database setup.

Chat App
• Built a chat application using Python and sockets.
• Users can talk to each other in real-time.

Skills:
Java, Python, C++, React, Git, Teamwork, Communication, Problem Solving`,
    score: 61,
    subscores: {
      keywords: 58,
      parseability: 82,
      impact: 42,
      headers: 70,
    },
    foundKeywords: ['React', 'Python', 'Java', 'Git'],
    missingKeywords: ['REST APIs', 'TypeScript', 'PostgreSQL', 'Docker', 'Testing', 'CI/CD'],
    warnings: [
      'Missing quantified results (no percentages, active user counts, or latency metrics)',
      'Generic objective statement should be replaced with a technical summary',
      'Soft skills (Teamwork, Communication) should be demonstrated rather than listed',
    ],
    passedChecks: [
      'Contact details present',
      'ASCII text properly parseable without OCR corruption',
    ],
  },
};

export default function ATSCheckerPage() {
  const [selectedSample, setSelectedSample] = useState('swe');
  const [inputText, setInputText] = useState(SAMPLE_RESUMES.swe.text);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelectSample = (sampleKey) => {
    setSelectedSample(sampleKey);
    setInputText(SAMPLE_RESUMES[sampleKey].text);
  };

  const handleRunDiagnostic = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 600);
  };

  const currentResult = SAMPLE_RESUMES[selectedSample];

  return (
    <div className="bg-white text-neutral-900">
      {/* ─────────────────────────────────────────────────────────────
          Hero Section
          ───────────────────────────────────────────────────────────── */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-200 bg-neutral-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="info" size="sm" className="mb-4">
            Deterministic ATS Diagnostic
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Audit your resume against enterprise applicant tracking systems.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Discover formatting bottlenecks, missing technical keywords, and unparseable columns before you apply to Fortune 500 employers.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Interactive ATS Simulator
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Top Sample Selectors */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-neutral-600">Load Benchmark Sample:</span>
                <button
                  type="button"
                  onClick={() => handleSelectSample('swe')}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    selectedSample === 'swe'
                      ? 'bg-neutral-900 text-white font-medium shadow-xs'
                      : 'bg-white text-neutral-700 border border-neutral-200'
                  }`}
                >
                  Software Engineer (94/100)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSample('grad')}
                  className={`text-xs px-3 py-1 rounded transition-colors ${
                    selectedSample === 'grad'
                      ? 'bg-neutral-900 text-white font-medium shadow-xs'
                      : 'bg-white text-neutral-700 border border-neutral-200'
                  }`}
                >
                  Recent Graduate (61/100)
                </button>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={handleRunDiagnostic}
                isLoading={isAnalyzing}
                leftIcon={<RefreshCw size={14} />}
              >
                Run Diagnostic Audit
              </Button>
            </div>

            {/* Split Screen */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Text Input / Viewer */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Resume Text Buffer
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      {inputText.split('\n').length} lines
                    </span>
                  </div>
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={18}
                    className="font-mono text-[11px] leading-relaxed text-neutral-800"
                  />
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                  <span>Tested against Workday, Greenhouse & Taleo parsers</span>
                </div>
              </div>

              {/* Right Column: ATS Report Dashboard */}
              <div className="lg:col-span-6 bg-neutral-50 rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Overall ATS Match Score
                      </span>
                      <p className="text-xs text-neutral-400 mt-0.5">Weighted composite audit</p>
                    </div>
                    <Badge variant={currentResult.score >= 85 ? 'success' : 'warning'}>
                      {currentResult.score >= 85 ? 'Interview Ready' : 'Optimization Required'}
                    </Badge>
                  </div>

                  {/* Main Score Bar */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className={`text-4xl font-extrabold ${
                      currentResult.score >= 85 ? 'text-success-600' : 'text-warning-600'
                    }`}>
                      {currentResult.score}
                    </span>
                    <span className="text-sm font-medium text-neutral-400">/ 100</span>
                  </div>

                  {/* 4 Metric Bars */}
                  <div className="mt-6 space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-neutral-700 mb-1">
                        <span>Keyword Alignment & Density</span>
                        <span className="font-mono font-bold">{currentResult.subscores.keywords}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary-600 h-full rounded-full"
                          style={{ width: `${currentResult.subscores.keywords}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-neutral-700 mb-1">
                        <span>Layout Parseability (Table/Column-Free)</span>
                        <span className="font-mono font-bold">{currentResult.subscores.parseability}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-success-600 h-full rounded-full"
                          style={{ width: `${currentResult.subscores.parseability}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-neutral-700 mb-1">
                        <span>Experience Impact Quantification</span>
                        <span className="font-mono font-bold">{currentResult.subscores.impact}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-primary-600 h-full rounded-full"
                          style={{ width: `${currentResult.subscores.impact}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-medium text-neutral-700 mb-1">
                        <span>Standard Section Taxonomies</span>
                        <span className="font-mono font-bold">{currentResult.subscores.headers}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-success-600 h-full rounded-full"
                          style={{ width: `${currentResult.subscores.headers}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Keywords Tagging */}
                  <div className="mt-6 pt-4 border-t border-neutral-200">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 block mb-2">
                      Extracted Industry Keywords
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentResult.foundKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded bg-success-50 text-success-800 border border-success-200 font-mono"
                        >
                          ✓ {kw}
                        </span>
                      ))}
                      {currentResult.missingKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-500 border border-neutral-200 font-mono line-through"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Warnings or Passed Checks */}
                  <div className="mt-6 space-y-2">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-neutral-500 block">
                      Compliance Findings
                    </span>
                    {currentResult.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-error-700 bg-error-50/60 p-2 rounded border border-error-200">
                        <AlertTriangle size={14} className="text-error-600 shrink-0 mt-0.5" />
                        <span>{w}</span>
                      </div>
                    ))}
                    {currentResult.passedChecks.map((p, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                        <CheckCircle2 size={13} className="text-success-600 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Need automatic fixes?</span>
                  <Link to={ROUTES.AI_RESUME_BUILDER}>
                    <Button size="sm" rightIcon={<ArrowRight size={14} />}>
                      Optimize in Builder
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          12-Point ATS Audit Checklist
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">
              Industry Standard
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">
              Our 12-point deterministic audit standard.
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Every resume exported from InsightResume complies with all twelve criteria automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs space-y-2">
              <span className="text-xs font-mono font-bold text-primary-600">01. Single-Column Flow</span>
              <h4 className="font-bold text-sm text-neutral-900">Linear Document Hierarchy</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Multi-column templates cause parsers to read across columns horizontally, scrambling chronological experience entries.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs space-y-2">
              <span className="text-xs font-mono font-bold text-primary-600">02. Standard Header Tokens</span>
              <h4 className="font-bold text-sm text-neutral-900">Recognized Section Headings</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Uses universal tokens ("Experience", "Education", "Skills") instead of creative variants ("My Journey", "What I Do").
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs space-y-2">
              <span className="text-xs font-mono font-bold text-primary-600">03. Zero Graphic Elements</span>
              <h4 className="font-bold text-sm text-neutral-900">Pure Vector Typography</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Skill rating circles, progress bars, and headshots cannot be read by ATS parsers and frequently corrupt text streams.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs space-y-2">
              <span className="text-xs font-mono font-bold text-primary-600">04. Date Normalization</span>
              <h4 className="font-bold text-sm text-neutral-900">Standard Timeline Formats</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Formats dates as "Month Year" or "YYYY - Present" so algorithmic tenure calculators extract duration correctly.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs space-y-2">
              <span className="text-xs font-mono font-bold text-primary-600">05. Clean Contact Parsing</span>
              <h4 className="font-bold text-sm text-neutral-900">Header Level Metadata</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Avoids putting contact information in PDF header/footer metadata zones where older legacy parsers overlook them.
              </p>
            </div>

            <div className="bg-white p-5 rounded-lg border border-neutral-200 shadow-xs space-y-2">
              <span className="text-xs font-mono font-bold text-primary-600">06. Action Verb Strength</span>
              <h4 className="font-bold text-sm text-neutral-900">High-Impact Google Formula</h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Every bullet opens with a strong active verb ("Architected", "Engineered", "Spearheaded") coupled with empirical metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Call to Action
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            Never submit an unverified resume again.
          </h2>
          <p className="mt-3 text-sm text-neutral-600 max-w-xl mx-auto">
            Build your resume on InsightResume to ensure 100% parseability and industry-leading ATS compliance.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                Build ATS-Ready Resume Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
