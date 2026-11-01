import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Badge } from '../../../components/ui';
import {
  FileQuestion,
  Home,
  Sparkles,
  Search,
  Building2,
  Users,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  const quickLinks = [
    {
      title: 'AI Resume Builder',
      desc: 'Build or optimize your ATS-ready resume with AI quantification.',
      href: ROUTES.AI_RESUME_BUILDER,
      icon: <Sparkles size={16} className="text-primary-600" />,
    },
    {
      title: 'ATS Score Checker',
      desc: 'Simulate your resume against Workday, Greenhouse & Taleo.',
      href: ROUTES.ATS_CHECKER,
      icon: <Search size={16} className="text-primary-600" />,
    },
    {
      title: 'Verified Job Discovery',
      desc: 'Browse entry-level roles and campus recruitment opportunities.',
      href: ROUTES.JOB_DISCOVERY,
      icon: <Search size={16} className="text-primary-600" />,
    },
    {
      title: 'University Solutions',
      desc: 'Campus placement drive management and batch student rosters.',
      href: ROUTES.UNIVERSITY_SOLUTIONS,
      icon: <Building2 size={16} className="text-primary-600" />,
    },
    {
      title: 'Recruiter Sourcing',
      desc: 'Access verified candidate pools with proctored skill tests.',
      href: ROUTES.COMPANY_SOLUTIONS,
      icon: <Users size={16} className="text-primary-600" />,
    },
    {
      title: 'Help & Knowledge Base',
      desc: 'Frequently asked questions, platform guides, and tutorials.',
      href: ROUTES.FAQ,
      icon: <FileQuestion size={16} className="text-primary-600" />,
    },
  ];

  return (
    <div className="bg-white text-neutral-900 min-h-[75vh] flex flex-col justify-center py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Error Badge */}
        <Badge variant="error" size="sm" className="mb-4">
          Error 404 • Page Not Found
        </Badge>

        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 leading-tight">
          Lost in the career pipeline?
        </h1>

        <p className="mt-4 text-sm sm:text-base text-neutral-600 max-w-lg mx-auto leading-relaxed">
          The requested URL does not exist or has been relocated. Choose an option below to return to verified ground.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft size={15} />}
          >
            Go Back
          </Button>
          <Link to={ROUTES.HOME}>
            <Button size="md" rightIcon={<Home size={15} />}>
              Return to Homepage
            </Button>
          </Link>
        </div>

        {/* Popular Navigation Destinations */}
        <div className="mt-16 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-4 text-center">
            Or Explore Key Platform Destinations
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((link, idx) => (
              <Link
                key={idx}
                to={link.href}
                className="group p-3.5 rounded-lg border border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300 transition-all flex items-start gap-3"
              >
                <div className="p-2 rounded-md bg-white border border-neutral-200 group-hover:border-neutral-300 shrink-0">
                  {link.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900 group-hover:text-primary-600 transition-colors flex items-center gap-1">
                    {link.title}
                    <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                    {link.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
