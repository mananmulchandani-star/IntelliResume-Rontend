// src/features/public/pages/CompanyPartnerPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Card, CardContent, Button, Input, Select, Badge } from '../../../components/ui';
import { Textarea } from '../../../components/ui/Input';
import adminStorage from '../../admin/services/adminStorage';
import {
  Building2,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  Briefcase,
  Target,
  Send,
  Sparkles,
} from 'lucide-react';

export default function CompanyPartnerPage() {
  const [formData, setFormData] = useState({
    name: '',
    industry: 'Software & Artificial Intelligence',
    corporateDomains: '',
    recruiterName: '',
    recruiterTitle: 'Talent Acquisition Lead',
    recruiterEmail: '',
    phone: '',
    headquarters: '',
    hiringVolume: '10-50',
    hiringModel: 'Hybrid (Campus Drives + Off-Campus)',
    targetRoles: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.recruiterEmail) return;

    setLoading(true);

    setTimeout(() => {
      const code = `CMP-REF-${Math.floor(100000 + Math.random() * 900000)}`;
      setRefCode(code);

      // Save into real adminStorage pipeline
      adminStorage.addCompany({
        name: formData.name,
        logo: '🏢',
        industry: formData.industry,
        headquarters: formData.headquarters || 'Remote / Worldwide',
        corporateDomains: formData.corporateDomains
          ? formData.corporateDomains.split(',').map((d) => d.trim()).filter(Boolean)
          : [formData.recruiterEmail.split('@')[1] || 'company.com'],
        recruiterName: formData.recruiterName,
        recruiterTitle: formData.recruiterTitle,
        recruiterEmail: formData.recruiterEmail,
        phone: formData.phone || '+1 (555) 000-0000',
        status: 'pending',
        notes: `Target roles: ${formData.targetRoles || 'All Tech'} • Volume: ${formData.hiringVolume} • Model: ${formData.hiringModel}. ${formData.notes}`,
      });

      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={ROUTES.HOME}
            className="text-xs font-semibold text-neutral-500 hover:text-primary-600 transition-colors"
          >
            &larr; Back to Home
          </Link>
          <Badge variant="secondary" size="sm">
            Employer Partnerships
          </Badge>
        </div>

        {submitted ? (
          <Card className="border border-emerald-200 bg-white shadow-md p-8 sm:p-10 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              Employer Registration Submitted
            </h2>

            <p className="mt-3 text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
              Thank you, <strong className="text-neutral-900">{formData.recruiterName || 'Talent Partner'}</strong>. Your hiring partner application for{' '}
              <strong className="text-neutral-900">{formData.name}</strong> has been queued for verification.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200 max-w-sm mx-auto">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Employer Reference ID
              </span>
              <span className="font-mono text-base font-bold text-neutral-900">{refCode}</span>
            </div>

            <p className="mt-4 text-xs text-neutral-500">
              Our Corporate Relations Desk will verify your corporate domain and activate your direct candidate pipeline access within 24 hours.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    industry: 'Software & Artificial Intelligence',
                    corporateDomains: '',
                    recruiterName: '',
                    recruiterTitle: 'Talent Acquisition Lead',
                    recruiterEmail: '',
                    phone: '',
                    headquarters: '',
                    hiringVolume: '10-50',
                    hiringModel: 'Hybrid (Campus Drives + Off-Campus)',
                    targetRoles: '',
                    notes: '',
                  });
                }}
              >
                Submit Another Company
              </Button>
              <Link to={ROUTES.HOME}>
                <Button variant="outline">Return to Home</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="border border-neutral-200 bg-white shadow-md overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-950 p-6 sm:p-8 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Partner as a Hiring Employer
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
                Connect with pre-verified engineering and business graduates, coordinate campus placement drives, and hire talent with zero screening friction.
              </p>
            </div>

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-150 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary-600" />
                    1. Company Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Input
                        label="Company / Enterprise Name *"
                        placeholder="e.g. Stripe, Razorpay, or TechFlow"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                      />
                    </div>

                    <Select
                      label="Industry Sector"
                      value={formData.industry}
                      onChange={(e) => handleChange('industry', e.target.value)}
                      options={[
                        { value: 'Software & Artificial Intelligence', label: 'Software, SaaS & Artificial Intelligence' },
                        { value: 'Banking & Financial Technology', label: 'Banking, Fintech & Payments' },
                        { value: 'E-commerce & Consumer Tech', label: 'E-commerce & Consumer Tech' },
                        { value: 'Consulting & Professional Services', label: 'Consulting & Analytics' },
                        { value: 'Hardware & Core Engineering', label: 'Hardware, Automotive & Core Engineering' },
                        { value: 'Healthcare & Biotech', label: 'Healthcare & Biotech' },
                      ]}
                    />

                    <Input
                      label="Corporate Website / Domain"
                      placeholder="e.g. stripe.com"
                      value={formData.corporateDomains}
                      onChange={(e) => handleChange('corporateDomains', e.target.value)}
                    />

                    <Input
                      label="Headquarters / Office Location *"
                      placeholder="e.g. Bangalore, India or San Francisco, CA"
                      value={formData.headquarters}
                      onChange={(e) => handleChange('headquarters', e.target.value)}
                      required
                    />

                    <Select
                      label="Expected Early Talent Hiring Volume"
                      value={formData.hiringVolume}
                      onChange={(e) => handleChange('hiringVolume', e.target.value)}
                      options={[
                        { value: '1-10', label: '1 - 10 Hires / Year' },
                        { value: '10-50', label: '10 - 50 Hires / Year' },
                        { value: '50-200', label: '50 - 200 Hires / Year' },
                        { value: '200+', label: '200+ Hires (High-Volume Campus Recruiter)' },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-150 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-600" />
                    2. Primary Talent Partner / Recruiter Contact
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Recruiter Full Name *"
                      placeholder="Sarah Jenkins"
                      value={formData.recruiterName}
                      onChange={(e) => handleChange('recruiterName', e.target.value)}
                      required
                    />

                    <Input
                      label="Job Title / Designation"
                      placeholder="Campus Talent Acquisition Lead"
                      value={formData.recruiterTitle}
                      onChange={(e) => handleChange('recruiterTitle', e.target.value)}
                    />

                    <Input
                      label="Corporate Work Email *"
                      type="email"
                      placeholder="recruiter@company.com"
                      value={formData.recruiterEmail}
                      onChange={(e) => handleChange('recruiterEmail', e.target.value)}
                      required
                    />

                    <Input
                      label="Direct Contact Phone *"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-150 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary-600" />
                    3. Target Roles & Requirements
                  </h3>

                  <div className="space-y-4">
                    <Input
                      label="Target Roles / Tech Stacks (Optional)"
                      placeholder="e.g. Full Stack (React/Node), Machine Learning, Cloud DevOps, Product Analysts"
                      value={formData.targetRoles}
                      onChange={(e) => handleChange('targetRoles', e.target.value)}
                    />

                    <Textarea
                      label="Hiring Needs / Special Requirements (Optional)"
                      rows={3}
                      placeholder="Describe hiring timelines, package ranges (CTC), or targeted university tiers..."
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-150 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                    <span>Verified corporate domain matching</span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Submit Company Details
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
