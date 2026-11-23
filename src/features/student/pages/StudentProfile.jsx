// src/features/student/pages/StudentProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ROUTES } from '../../../constants/routes';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Button, Card, Badge, Input, Select } from '../../../components/ui';
import PhoneInputWithCountry from '../../../components/ui/PhoneInputWithCountry';
import { DEGREE_OPTIONS, STREAM_OPTIONS, validators } from '../../../constants/validationData';
import { Textarea } from '../../../components/ui/Input';
import SkillVerificationModal from '../components/SkillVerificationModal';
import {
  User,
  GraduationCap,
  Globe,
  Award,
  ShieldCheck,
  CheckCircle2,
  Save,
  RefreshCw,
  ExternalLink,
  Sparkles,
  BookOpen,
  Check,
} from 'lucide-react';

const getBlankProfile = (user) => ({
  fullName: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  location: user?.location || '',
  headline: '',
  bio: '',
  studentId: '',
  university: user?.organization || user?.university || '',
  degree: '',
  major: user?.department || '',
  graduationYear: '',
  gpa: '',
  github: '',
  linkedin: '',
  website: '',
  targetRole: '',
});

export default function StudentProfile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('studentProfile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading studentProfile:', e);
    }
    return getBlankProfile(user);
  });

  const [verifiedSkills, setVerifiedSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('verifiedSkills');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [syncToast, setSyncToast] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    try {
      const savedSkills = localStorage.getItem('verifiedSkills');
      if (savedSkills) setVerifiedSkills(JSON.parse(savedSkills));
      else setVerifiedSkills(['React', 'JavaScript', 'Node.js']);
    } catch (e) {
      console.error('Error reading verifiedSkills:', e);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    const errors = {};
    const nameErr = validators.fullName(profile.fullName, 'Full legal name');
    if (nameErr) errors.fullName = nameErr;

    const emailErr = validators.email(profile.email);
    if (emailErr) errors.email = emailErr;

    if (profile.phone) {
      const digits = profile.phone.replace(/[^\d]/g, '');
      if (digits.length < 7 || digits.length > 15) {
        errors.phone = 'Please enter a valid mobile number with country code.';
      }
    }

    const degreeErr = validators.degree(profile.degree);
    if (degreeErr) errors.degree = degreeErr;

    const uniErr = validators.institution(profile.university);
    if (uniErr) errors.university = uniErr;

    if (profile.gpa) {
      const gpaErr = validators.gpa(profile.gpa);
      if (gpaErr) errors.gpa = gpaErr;
    }

    if (profile.graduationYear) {
      const yearErr = validators.year(profile.graduationYear);
      if (yearErr) errors.graduationYear = yearErr;
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      localStorage.setItem('studentProfile', JSON.stringify(profile));
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2500);
    } catch (e) {
      console.error('Error saving profile:', e);
    }
  };

  const handleSyncToResume = () => {
    try {
      const current = JSON.parse(localStorage.getItem('currentResume') || '{}');
      const updatedResume = {
        ...current,
        personalInfo: {
          ...(current.personalInfo || {}),
          fullName: profile.fullName,
          email: profile.email,
          phone: profile.phone,
          location: profile.location,
          jobTitle: profile.headline || profile.targetRole,
          about: profile.bio,
          website: profile.website || profile.linkedin,
        },
        education: [
          {
            degree: profile.degree,
            institution: profile.university,
            year: `Class of ${profile.graduationYear}`,
            score: profile.gpa,
            details: `Major: ${profile.major} • ID: ${profile.studentId}`,
          },
        ],
      };

      localStorage.setItem('currentResume', JSON.stringify(updatedResume));

      // Also update in userResumes
      const allResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      const idx = allResumes.findIndex((r) => r.id === updatedResume.id);
      if (idx >= 0) {
        allResumes[idx] = updatedResume;
        localStorage.setItem('userResumes', JSON.stringify(allResumes));
      }

      setSyncToast(true);
      setTimeout(() => setSyncToast(false), 2500);
    } catch (e) {
      console.error('Error syncing profile to resume:', e);
    }
  };

  return (
    <DashboardLayout
      title="Student Profile & Academic Record"
      subtitle="Manage your academic verification credentials, contact details, and placement preferences."
      actions={
        <div className="flex items-center gap-2">
          {syncToast && (
            <span className="text-xs text-blue-600 font-semibold flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Synced to Resumes!
            </span>
          )}
          {savedToast && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={handleSyncToResume}
          >
            Sync to Active Resume
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5" />}
            onClick={handleSaveProfile}
          >
            Save Profile
          </Button>
        </div>
      }
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Profile Header Card */}
        <Card className="p-6 border-neutral-200 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
            {profile.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-neutral-900">{profile.fullName}</h3>
              <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
                University Verified Student
              </Badge>
            </div>
            <p className="text-xs font-semibold text-primary-600">{profile.headline}</p>
            <p className="text-xs text-neutral-500">
              {profile.university} • Class of {profile.graduationYear} • Roll #{profile.studentId}
            </p>
          </div>
        </Card>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main 2 Columns: Personal & Academic Records */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Contact & Personal Info */}
            <Card className="p-6 border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                <User className="w-4 h-4 text-primary-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Personal Information
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Legal Name"
                  required
                  value={profile.fullName}
                  error={fieldErrors.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  required
                  value={profile.email}
                  error={fieldErrors.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
                <PhoneInputWithCountry
                  label="Contact Mobile Number"
                  required
                  value={profile.phone}
                  error={fieldErrors.phone}
                  onChange={(val) => handleInputChange('phone', val)}
                />
                <Input
                  label="Current Location (City, State / Country)"
                  value={profile.location}
                  placeholder="e.g. Indore, M.P."
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <Input
                label="Professional Headline / Target Role"
                placeholder="e.g. Full Stack Software Engineer"
                value={profile.headline}
                onChange={(e) => handleInputChange('headline', e.target.value)}
              />

              <Textarea
                label="Student Bio / Career Objectives"
                rows={3}
                value={profile.bio}
                placeholder="Brief summary of your academic achievements and career objectives..."
                onChange={(e) => handleInputChange('bio', e.target.value)}
              />
            </Card>

            {/* Section 2: Academic Record */}
            <Card className="p-6 border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                <GraduationCap className="w-4 h-4 text-primary-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Academic Record & Verification
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="College / University Name"
                  required
                  value={profile.university}
                  error={fieldErrors.university}
                  placeholder="e.g. Medi-Caps University, Indore"
                  onChange={(e) => handleInputChange('university', e.target.value)}
                />
                <Input
                  label="Student Enrollment / Roll Number"
                  value={profile.studentId}
                  placeholder="e.g. EN22CA301045"
                  onChange={(e) => handleInputChange('studentId', e.target.value)}
                />
                <div className="space-y-1.5">
                  <Select
                    label="Degree / Academic Course Program"
                    required
                    value={DEGREE_OPTIONS.some((d) => d.value === profile.degree) ? profile.degree : 'CUSTOM'}
                    error={fieldErrors.degree}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleInputChange('degree', val === 'CUSTOM' ? '' : val);
                    }}
                    options={DEGREE_OPTIONS.map((d) => ({
                      value: d.value,
                      label: `${d.label} (${d.group})`,
                    }))}
                  />
                  {(!DEGREE_OPTIONS.some((d) => d.value === profile.degree) || profile.degree === 'CUSTOM') && (
                    <Input
                      placeholder="Specify custom accredited degree"
                      value={profile.degree === 'CUSTOM' ? '' : profile.degree}
                      error={fieldErrors.degree}
                      onChange={(e) => handleInputChange('degree', e.target.value)}
                    />
                  )}
                </div>
                <Select
                  label="Major / Academic Stream"
                  value={profile.major}
                  onChange={(e) => handleInputChange('major', e.target.value)}
                  options={STREAM_OPTIONS.map((s) => ({ value: s, label: s }))}
                />
                <Input
                  label="Graduation Year"
                  value={profile.graduationYear}
                  error={fieldErrors.graduationYear}
                  placeholder="e.g. 2026"
                  onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                />
                <Input
                  label="Cumulative GPA / Percentage"
                  value={profile.gpa}
                  error={fieldErrors.gpa}
                  placeholder="e.g. 8.85 or 88%"
                  onChange={(e) => handleInputChange('gpa', e.target.value)}
                />
              </div>
            </Card>

            {/* Section 3: Portfolio & Developer Links */}
            <Card className="p-6 border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                <Globe className="w-4 h-4 text-primary-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Portfolio & Profiles
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="GitHub Profile URL"
                  placeholder="https://github.com/username"
                  value={profile.github}
                  onChange={(e) => handleInputChange('github', e.target.value)}
                />
                <Input
                  label="LinkedIn Profile URL"
                  placeholder="https://linkedin.com/in/username"
                  value={profile.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                />
              </div>

              <Input
                label="Personal Portfolio / Website"
                placeholder="https://yourportfolio.dev"
                value={profile.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </Card>
          </div>

          {/* Right Column: Verified Credentials & Quick Actions */}
          <div className="space-y-6">
            {/* Verified Skills Showcase */}
            <Card className="p-5 border-neutral-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Certified Skills
                  </h4>
                </div>
                <Badge variant="success" size="sm">
                  {verifiedSkills.length} Certified
                </Badge>
              </div>

              <p className="text-xs text-neutral-500">
                These skills have been assessed via InsightResume AI technical challenges and display with verified checkmarks on your resumes.
              </p>

              <div className="flex flex-wrap gap-1.5">
                {verifiedSkills.map((sk) => (
                  <span
                    key={sk}
                    className="inline-flex items-center gap-1 text-xs font-semibold bg-neutral-900 text-white px-2.5 py-1 rounded-md shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {sk}
                  </span>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                fullWidth
                leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
                onClick={() => setIsVerifyModalOpen(true)}
              >
                Take Skill Assessment
              </Button>
            </Card>

            {/* Quick Resume Sync Action Card */}
            <Card className="p-5 border-blue-200 bg-blue-50/40 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Keep Resumes in Sync</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Made updates to your contact info, GPA, or links? One click synchronizes these changes to your active resume in the editor.
              </p>
              <Button
                variant="primary"
                size="sm"
                fullWidth
                onClick={handleSyncToResume}
              >
                Sync Profile to Active Resume
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Skill Verification Modal */}
      <SkillVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        availableSkills={['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Docker', 'System Design']}
        jobTitle={profile.headline}
        onVerificationComplete={(passed) => {
          const updated = Array.from(new Set([...verifiedSkills, ...passed]));
          setVerifiedSkills(updated);
          localStorage.setItem('verifiedSkills', JSON.stringify(updated));
        }}
      />
    </DashboardLayout>
  );
}
