import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand info column */}
          <div className="col-span-2 space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white tracking-tight">
                Insight<span className="text-primary-400">Resume</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              An intelligent career and campus recruitment ecosystem connecting students, universities, and leading employers through AI resume intelligence, ATS optimization, and structured placement drives.
            </p>
            <div className="pt-2 text-xs text-neutral-500">
              Built with precision for next-generation talent & enterprise recruitment.
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={ROUTES.AI_RESUME_BUILDER} className="hover:text-white transition-colors">
                  AI Resume Builder
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ATS_CHECKER} className="hover:text-white transition-colors">
                  ATS Score Checker
                </Link>
              </li>
              <li>
                <Link to={ROUTES.JOB_DISCOVERY} className="hover:text-white transition-colors">
                  Job & Internship Portal
                </Link>
              </li>
              <li>
                <Link to={ROUTES.FEATURES} className="hover:text-white transition-colors">
                  Platform Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Student Resources links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Student Hub</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={ROUTES.AI_RESUME_BUILDER} className="hover:text-white transition-colors">
                  AI Resume Assistant
                </Link>
              </li>
              <li>
                <Link to={ROUTES.ATS_CHECKER} className="hover:text-white transition-colors">
                  ATS Optimization Engine
                </Link>
              </li>
              <li>
                <Link to={ROUTES.REGISTER} className="hover:text-white transition-colors">
                  Create Student Account
                </Link>
              </li>
              <li>
                <Link to={ROUTES.LOGIN} className="hover:text-white transition-colors">
                  Student Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={ROUTES.ABOUT} className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CONTACT} className="hover:text-white transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link to={ROUTES.FAQ} className="hover:text-white transition-colors">
                  FAQ & Knowledge Base
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRIVACY} className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} InsightResume Platform. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to={ROUTES.PRIVACY} className="hover:text-neutral-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to={ROUTES.CONTACT} className="hover:text-neutral-400 transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
