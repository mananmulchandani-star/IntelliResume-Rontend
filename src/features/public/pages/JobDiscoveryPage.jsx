import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Badge, Input, Select, Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/ui';
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  DollarSign,
  ArrowRight,
  Filter,
  CheckCircle2,
  Bookmark,
  Share2,
  Calendar,
  Sparkles,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';

export default function JobDiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedExp, setSelectedExp] = useState('all');
  const [activeJobModal, setActiveJobModal] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());

  const jobsData = [
    {
      id: 'job-1',
      title: 'Junior Full-Stack Engineer',
      company: 'Datavest Systems',
      location: 'San Francisco, CA',
      mode: 'Hybrid',
      type: 'Full-time',
      experience: 'Entry Level (0-2 yrs)',
      salary: '$95,000 - $115,000',
      posted: '2 days ago',
      matchScore: 96,
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
      isDrive: true,
      description:
        'Datavest is seeking an ambitious Junior Full-Stack Engineer to build customer analytics interfaces. You will collaborate directly with staff architects to build high-volume React microservices and maintain resilient PostgreSQL schemas.',
      requirements: [
        'Demonstrated proficiency in modern React and TypeScript',
        'Familiarity with relational databases (PostgreSQL or MySQL)',
        'Understanding of REST API design principles and Git version control',
        'InsightResume score >= 85 or verified skill quiz completion',
      ],
      benefits: ['Health, dental, and vision insurance', '401(k) matching', 'Annual $2,000 learning stipend', 'Flexible work arrangements'],
    },
    {
      id: 'job-2',
      title: 'Cloud DevOps Associate',
      company: 'Aether Cloud Infrastructure',
      location: 'Remote',
      mode: 'Remote',
      type: 'Full-time',
      experience: 'Entry Level (0-2 yrs)',
      salary: '$90,000 - $110,000',
      posted: '1 day ago',
      matchScore: 92,
      skills: ['Docker', 'AWS', 'GitHub Actions', 'Python', 'Linux'],
      isDrive: false,
      description:
        'Help scale automated CI/CD pipelines across multi-region AWS infrastructure. You will manage container clusters, implement automated test triggers, and assist senior SREs with observability metrics.',
      requirements: [
        'Hands-on experience with containerization (Docker)',
        'Knowledge of core AWS services (ECS, S3, IAM)',
        'Proficiency in Python or Bash scripting',
        'Comfortable in Linux terminal environments',
      ],
      benefits: ['100% remote within US/Canada', 'Home office budget', 'Comprehensive wellness package', 'Flexible PTO'],
    },
    {
      id: 'job-3',
      title: 'Associate Product Manager (APM)',
      company: 'Stratos Commerce',
      location: 'New York, NY',
      mode: 'Onsite',
      type: 'Full-time',
      experience: 'Entry Level (0-1 yrs)',
      salary: '$85,000 - $105,000',
      posted: '3 days ago',
      matchScore: 89,
      skills: ['Product Strategy', 'SQL', 'A/B Testing', 'Agile', 'Figma'],
      isDrive: true,
      description:
        'Join our APM cohort driving next-generation checkout experiences for over 12M global shoppers. You will conduct user research, write PRDs, run multivariate experiments, and partner with design squads.',
      requirements: [
        'B.S. or B.A. in Computer Science, Business, or related STEM discipline',
        'Strong analytical chops with working knowledge of SQL',
        'Demonstrated leadership in student organizations, hackathons, or internships',
        'Exceptional written and oral communication skills',
      ],
      benefits: ['Rotational mentorship program', 'Commuter benefits', 'Catered lunches', 'Stock option grants'],
    },
    {
      id: 'job-4',
      title: 'Frontend Developer Intern',
      company: 'Luminary Interactive',
      location: 'Austin, TX',
      mode: 'Hybrid',
      type: 'Internship',
      experience: 'Internship (Summer 2027)',
      salary: '$42 - $50 / hr',
      posted: '4 days ago',
      matchScore: 95,
      skills: ['JavaScript', 'React', 'HTML5/CSS3', 'REST APIs', 'Git'],
      isDrive: true,
      description:
        'A 12-week paid engineering internship building real customer-facing features. Every intern is paired with a dedicated Senior Mentor and presents their final shipped project to company leadership.',
      requirements: [
        'Currently pursuing a degree in Computer Science, Software Engineering, or related field',
        'Familiarity with modern JavaScript (ES6+) and React',
        'Passionate about UI/UX polish and web performance',
        'Minimum CGPA of 7.5 or equivalent',
      ],
      benefits: ['Competitive hourly stipend', 'Housing assistance for non-local interns', 'Full-time return offer potential', 'Weekly tech talks'],
    },
    {
      id: 'job-5',
      title: 'Data Analyst — University Placement Drive',
      company: 'FinMetrics Global',
      location: 'Chicago, IL',
      mode: 'Hybrid',
      type: 'Full-time',
      experience: 'Entry Level (0-2 yrs)',
      salary: '$80,000 - $98,000',
      posted: 'Just now',
      matchScore: 94,
      skills: ['SQL', 'Python', 'PowerBI', 'Tableau', 'Excel Modeling'],
      isDrive: true,
      description:
        'Campus recruitment drive open to partnering universities. Build automated financial modeling dashboards, analyze transaction risk patterns, and present insights to executive risk committees.',
      requirements: [
        'Graduating senior or recent graduate in Finance, Statistics, Economics, or CS',
        'Proficiency in complex SQL queries, window functions, and joins',
        'Experience building interactive dashboards in Tableau or PowerBI',
        'Verified academic standing with zero active backlogs',
      ],
      benefits: ['Sign-on bonus', 'Performance-based annual bonus', 'Student loan repayment assistance', 'Comprehensive medical coverage'],
    },
    {
      id: 'job-6',
      title: 'Backend Systems Engineer',
      company: 'Krypton Data Networks',
      location: 'Remote',
      mode: 'Remote',
      type: 'Full-time',
      experience: 'Mid Level (2-4 yrs)',
      salary: '$120,000 - $145,000',
      posted: '5 days ago',
      matchScore: 88,
      skills: ['Go', 'Distributed Systems', 'Kafka', 'PostgreSQL', 'Kubernetes'],
      isDrive: false,
      description:
        'Develop event-driven ingestion pipelines capable of handling 50k events per second. You will implement distributed locking, tune Postgres query plans, and deploy robust microservices in Go.',
      requirements: [
        '2+ years backend engineering experience in Go or Java',
        'Deep understanding of distributed consensus, message queues, and indexing',
        'Experience deploying services onto Kubernetes clusters',
        'InsightResume score >= 90',
      ],
      benefits: ['Equity package', 'Unlimited PTO policy', 'Home gym allowance', 'Company sponsored conference attendance'],
    },
  ];

  // Filter logic
  const filteredJobs = useMemo(() => {
    return jobsData.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole =
        selectedRole === 'all' ||
        (selectedRole === 'engineering' && (job.title.includes('Engineer') || job.title.includes('Developer'))) ||
        (selectedRole === 'product' && job.title.includes('Product')) ||
        (selectedRole === 'data' && job.title.includes('Data'));

      const matchesMode =
        selectedMode === 'all' || job.mode.toLowerCase() === selectedMode.toLowerCase();

      const matchesExp =
        selectedExp === 'all' ||
        (selectedExp === 'entry' && job.experience.includes('Entry')) ||
        (selectedExp === 'intern' && job.experience.includes('Internship')) ||
        (selectedExp === 'mid' && job.experience.includes('Mid'));

      return matchesSearch && matchesRole && matchesMode && matchesExp;
    });
  }, [jobsData, searchQuery, selectedRole, selectedMode, selectedExp]);

  const toggleSaveJob = (id) => {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-white text-neutral-900">
      {/* ─────────────────────────────────────────────────────────────
          Hero Section
          ───────────────────────────────────────────────────────────── */}
      <section className="pt-12 pb-14 md:pt-18 md:pb-20 border-b border-neutral-200 bg-neutral-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="info" size="sm" className="mb-4">
            Verified Opportunities
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Find roles tailored to your verified skill profile.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Discover direct openings from verified employers and campus placement drives. Apply in one click with your ATS-optimized InsightResume.
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 text-neutral-400 w-5 h-5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by role, company, or technical skill (e.g. React, Python, Product)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-neutral-900 pl-11 pr-4 py-3 text-sm rounded-lg border border-neutral-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Filters & Listings
          ───────────────────────────────────────────────────────────── */}
      <section className="py-12 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-200 mb-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                <Filter size={14} /> Filter:
              </span>

              {/* Role filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="text-xs bg-white border border-neutral-200 rounded-md py-1.5 px-3 font-medium text-neutral-700 hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All Roles</option>
                <option value="engineering">Software Engineering</option>
                <option value="product">Product Management</option>
                <option value="data">Data & Analytics</option>
              </select>

              {/* Work Mode */}
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="text-xs bg-white border border-neutral-200 rounded-md py-1.5 px-3 font-medium text-neutral-700 hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All Work Modes</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>

              {/* Experience */}
              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="text-xs bg-white border border-neutral-200 rounded-md py-1.5 px-3 font-medium text-neutral-700 hover:border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="all">All Experience Levels</option>
                <option value="intern">Internships</option>
                <option value="entry">Entry Level (0-2 yrs)</option>
                <option value="mid">Mid Level (2-4 yrs)</option>
              </select>
            </div>

            <div className="text-xs text-neutral-500">
              Showing <span className="font-bold text-neutral-900">{filteredJobs.length}</span> verified opportunities
            </div>
          </div>

          {/* Campus Placement Callout */}
          <div className="mb-8 p-4 bg-primary-50/70 border border-primary-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-600 text-white flex items-center justify-center shrink-0">
                <GraduationCap size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900">Are you a university student?</h4>
                <p className="text-xs text-neutral-600 mt-0.5">
                  Sign in with your university credentials to unlock campus-exclusive placement drives and pre-filtered shortlist statuses.
                </p>
              </div>
            </div>
            <Link to={ROUTES.LOGIN} className="shrink-0">
              <Button size="sm" variant="primary">
                Sign In to Campus Portal
              </Button>
            </Link>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const isSaved = savedJobs.has(job.id);
              return (
                <Card
                  key={job.id}
                  className="flex flex-col justify-between hover:border-neutral-300 transition-all shadow-xs"
                >
                  <Card.Content className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-neutral-500">{job.company}</span>
                          {job.isDrive && (
                            <Badge variant="info" size="sm">Campus Drive</Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-base text-neutral-900 mt-1">{job.title}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSaveJob(job.id)}
                        className={`p-1.5 rounded-md hover:bg-neutral-100 transition-colors ${
                          isSaved ? 'text-primary-600' : 'text-neutral-400'
                        }`}
                        aria-label="Save Job"
                      >
                        <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-neutral-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin size={13} className="text-neutral-400" />
                        {job.location} ({job.mode})
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={13} className="text-neutral-400" />
                        {job.salary}
                      </span>
                    </div>

                    {/* Description preview */}
                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                      {job.description}
                    </p>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 font-mono">
                          +{job.skills.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Match Score */}
                    <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <Sparkles size={13} className="text-primary-600" /> Skill Alignment:
                      </span>
                      <span className="font-bold font-mono text-success-700">{job.matchScore}% Match</span>
                    </div>
                  </Card.Content>

                  <Card.Footer className="p-6 pt-0 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => setActiveJobModal(job)}
                    >
                      View Details
                    </Button>
                    <Link to={ROUTES.LOGIN} className="w-full">
                      <Button variant="primary" size="sm" fullWidth rightIcon={<ArrowRight size={13} />}>
                        Apply
                      </Button>
                    </Link>
                  </Card.Footer>
                </Card>
              );
            })}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-16 bg-neutral-50 rounded-xl border border-neutral-200">
              <Briefcase size={32} className="mx-auto text-neutral-400 mb-3" />
              <h3 className="font-bold text-base text-neutral-900">No matching jobs found</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Try adjusting your search query or relaxing your filter selections.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRole('all');
                  setSelectedMode('all');
                  setSelectedExp('all');
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Job Detail Modal
          ───────────────────────────────────────────────────────────── */}
      {activeJobModal && (
        <Modal
          isOpen={Boolean(activeJobModal)}
          onClose={() => setActiveJobModal(null)}
          size="lg"
        >
          <ModalHeader onClose={() => setActiveJobModal(null)}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-neutral-500">{activeJobModal.company}</span>
                {activeJobModal.isDrive && <Badge variant="info" size="sm">Campus Drive</Badge>}
              </div>
              <h3 className="font-bold text-lg text-neutral-900">{activeJobModal.title}</h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 mt-2">
                <span>{activeJobModal.location} ({activeJobModal.mode})</span>
                <span>•</span>
                <span>{activeJobModal.salary}</span>
                <span>•</span>
                <span>{activeJobModal.type}</span>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="space-y-5 text-xs text-neutral-700">
            <div>
              <h4 className="font-bold text-neutral-900 text-sm mb-1.5">Role Overview</h4>
              <p className="leading-relaxed text-neutral-600">{activeJobModal.description}</p>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 text-sm mb-2">Key Requirements & Eligibility</h4>
              <ul className="space-y-1.5">
                {activeJobModal.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-neutral-600">
                    <CheckCircle2 size={14} className="text-success-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 text-sm mb-2">Required Skills & Taxonomies</h4>
              <div className="flex flex-wrap gap-1.5">
                {activeJobModal.skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded bg-neutral-100 text-neutral-800 font-mono text-[11px]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-neutral-900 text-sm mb-2">Perks & Compensation</h4>
              <div className="grid grid-cols-2 gap-2">
                {activeJobModal.benefits.map((b, i) => (
                  <div key={i} className="p-2 bg-neutral-50 rounded border border-neutral-100 text-neutral-600">
                    • {b}
                  </div>
                ))}
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" size="sm" onClick={() => setActiveJobModal(null)}>
              Close
            </Button>
            <Link to={ROUTES.LOGIN}>
              <Button size="sm" rightIcon={<ArrowRight size={14} />}>
                Apply with InsightResume
              </Button>
            </Link>
          </ModalFooter>
        </Modal>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Call to Action
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900">
            Hiring companies choose InsightResume candidates.
          </h2>
          <p className="mt-3 text-sm text-neutral-600 max-w-xl mx-auto">
            Build your ATS-optimized resume and verify your skill credentials to rank in the top 5% of candidate applicant pools.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to={ROUTES.REGISTER}>
              <Button size="lg" rightIcon={<ArrowRight size={16} />}>
                Create Your Profile Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
