// src/features/student/pages/JobPortal.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { jobService } from '../../../services/api';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Button, Card, Badge, Input, Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/ui';
import {
  Briefcase,
  Search,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  CheckCircle2,
  Bookmark,
  Share2,
  Send,
  ExternalLink,
  Filter,
  Sparkles,
  Award,
} from 'lucide-react';

const SAMPLE_OPPORTUNITIES = [
  {
    id: 'job-1',
    title: 'Frontend Software Engineering Intern (Summer 2026)',
    company: 'Stripe',
    logo: 'S',
    logoBg: 'bg-indigo-600',
    location: 'San Francisco, CA (Hybrid)',
    type: 'Internship',
    salary: '$58 - $68 / hr',
    deadline: '2026-05-15',
    isCampusDrive: true,
    skills: ['React', 'TypeScript', 'JavaScript', 'TailwindCSS'],
    description: `Join Stripe's frontend engineering organization to develop financial infrastructure for the internet. You will build user-facing dashboards, payment components, and checkout flows utilized by millions of businesses globally.`,
    requirements: [
      'Currently pursuing a B.S. or M.S. in Computer Science or related STEM field',
      'Solid foundations in React, modern JavaScript/TypeScript, and web fundamentals',
      'Strong problem-solving skills and passion for accessible, high-performance UI',
    ],
  },
  {
    id: 'job-2',
    title: 'Full Stack Product Engineer',
    company: 'Linear',
    logo: 'L',
    logoBg: 'bg-neutral-900',
    location: 'Remote (US/EU)',
    type: 'Full-time',
    salary: '$135,000 - $160,000',
    deadline: '2026-06-01',
    isCampusDrive: false,
    skills: ['React', 'Node.js', 'TypeScript', 'GraphQL'],
    description: `Linear is looking for product engineers who care deeply about craft, speed, and keyboard-first workflows. You will architect end-to-end features, optimize client synchronization, and deliver frictionless developer tools.`,
    requirements: [
      'Experience building modern web apps with TypeScript, React, and Node.js',
      'Demonstrated high taste for interface micro-interactions and performance',
      'Clear written communicator with ownership mindset',
    ],
  },
  {
    id: 'job-3',
    title: 'Distributed Systems & Cloud Intern',
    company: 'Cloudflare',
    logo: 'C',
    logoBg: 'bg-amber-600',
    location: 'Austin, TX / San Francisco, CA',
    type: 'Internship',
    salary: '$55 - $65 / hr',
    deadline: '2026-04-30',
    isCampusDrive: true,
    skills: ['Go', 'Python', 'Docker', 'Linux'],
    description: `Work directly on Cloudflare’s global edge network that serves over 20% of global web traffic. You will write high-concurrency network servers and automated diagnostic tooling.`,
    requirements: [
      'Understanding of networking protocols (TCP/IP, HTTP/3, DNS)',
      'Proficiency in Go, C++, or Rust',
      'Comfort with Linux systems engineering',
    ],
  },
  {
    id: 'job-4',
    title: 'Junior Machine Learning Engineer',
    company: 'Anthropic',
    logo: 'A',
    logoBg: 'bg-amber-700',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$140,000 - $175,000',
    deadline: '2026-05-20',
    isCampusDrive: false,
    skills: ['Python', 'PyTorch', 'SQL', 'Docker'],
    description: `Help build safe, reliable, and steerable AI systems. You will collaborate on training pipelines, evaluation datasets, and real-time model telemetry.`,
    requirements: [
      'Solid command of Python, PyTorch, and deep learning architectures',
      'Experience analyzing and curating large-scale datasets',
      'Passion for AI safety research and responsible deployment',
    ],
  },
  {
    id: 'job-5',
    title: 'Campus Placement - Software Engineer',
    company: 'Microsoft',
    logo: 'M',
    logoBg: 'bg-blue-600',
    location: 'Redmond, WA',
    type: 'Campus Drive',
    salary: '$125,000 - $145,000',
    deadline: '2026-04-15',
    isCampusDrive: true,
    skills: ['C#', 'React', 'Python', 'SQL'],
    description: `Exclusive University Campus Drive for upcoming graduating seniors. Opportunities across Azure, Developer Division, Windows, and Office engineering teams.`,
    requirements: [
      'Graduating batch of 2026 with minimum 3.5 CGPA/GPA',
      'Core proficiency in data structures, algorithms, and object-oriented design',
    ],
  },
];

export default function JobPortal() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState(SAMPLE_OPPORTUNITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [activeJobDetails, setActiveJobDetails] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [verifiedSkills, setVerifiedSkills] = useState([]);

  useEffect(() => {
    try {
      // 1. Fetch verified skills
      const savedSkills = localStorage.getItem('verifiedSkills');
      if (savedSkills) setVerifiedSkills(JSON.parse(savedSkills));

      // 2. Fetch applied jobs
      const savedApps = localStorage.getItem('jobApplications');
      if (savedApps) {
        const parsed = JSON.parse(savedApps);
        setAppliedJobs(parsed.map((a) => a.company));
      }

      // 3. Try backend job service
      jobService.getJobs()
        .then((res) => {
          if (Array.isArray(res) && res.length > 0) setJobs(res);
        })
        .catch((err) => {
          console.warn('Backend jobs endpoint fallback to sample opportunities:', err);
        });
    } catch (e) {
      console.error('JobPortal initialization error:', e);
    }
  }, []);

  const handleApply = (job) => {
    setIsApplying(true);

    setTimeout(() => {
      try {
        const resume = JSON.parse(localStorage.getItem('currentResume') || '{}');
        const newApp = {
          id: `app-${Date.now()}`,
          company: job.company,
          position: job.title,
          location: job.location,
          status: 'Applied',
          appliedDate: new Date().toISOString().split('T')[0],
          salary: job.salary,
          resumeTitle: resume.title || 'InsightResume Default',
        };

        const existingApps = JSON.parse(localStorage.getItem('jobApplications') || '[]');
        const updated = [newApp, ...existingApps];
        localStorage.setItem('jobApplications', JSON.stringify(updated));

        setAppliedJobs((prev) => [...prev, job.company]);
        setActiveJobDetails(null);
      } catch (err) {
        console.error('Error applying to job:', err);
      } finally {
        setIsApplying(false);
      }
    }, 800);
  };

  // Filter jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesQuery =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedType === 'All' ||
      job.type.toLowerCase() === selectedType.toLowerCase() ||
      (selectedType === 'Campus Drive' && job.isCampusDrive);

    return matchesQuery && matchesType;
  });

  return (
    <DashboardLayout
      title="Opportunities & Placement Drives"
      subtitle="Discover verified roles, match your skills, and apply with your ATS-certified resume."
      actions={
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Briefcase className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.APPLICATION_TRACKER)}
        >
          View My Applications ({appliedJobs.length})
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Input
              leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
              placeholder="Search by job title, tech stack, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
            {['All', 'Internship', 'Full-time', 'Campus Drive'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const hasApplied = appliedJobs.includes(job.company);

            // Calculate skill match
            const matchedSkills = job.skills.filter((sk) =>
              verifiedSkills.some((v) => v.toLowerCase() === sk.toLowerCase())
            );
            const matchPercent = Math.round((matchedSkills.length / job.skills.length) * 100);

            return (
              <Card
                key={job.id}
                className="p-5 border-neutral-200 shadow-xs flex flex-col justify-between hover:border-neutral-300 hover:shadow-sm transition-all"
              >
                <div className="space-y-3">
                  {/* Top Bar: Company & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl ${job.logoBg} text-white font-black text-base flex items-center justify-center shrink-0 shadow-2xs`}
                      >
                        {job.logo}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 leading-tight">
                          {job.title}
                        </h4>
                        <p className="text-xs text-neutral-500 font-medium">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    {job.isCampusDrive && (
                      <Badge variant="info" size="sm">
                        Campus Drive
                      </Badge>
                    )}
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1 font-mono font-medium text-neutral-800">
                      <DollarSign className="w-3.5 h-3.5 text-neutral-400" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                      Apply by {job.deadline}
                    </span>
                  </div>

                  {/* Brief Excerpt */}
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {job.skills.map((skill) => {
                      const isVerified = verifiedSkills.some(
                        (v) => v.toLowerCase() === skill.toLowerCase()
                      );
                      return (
                        <span
                          key={skill}
                          className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded font-medium ${
                            isVerified
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {skill}
                          {isVerified && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {matchPercent >= 60 ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        {matchPercent}% Skills Matched
                      </span>
                    ) : (
                      `${matchPercent}% match`
                    )}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setActiveJobDetails(job)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant={hasApplied ? 'secondary' : 'primary'}
                      size="sm"
                      disabled={hasApplied}
                      onClick={() => handleApply(job)}
                    >
                      {hasApplied ? 'Applied ✓' : '1-Click Apply'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Job Details Modal Drawer */}
      {activeJobDetails && (
        <Modal
          isOpen={Boolean(activeJobDetails)}
          onClose={() => setActiveJobDetails(null)}
          size="lg"
        >
          <ModalHeader onClose={() => setActiveJobDetails(null)} showCloseButton={true}>
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg ${activeJobDetails.logoBg} text-white font-black text-sm flex items-center justify-center`}
              >
                {activeJobDetails.logo}
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 leading-tight">
                  {activeJobDetails.title}
                </h3>
                <p className="text-xs text-neutral-500">
                  {activeJobDetails.company} • {activeJobDetails.location}
                </p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="space-y-5 p-6">
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="default">{activeJobDetails.type}</Badge>
              <Badge variant="success">{activeJobDetails.salary}</Badge>
              {activeJobDetails.isCampusDrive && (
                <Badge variant="info">University Campus Placement</Badge>
              )}
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                Role Overview
              </h4>
              <p className="text-xs leading-relaxed text-neutral-700">
                {activeJobDetails.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                Key Requirements
              </h4>
              <ul className="list-disc list-inside space-y-1 text-xs text-neutral-700">
                {activeJobDetails.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2">
                Required Technical Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activeJobDetails.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 text-xs bg-neutral-100 text-neutral-800 rounded font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="flex justify-between items-center">
            <Button variant="ghost" onClick={() => setActiveJobDetails(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              isLoading={isApplying}
              disabled={appliedJobs.includes(activeJobDetails.company)}
              leftIcon={<Send className="w-4 h-4" />}
              onClick={() => handleApply(activeJobDetails)}
            >
              {appliedJobs.includes(activeJobDetails.company)
                ? 'Already Applied'
                : 'Submit Application with InsightResume'}
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </DashboardLayout>
  );
}
