// src/features/public/pages/UniversityPartnerPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Card, CardContent, Button, Input, Select, Badge } from '../../../components/ui';
import { Textarea } from '../../../components/ui/Input';
import adminStorage from '../../admin/services/adminStorage';
import {
  GraduationCap,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Award,
  Users,
  Send,
  Sparkles,
} from 'lucide-react';

export default function UniversityPartnerPage() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Autonomous University',
    domain: '',
    deanName: '',
    deanEmail: '',
    phone: '',
    location: '',
    accreditationBoard: 'NAAC A++ / NIRF Top 50',
    batchCapacity: '1500',
    objectives: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [refCode, setRefCode] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.deanEmail) return;

    setLoading(true);

    setTimeout(() => {
      const code = `UNI-REF-${Math.floor(100000 + Math.random() * 900000)}`;
      setRefCode(code);

      // Save into real adminStorage pipeline
      adminStorage.addUniversity({
        name: formData.name,
        domain: formData.domain || `${formData.name.toLowerCase().replace(/[^a-z]/g, '')}.edu`,
        deanName: formData.deanName,
        deanEmail: formData.deanEmail,
        phone: formData.phone || '+91 98000 00000',
        headquarters: formData.location || 'India',
        accreditationBoard: formData.accreditationBoard,
        batchCapacity: Number(formData.batchCapacity) || 1000,
        status: 'pending',
        ranking: 'Submitted via Institutional Partnership Portal',
        notes: formData.objectives || 'Institutional partnership inquiry submitted.',
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
          <Badge variant="primary" size="sm">
            University Partnerships
          </Badge>
        </div>

        {submitted ? (
          <Card className="border border-emerald-200 bg-white shadow-md p-8 sm:p-10 text-center animate-scale-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-black text-neutral-900 tracking-tight">
              Institutional Application Received
            </h2>

            <p className="mt-3 text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
              Thank you, <strong className="text-neutral-900">{formData.deanName || 'Partner'}</strong>. Your university onboarding details for{' '}
              <strong className="text-neutral-900">{formData.name}</strong> have been submitted to our Platform Administration Team.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-neutral-50 border border-neutral-200 max-w-sm mx-auto">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Verification Reference ID
              </span>
              <span className="font-mono text-base font-bold text-neutral-900">{refCode}</span>
            </div>

            <p className="mt-4 text-xs text-neutral-500">
              Our Institutional Onboarding Desk will review accreditation documents and contact your placement cell within 24 business hours.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    type: 'Autonomous University',
                    domain: '',
                    deanName: '',
                    deanEmail: '',
                    phone: '',
                    location: '',
                    accreditationBoard: 'NAAC A++ / NIRF Top 50',
                    batchCapacity: '1500',
                    objectives: '',
                  });
                }}
              >
                Submit Another Institution
              </Button>
              <Link to={ROUTES.HOME}>
                <Button variant="outline">Return to Home</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="border border-neutral-200 bg-white shadow-md overflow-hidden">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-950 p-6 sm:p-8 text-white">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Partner as a University
              </h1>
              <p className="mt-2 text-xs sm:text-sm text-primary-200 max-w-xl leading-relaxed">
                Empower your students with AI resume intelligence, automate campus placement drives, and connect with top hiring partners.
              </p>
            </div>

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-150 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary-600" />
                    1. Institution Details
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Input
                        label="Institution / University Name *"
                        placeholder="e.g. Indian Institute of Technology Delhi"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                      />
                    </div>

                    <Select
                      label="Institution Type"
                      value={formData.type}
                      onChange={(e) => handleChange('type', e.target.value)}
                      options={[
                        { value: 'Autonomous University', label: 'Autonomous University / State University' },
                        { value: 'Institute of National Importance', label: 'Institute of National Importance (IIT/NIT/BITS)' },
                        { value: 'Private Engineering College', label: 'Private Engineering College' },
                        { value: 'Business & Management School', label: 'Business & Management School' },
                        { value: 'Polytechnic / Technical Institute', label: 'Polytechnic / Technical Institute' },
                      ]}
                    />

                    <Input
                      label="Campus Official Domain"
                      placeholder="e.g. iitd.ac.in or university.edu"
                      value={formData.domain}
                      onChange={(e) => handleChange('domain', e.target.value)}
                    />

                    <Input
                      label="Campus City & State *"
                      placeholder="e.g. New Delhi, Delhi"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      required
                    />

                    <Select
                      label="Accreditation / Ranking Board"
                      value={formData.accreditationBoard}
                      onChange={(e) => handleChange('accreditationBoard', e.target.value)}
                      options={[
                        { value: 'NAAC A++ / Tier-1 NIRF', label: 'NAAC A++ / Tier-1 NIRF' },
                        { value: 'NBA Accredited Programs', label: 'NBA Accredited Programs' },
                        { value: 'UGC / AICTE Approved', label: 'UGC / AICTE Approved' },
                        { value: 'ABET / International Accredited', label: 'ABET / International Accredited' },
                        { value: 'Other / In Process', label: 'Other / In Process' },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-150 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary-600" />
                    2. Placement Cell & Registrar Contact
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Dean / TPO Officer Name *"
                      placeholder="Dr. Rajesh Kumar"
                      value={formData.deanName}
                      onChange={(e) => handleChange('deanName', e.target.value)}
                      required
                    />

                    <Input
                      label="Official Institutional Email *"
                      type="email"
                      placeholder="tpo@university.edu.in"
                      value={formData.deanEmail}
                      onChange={(e) => handleChange('deanEmail', e.target.value)}
                      required
                    />

                    <Input
                      label="Direct Contact Phone *"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      required
                    />

                    <Select
                      label="Annual Graduating Cohort Size"
                      value={formData.batchCapacity}
                      onChange={(e) => handleChange('batchCapacity', e.target.value)}
                      options={[
                        { value: '500', label: 'Under 500 Students' },
                        { value: '1500', label: '500 - 1,500 Students' },
                        { value: '3500', label: '1,500 - 3,500 Students' },
                        { value: '6000', label: '3,500+ Students' },
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <Textarea
                    label="Primary Placement Objectives / Requirements (Optional)"
                    rows={3}
                    placeholder="Briefly describe what your placement cell hopes to achieve (e.g. automated ATS screening, recruiter invites, batch analytics)..."
                    value={formData.objectives}
                    onChange={(e) => handleChange('objectives', e.target.value)}
                  />
                </div>

                <div className="pt-4 border-t border-neutral-150 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                    <span>FERPA & institutional privacy compliant</span>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    Submit University Details
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
