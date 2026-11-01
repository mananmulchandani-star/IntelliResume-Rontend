import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Input,
  Textarea,
  Select,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '../../../components/ui';
import { ROUTES } from '../../../constants/routes';
import { useCompanyData } from '../hooks/useCompanyData';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  Mail,
  Shield,
  Upload,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';

export default function CompanyProfile() {
  const { profile, saveCompanyProfile, addRecruiter, removeRecruiter } = useCompanyData();

  // Form states
  const [name, setName] = useState(profile?.name || '');
  const [tagline, setTagline] = useState(profile?.tagline || '');
  const [logo, setLogo] = useState(profile?.logo || '');
  const [industry, setIndustry] = useState(profile?.industry || '');
  const [headquarters, setHeadquarters] = useState(profile?.headquarters || '');
  const [website, setWebsite] = useState(profile?.website || '');
  const [size, setSize] = useState(profile?.size || '250-500 employees');
  const [founded, setFounded] = useState(profile?.founded || '2021');
  const [description, setDescription] = useState(profile?.description || '');
  const [perks, setPerks] = useState(profile?.perks || []);
  const [newPerkInput, setNewPerkInput] = useState('');

  // UI status
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Recruiter Modal
  const [isAddRecruiterOpen, setIsAddRecruiterOpen] = useState(false);
  const [newRecruiterName, setNewRecruiterName] = useState('');
  const [newRecruiterEmail, setNewRecruiterEmail] = useState('');
  const [newRecruiterRole, setNewRecruiterRole] = useState('Recruiter');

  // Sync if profile changes
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setTagline(profile.tagline || '');
      setLogo(profile.logo || '');
      setIndustry(profile.industry || '');
      setHeadquarters(profile.headquarters || '');
      setWebsite(profile.website || '');
      setSize(profile.size || '250-500 employees');
      setFounded(profile.founded || '2021');
      setDescription(profile.description || '');
      setPerks(profile.perks || []);
    }
  }, [profile]);

  // Perks management
  const handleAddPerk = () => {
    if (newPerkInput.trim() && !perks.includes(newPerkInput.trim())) {
      setPerks([...perks, newPerkInput.trim()]);
      setNewPerkInput('');
    }
  };

  const handleRemovePerk = (perkToRemove) => {
    setPerks(perks.filter((p) => p !== perkToRemove));
  };

  // Save profile
  const handleSaveProfile = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);

    saveCompanyProfile({
      name: name.trim(),
      tagline: tagline.trim(),
      logo: logo.trim(),
      industry: industry.trim(),
      headquarters: headquarters.trim(),
      website: website.trim(),
      size,
      founded,
      description: description.trim(),
      perks,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }, 350);
  };

  // Add recruiter submit
  const handleAddRecruiterSubmit = (e) => {
    e.preventDefault();
    if (!newRecruiterName.trim() || !newRecruiterEmail.trim()) return;

    addRecruiter({
      name: newRecruiterName.trim(),
      email: newRecruiterEmail.trim(),
      role: newRecruiterRole,
    });

    setIsAddRecruiterOpen(false);
    setNewRecruiterName('');
    setNewRecruiterEmail('');
  };

  return (
    <DashboardLayout
      title="Company Branding & Profile"
      subtitle="Manage your employer branding, career page identity, culture highlights, and recruiting team members."
      breadcrumbs={[
        { label: 'Employer Portal', href: ROUTES.COMPANY_DASHBOARD },
        { label: 'Company Profile' },
      ]}
      actions={
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Save className="w-3.5 h-3.5" />}
          loading={isSubmitting}
          onClick={handleSaveProfile}
        >
          Save Changes
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Alert */}
        {isSaved && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2.5 animate-slide-down">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold">
              Company profile and team configurations saved successfully!
            </span>
          </div>
        )}

        {/* ============================================================ */}
        {/* BRAND IDENTITY & LOGO                                        */}
        {/* ============================================================ */}
        <Card>
          <CardHeader className="border-b border-neutral-100 pb-4">
            <CardTitle className="text-base font-semibold text-neutral-900">
              Employer Identity & Logo
            </CardTitle>
            <CardDescription>
              Presented to candidates on job application listings and university placement portals.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-5">
            {/* Logo Preview & Input */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200/80">
              <img
                src={logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80'}
                alt={name}
                className="w-16 h-16 rounded-xl object-cover border border-neutral-200 bg-white shadow-xs shrink-0"
              />
              <div className="flex-1 space-y-1 w-full">
                <Input
                  label="Company Logo Image URL"
                  placeholder="https://example.com/logo.png"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  helperText="Recommended: 400x400 square PNG, SVG, or high-res JPG."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Legal / Trading Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <Input
                label="One-line Tagline / Mission"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Pioneering intelligent autonomous platforms"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Primary Industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />

              <Input
                label="Headquarters"
                value={headquarters}
                onChange={(e) => setHeadquarters(e.target.value)}
                leftIcon={<MapPin className="w-4 h-4 text-neutral-400" />}
              />

              <Input
                label="Website URL"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                leftIcon={<Globe className="w-4 h-4 text-neutral-400" />}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Company Headcount"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                options={[
                  { value: '1-10 employees', label: 'Seed / 1-10 employees' },
                  { value: '11-50 employees', label: 'Startup / 11-50 employees' },
                  { value: '51-200 employees', label: 'Growth / 51-200 employees' },
                  { value: '250-500 employees', label: 'Mid-Market / 250-500 employees' },
                  { value: '500-1000 employees', label: 'Scale-Up / 500-1,000 employees' },
                  { value: '1000+ employees', label: 'Enterprise / 1,000+ employees' },
                ]}
              />

              <Input
                label="Year Founded"
                value={founded}
                onChange={(e) => setFounded(e.target.value)}
              />
            </div>

            <Textarea
              label="About The Organization (Culture & Mission)"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your company culture, technology stack, and engineering philosophy..."
            />
          </CardContent>
        </Card>

        {/* ============================================================ */}
        {/* PERKS & BENEFITS TAGS                                        */}
        {/* ============================================================ */}
        <Card>
          <CardHeader className="border-b border-neutral-100 pb-4">
            <CardTitle className="text-base font-semibold text-neutral-900">
              Workplace Perks & Benefits
            </CardTitle>
            <CardDescription>
              Highlight candidate perks to maximize application conversion rates.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-5">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Add a benefit, e.g. $3,000 learning stipend, remote flexibility..."
                value={newPerkInput}
                onChange={(e) => setNewPerkInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddPerk();
                  }
                }}
              />
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={handleAddPerk}
              >
                Add Perk
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {perks.map((perk) => (
                <span
                  key={perk}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  {perk}
                  <button
                    type="button"
                    onClick={() => handleRemovePerk(perk)}
                    className="text-emerald-500 hover:text-emerald-900 ml-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {perks.length === 0 && (
                <span className="text-xs text-neutral-400 italic">
                  No perks added yet.
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ============================================================ */}
        {/* RECRUITERS & HIRING TEAM                                     */}
        {/* ============================================================ */}
        <Card>
          <CardHeader className="border-b border-neutral-100 pb-4 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-neutral-900">
                Recruiter & Talent Acquisition Team
              </CardTitle>
              <CardDescription>
                Authorized recruiters managing candidate pipelines and interview calendars.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsAddRecruiterOpen(true)}
            >
              Add Recruiter
            </Button>
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-neutral-100">
              {profile?.recruiters?.map((rec) => (
                <div
                  key={rec.id}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={rec.avatar}
                      alt={rec.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-neutral-900 truncate">
                          {rec.name}
                        </span>
                        <Badge variant="success" size="sm">
                          {rec.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-500 truncate flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-neutral-400" />
                        {rec.email}
                        <span>•</span>
                        <span>{rec.role}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-neutral-400 hidden sm:inline">
                      Joined {rec.joinedDate}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeRecruiter(rec.id)}
                      className="text-neutral-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                      title="Remove Recruiter Access"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {(!profile?.recruiters || profile.recruiters.length === 0) && (
                <div className="p-8 text-center text-xs text-neutral-500">
                  No recruiter team members configured.
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="border-t border-neutral-100 bg-neutral-50/50 p-4 flex items-center justify-between">
            <span className="text-xs text-neutral-500">
              Team seats: <strong>{profile?.recruiters?.length || 0} active</strong> (Unlimited Enterprise tier)
            </span>
            <Button
              variant="primary"
              size="sm"
              loading={isSubmitting}
              onClick={handleSaveProfile}
            >
              Save Profile Changes
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* ============================================================ */}
      {/* MODAL: ADD RECRUITER MEMBER                                  */}
      {/* ============================================================ */}
      {isAddRecruiterOpen && (
        <Modal
          isOpen={isAddRecruiterOpen}
          onClose={() => setIsAddRecruiterOpen(false)}
          title="Invite New Recruiter"
          description="Grant recruiting team member access to manage vacancies and candidates."
        >
          <form onSubmit={handleAddRecruiterSubmit}>
            <ModalBody className="space-y-4">
              <Input
                label="Full Name"
                placeholder="e.g. Jason Scott"
                value={newRecruiterName}
                onChange={(e) => setNewRecruiterName(e.target.value)}
                required
              />

              <Input
                label="Work Email Address"
                type="email"
                placeholder="jason.scott@company.com"
                value={newRecruiterEmail}
                onChange={(e) => setNewRecruiterEmail(e.target.value)}
                required
              />

              <Select
                label="Team Permission Role"
                value={newRecruiterRole}
                onChange={(e) => setNewRecruiterRole(e.target.value)}
                options={[
                  { value: 'Talent Acquisition Partner', label: 'Talent Acquisition Partner' },
                  { value: 'Technical Recruiter', label: 'Technical Recruiter' },
                  { value: 'University Relations Specialist', label: 'University Relations Specialist' },
                  { value: 'Hiring Manager (Reviewer)', label: 'Hiring Manager (Reviewer)' },
                ]}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddRecruiterOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
              >
                Add Recruiter
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}
