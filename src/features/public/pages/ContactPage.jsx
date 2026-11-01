import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button, Card, Badge, Input, Select, Textarea } from '../../../components/ui';
import {
  Mail,
  MessageSquare,
  Building2,
  GraduationCap,
  Briefcase,
  Check,
  Send,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    inquiryType: 'student',
    subject: '',
    message: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const departments = [
    {
      icon: <GraduationCap className="w-5 h-5 text-primary-600" />,
      title: 'Student & Job Seeker Support',
      desc: 'Questions about resume editing, ATS scoring diagnostics, or skill verification badges.',
      email: 'support@insightresume.ai',
      sla: 'Average response: < 4 hours',
    },
    {
      icon: <Building2 className="w-5 h-5 text-primary-600" />,
      title: 'University & Placement Cells',
      desc: 'Inquiries regarding institutional onboarding, student batch CSV imports, and placement drive portals.',
      email: 'universities@insightresume.ai',
      sla: 'Dedicated campus liaison',
    },
    {
      icon: <Briefcase className="w-5 h-5 text-primary-600" />,
      title: 'Enterprise Recruiter Inquiries',
      desc: 'Accessing verified candidate search, scheduling campus recruitment drives, and billing options.',
      email: 'enterprise@insightresume.ai',
      sla: 'Priority same-day response',
    },
  ];

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Please provide your full name.';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Please provide a valid email address.';
    }
    if (!formData.subject.trim()) errors.subject = 'Please enter a subject.';
    if (!formData.message.trim() || formData.message.length < 15) {
      errors.message = 'Please provide a message with at least 15 characters.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const ticketId = `INS-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket(ticketId);
    }, 600);
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setFormData({
      name: '',
      email: '',
      inquiryType: 'student',
      subject: '',
      message: '',
    });
    setFormErrors({});
  };

  return (
    <div className="bg-white text-neutral-900">
      {/* ─────────────────────────────────────────────────────────────
          Hero Section
          ───────────────────────────────────────────────────────────── */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-200 bg-neutral-25">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="info" size="sm" className="mb-4">
            Support & Communications
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-tight">
            We're here to help you accelerate.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            Have questions regarding our AI resume builder, campus placement integrations, or enterprise candidate search? Connect with our dedicated specialists.
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Direct Routing Cards
          ───────────────────────────────────────────────────────────── */}
      <section className="py-12 border-b border-neutral-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept, idx) => (
              <Card key={idx} className="p-6 bg-neutral-50/60 border-neutral-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-neutral-200 flex items-center justify-center mb-4">
                    {dept.icon}
                  </div>
                  <h3 className="font-bold text-base text-neutral-900">{dept.title}</h3>
                  <p className="text-xs text-neutral-600 mt-2 leading-relaxed">{dept.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200/80">
                  <a
                    href={`mailto:${dept.email}`}
                    className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1.5"
                  >
                    <Mail size={13} /> {dept.email}
                  </a>
                  <span className="text-[11px] text-neutral-400 mt-1 block flex items-center gap-1">
                    <Clock size={11} /> {dept.sla}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Contact Form & System Status
          ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-neutral-50 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Form Column */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-8 bg-white border-neutral-200 shadow-xs">
                {submittedTicket ? (
                  <div className="py-10 text-center space-y-4">
                    <div className="w-12 h-12 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto">
                      <Check size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-neutral-900">Message Dispatched</h3>
                    <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
                      Thank you for reaching out. We have received your inquiry and generated support ticket{' '}
                      <span className="font-mono font-bold text-neutral-900">#{submittedTicket}</span>. A representative from our team will reply to{' '}
                      <span className="font-semibold text-neutral-900">{formData.email}</span> shortly.
                    </p>
                    <div className="pt-4">
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        Send Another Inquiry
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-neutral-900">Send an Inquiry</h2>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Complete the form below and we will route your message to the appropriate team.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <Input
                        label="Your Full Name"
                        required
                        placeholder="Alex Morgan"
                        value={formData.name}
                        error={formErrors.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                      <Input
                        label="Email Address"
                        required
                        type="email"
                        placeholder="alex@domain.com"
                        value={formData.email}
                        error={formErrors.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Select
                        label="Inquiry Category"
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        options={[
                          { value: 'student', label: 'Job Seeker / Student Support' },
                          { value: 'university', label: 'University Placement Cell' },
                          { value: 'recruiter', label: 'Recruiter & Talent Acquisition' },
                          { value: 'technical', label: 'Technical Issue / Bug Report' },
                          { value: 'press', label: 'Press & Media' },
                        ]}
                      />
                      <Input
                        label="Subject Line"
                        required
                        placeholder="Brief summary of inquiry"
                        value={formData.subject}
                        error={formErrors.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      />
                    </div>

                    <Textarea
                      label="Your Message"
                      required
                      rows={5}
                      placeholder="Please include relevant details such as university name, target graduation year, or company information..."
                      value={formData.message}
                      error={formErrors.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />

                    <Button
                      type="submit"
                      size="md"
                      fullWidth
                      isLoading={isSubmitting}
                      rightIcon={<Send size={15} />}
                    >
                      Transmit Message
                    </Button>

                    <p className="text-[11px] text-neutral-400 text-center">
                      Protected by InsightResume zero-retention privacy protocols.
                    </p>
                  </form>
                )}
              </Card>
            </div>

            {/* Sidebar Information Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* System status card */}
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    System Health
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-success-700">
                    <span className="w-2 h-2 rounded-full bg-success-600 animate-pulse" />
                    All Systems Operational
                  </span>
                </div>
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>AI Quantification API</span>
                    <span className="font-mono text-neutral-900 font-bold">99.99%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ATS Diagnostic Parser</span>
                    <span className="font-mono text-neutral-900 font-bold">100.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Campus Drive Dispatcher</span>
                    <span className="font-mono text-neutral-900 font-bold">99.98%</span>
                  </div>
                </div>
              </div>

              {/* Office Details */}
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-neutral-900">Headquarters</h3>
                <div className="space-y-2 text-xs text-neutral-600 leading-relaxed">
                  <p className="flex items-start gap-2">
                    <MapPin size={15} className="text-neutral-400 shrink-0 mt-0.5" />
                    <span>
                      InsightResume Technologies, Inc.<br />
                      548 Market Street, Suite 48201<br />
                      San Francisco, CA 94104
                    </span>
                  </p>
                  <p className="flex items-center gap-2 pt-2">
                    <Clock size={15} className="text-neutral-400 shrink-0" />
                    <span>Hours: Monday – Friday, 8:00 AM – 6:00 PM PT</span>
                  </p>
                </div>
              </div>

              {/* Quick links card */}
              <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-neutral-900">Self-Service Resources</h3>
                <ul className="space-y-2 text-xs">
                  <li>
                    <Link to={ROUTES.FAQ} className="text-primary-600 hover:underline flex items-center gap-1.5">
                      • Browse Knowledge Base & FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to={ROUTES.ATS_CHECKER} className="text-primary-600 hover:underline flex items-center gap-1.5">
                      • Run Instant ATS Resume Audit
                    </Link>
                  </li>
                  <li>
                    <Link to={ROUTES.PRIVACY} className="text-primary-600 hover:underline flex items-center gap-1.5">
                      • Review Data Sovereignty & Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
