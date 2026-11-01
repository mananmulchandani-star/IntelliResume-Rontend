import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Badge, Input } from '../../../components/ui';
import {
  Search,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Sparkles,
  ArrowRight,
  MessageSquare,
  FileQuestion,
} from 'lucide-react';

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'builder', label: 'AI Resume Builder' },
    { id: 'ats', label: 'ATS Scoring' },
    { id: 'university', label: 'Universities & Placement' },
    { id: 'recruiter', label: 'Recruiters & Employers' },
    { id: 'privacy', label: 'Privacy & Security' },
  ];

  const faqData = [
    {
      id: 1,
      category: 'builder',
      q: 'How does InsightResume rewrite bullet points using the Google XYZ formula?',
      a: 'The Google XYZ formula stipulates that every impactful career milestone should read: "Accomplished [X], as measured by [Y], by doing [Z]". Our AI analyzes your raw input, identifies the core action, requests or infers appropriate scope metrics (latency, revenue, users, percentages), and reconstructs the phrasing in active voice with domain-specific keywords.',
    },
    {
      id: 2,
      category: 'ats',
      q: 'What is deterministic ATS scoring and why is it superior to generic percentages?',
      a: 'Generic resume tools give arbitrary scores based purely on character counts or basic dictionary keyword matching. InsightResume simulates the actual parsing engines utilized by Workday, Taleo, Greenhouse, and Lever. We check document OCR parseability, single-column alignment, section header taxonomy adherence, and semantic token extraction.',
    },
    {
      id: 3,
      category: 'builder',
      q: 'Can I export my resume as a PDF for free?',
      a: 'Yes. Every user has full access to export pixel-perfect, vector-rendered A4/Letter PDF files with zero watermarks and zero subscription paywalls.',
    },
    {
      id: 4,
      category: 'university',
      q: 'How do universities onboard student cohorts into InsightResume?',
      a: 'Placement cells can bulk-upload thousands of student records using standard CSV files exported from their registrar database. The platform automatically sets up student profiles with verified CGPA, department, roll numbers, and active backlog records.',
    },
    {
      id: 5,
      category: 'university',
      q: 'Can placement cells prevent students from modifying their CGPA or academic records?',
      a: 'Yes. Profile locking features ensure that verified registrar metrics (such as CGPA, branch, and backlog status) can only be updated by authorized university placement coordinators. This eliminates credential fraud during campus recruitment.',
    },
    {
      id: 6,
      category: 'ats',
      q: 'Why does InsightResume avoid multi-column templates and graphical rating bars?',
      a: 'Most commercial applicant tracking systems read text sequentially from left to right across the page. When parsing multi-column layouts, parsers frequently merge text from Column 1 into Column 2, completely corrupting work history timelines. Graphical skill bars (like 4/5 circles) are invisible to ATS algorithms and waste valuable real estate.',
    },
    {
      id: 7,
      category: 'recruiter',
      q: 'How does candidate skill verification work for recruiters?',
      a: 'Candidates can complete 10-minute adaptive technical and domain assessments. Our proctoring suite enforces tab-lock and time-limits. When candidates score 80% or above, an immutable verification badge is stamped onto their profile and exported resume.',
    },
    {
      id: 8,
      category: 'privacy',
      q: 'Is my resume data or personal information used to train public AI models?',
      a: 'No. InsightResume maintains a strict zero-retention data sovereignty policy. We never contribute candidate resumes, academic transcripts, or personal identifying information to training weights for OpenAI, Anthropic, or any public foundational models.',
    },
    {
      id: 9,
      category: 'recruiter',
      q: 'Can companies run campus drives across multiple colleges simultaneously?',
      a: 'Yes. Enterprise recruiters can create unified campus drives, establish global eligibility cutoffs, and invite multiple partnering universities to participate concurrently through one consolidated dashboard.',
    },
    {
      id: 10,
      category: 'privacy',
      q: 'Is the platform compliant with FERPA and global privacy regulations?',
      a: 'Yes. We adhere strictly to Family Educational Rights and Privacy Act (FERPA) regulations regarding student educational records, and maintain AES-256 encryption at rest, TLS 1.3 in transit, and GDPR data subject portability.',
    },
    {
      id: 11,
      category: 'builder',
      q: 'Can I create multiple targeted resumes for different job positions?',
      a: 'Absolutely. You can maintain multiple resume versions in your student workspace (for example, one targeted at Frontend Engineering, another at Cloud DevOps) and tailor keywords specific to each target job listing.',
    },
    {
      id: 12,
      category: 'university',
      q: 'How does automated placement drive gating work?',
      a: 'When an employer specifies criteria (e.g. CS or IT only, minimum CGPA 7.5, zero active backlogs), InsightResume automatically evaluates student profiles upon application. Eligible students are approved instantly, and ineligible students receive transparent feedback on unmet criteria.',
    },
  ];

  const toggleAccordion = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredFaqs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesQuery =
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [faqData, searchQuery, selectedCategory]);

  return (
    <div className="bg-white text-neutral-900">
      {/* ─────────────────────────────────────────────────────────────
          Hero Section
          ───────────────────────────────────────────────────────────── */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-200 bg-neutral-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="info" size="sm" className="mb-4">
            Knowledge Base & FAQ
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            Frequently Asked Questions
          </h1>
          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about our deterministic ATS scoring engine, AI resume optimization, campus placement portals, and data sovereignty.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <Search className="absolute left-3.5 top-3.5 text-neutral-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search questions or keywords (e.g. ATS, FERPA, PDF, CSV, Quizzes)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-neutral-900 pl-10 pr-4 py-3 text-sm rounded-lg border border-neutral-300 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-neutral-400"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Category Filter Bar
          ───────────────────────────────────────────────────────────── */}
      <section className="py-6 border-b border-neutral-200 bg-white sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'text-neutral-600 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Accordion List
          ───────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openItems.has(faq.id);
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between text-sm font-semibold text-neutral-900 hover:text-primary-600 transition-colors cursor-pointer"
                  >
                    <span className="pr-4">{faq.q}</span>
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

          {filteredFaqs.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-neutral-200">
              <FileQuestion size={32} className="mx-auto text-neutral-400 mb-3" />
              <h3 className="font-bold text-base text-neutral-900">No matching questions found</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching for different keywords or select "All Questions".
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Reset Search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Still Have Questions CTA
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
            Still have questions?
          </h2>
          <p className="mt-2 text-sm text-neutral-600 max-w-md mx-auto">
            Our team is available to assist students, university administrators, and hiring partners.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to={ROUTES.CONTACT}>
              <Button size="md" rightIcon={<ArrowRight size={15} />}>
                Contact Support Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
