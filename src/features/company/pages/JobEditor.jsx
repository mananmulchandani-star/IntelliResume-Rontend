import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Textarea,
  Select,
  Badge,
} from '../../../components/ui';
import { ROUTES } from '../../../constants/routes';
import { useCompanyData } from '../hooks/useCompanyData';
import {
  Briefcase,
  ArrowLeft,
  Save,
  CheckCircle2,
  X,
  Plus,
  Sparkles,
  MapPin,
  DollarSign,
  Calendar,
  Layers,
  GraduationCap,
  Eye,
  FileText,
} from 'lucide-react';

const POPULAR_SKILLS = [
  'React',
  'TypeScript',
  'Python',
  'Node.js',
  'PostgreSQL',
  'PyTorch',
  'System Design',
  'AWS',
  'Docker',
  'Kubernetes',
  'Figma',
  'FastAPI',
  'GraphQL',
  'Next.js',
  'Tailwind CSS',
  'C++',
  'Java',
  'Go',
];

export default function JobEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editJobId = searchParams.get('id');

  const { getJobById, saveJob } = useCompanyData();

  // Mode: creating new vs editing
  const isEditing = Boolean(editJobId);

  // Form Fields
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Core Engineering');
  const [type, setType] = useState('Full-time');
  const [workMode, setWorkMode] = useState('Remote');
  const [location, setLocation] = useState('San Francisco, CA / Remote');
  const [experienceLevel, setExperienceLevel] = useState('Mid to Senior Level');
  const [salaryMin, setSalaryMin] = useState('140000');
  const [salaryMax, setSalaryMax] = useState('180000');
  const [salaryPeriod, setSalaryPeriod] = useState('yr');
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Node.js']);
  const [skillInput, setSkillInput] = useState('');
  const [eligibility, setEligibility] = useState(
    "Bachelor's or Master's degree in Computer Science or related field. Minimum 3+ years experience."
  );
  const [deadline, setDeadline] = useState('2026-11-30');
  const [status, setStatus] = useState('Active');
  const [description, setDescription] = useState(
    'We are seeking an exceptional engineer to contribute to our core platform architecture...'
  );
  const [responsibilities, setResponsibilities] = useState([
    'Design and implement high-performance, fault-tolerant microservices.',
    'Collaborate directly with cross-functional design and product leads.',
    'Write maintainable, well-tested code with rigorous automated tests.',
  ]);
  const [newRespInput, setNewRespInput] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'preview'
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing job if in edit mode
  useEffect(() => {
    if (editJobId) {
      const existing = getJobById(editJobId);
      if (existing) {
        setTitle(existing.title || '');
        setDepartment(existing.department || 'Core Engineering');
        setType(existing.type || 'Full-time');
        setWorkMode(existing.workMode || 'Remote');
        setLocation(existing.location || '');
        setExperienceLevel(existing.experienceLevel || 'Mid to Senior Level');
        setSalaryMin(String(existing.salaryMin || '120000'));
        setSalaryMax(String(existing.salaryMax || '160000'));
        setSalaryPeriod(existing.salaryPeriod || 'yr');
        setSkills(existing.skills || []);
        setEligibility(existing.eligibility || '');
        setDeadline(existing.deadline || '');
        setStatus(existing.status || 'Active');
        setDescription(existing.description || '');
        if (existing.responsibilities && existing.responsibilities.length) {
          setResponsibilities(existing.responsibilities);
        }
      }
    }
  }, [editJobId, getJobById]);

  // Skill tag add
  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleKeyDownSkill = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  // Responsibility item add / remove
  const handleAddResponsibility = () => {
    if (newRespInput.trim()) {
      setResponsibilities([...responsibilities, newRespInput.trim()]);
      setNewRespInput('');
    }
  };

  const handleRemoveResponsibility = (idx) => {
    setResponsibilities(responsibilities.filter((_, i) => i !== idx));
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please specify a role title.');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...(editJobId ? { id: editJobId } : {}),
      title: title.trim(),
      department,
      type,
      workMode,
      location: location.trim(),
      experienceLevel,
      salaryMin: Number(salaryMin) || 0,
      salaryMax: Number(salaryMax) || 0,
      salaryPeriod,
      skills,
      eligibility: eligibility.trim(),
      deadline,
      status,
      description: description.trim(),
      responsibilities,
    };

    saveJob(payload);

    setTimeout(() => {
      setIsSubmitting(false);
      setSaveSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.JOB_LISTINGS);
      }, 900);
    }, 400);
  };

  return (
    <DashboardLayout
      title={isEditing ? `Edit Job: ${title || 'Untitled'}` : 'Create New Job or Internship'}
      subtitle="Publish openings across global applicant networks and connected university placement cells."
      breadcrumbs={[
        { label: 'Employer Portal', href: ROUTES.COMPANY_DASHBOARD },
        { label: 'Job Listings', href: ROUTES.JOB_LISTINGS },
        { label: isEditing ? 'Edit Listing' : 'New Listing' },
      ]}
      actions={
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            onClick={() => navigate(ROUTES.JOB_LISTINGS)}
          >
            Cancel
          </Button>

          {/* Toggle Preview Button */}
          <Button
            variant="secondary"
            size="sm"
            leftIcon={activeTab === 'form' ? <Eye className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
            onClick={() => setActiveTab(activeTab === 'form' ? 'preview' : 'form')}
          >
            {activeTab === 'form' ? 'Candidate View' : 'Back to Editor'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5" />}
            loading={isSubmitting}
            onClick={handleSubmit}
          >
            {isEditing ? 'Save Changes' : 'Publish Listing'}
          </Button>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Alert Banner */}
        {saveSuccess && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-slide-down">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Listing saved successfully!</p>
              <p className="text-[11px] text-emerald-700">Redirecting to vacancy management overview...</p>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 1: FORM EDITOR                                           */}
        {/* ============================================================ */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card 1: Primary Role Information */}
            <Card>
              <CardHeader className="border-b border-neutral-100 pb-4">
                <CardTitle className="text-base font-semibold text-neutral-900">
                  Role Identity & Overview
                </CardTitle>
                <CardDescription>
                  Define the core job title, department, work mode, and employment category.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <Input
                      label="Job or Internship Title"
                      placeholder="e.g. Senior Full Stack Engineer"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Select
                      label="Department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      options={[
                        { value: 'Core Engineering', label: 'Core Engineering' },
                        { value: 'Applied AI Labs', label: 'Applied AI Labs' },
                        { value: 'Product & Design', label: 'Product & Design' },
                        { value: 'Infrastructure', label: 'Infrastructure & SRE' },
                        { value: 'Data & Analytics', label: 'Data & Analytics' },
                        { value: 'Sales & Growth', label: 'Sales & Growth' },
                      ]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Select
                      label="Employment Type"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      options={[
                        { value: 'Full-time', label: 'Full-time' },
                        { value: 'Internship', label: 'Internship' },
                        { value: 'Contract', label: 'Contract' },
                        { value: 'Part-time', label: 'Part-time' },
                      ]}
                    />
                  </div>

                  <div>
                    <Select
                      label="Work Mode"
                      value={workMode}
                      onChange={(e) => setWorkMode(e.target.value)}
                      options={[
                        { value: 'Remote', label: 'Remote' },
                        { value: 'Hybrid', label: 'Hybrid' },
                        { value: 'Onsite', label: 'Onsite' },
                      ]}
                    />
                  </div>

                  <div>
                    <Select
                      label="Experience Level"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      options={[
                        { value: 'Entry Level / Campus Grad', label: 'Entry Level (0-2 yrs)' },
                        { value: 'Mid Level (2-4 years)', label: 'Mid Level (2-4 yrs)' },
                        { value: 'Senior Level (4-7 years)', label: 'Senior Level (4-7 yrs)' },
                        { value: 'Staff / Principal', label: 'Staff / Principal (7+ yrs)' },
                        { value: 'Internship / Student', label: 'Internship / Student' },
                      ]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Location / Office Hub"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    leftIcon={<MapPin className="w-4 h-4 text-neutral-400" />}
                    required
                  />

                  <Input
                    label="Application Deadline"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    leftIcon={<Calendar className="w-4 h-4 text-neutral-400" />}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Compensation & Budget */}
            <Card>
              <CardHeader className="border-b border-neutral-100 pb-4">
                <CardTitle className="text-base font-semibold text-neutral-900">
                  Compensation & Transparency
                </CardTitle>
                <CardDescription>
                  Accurate salary bands drastically improve qualified applicant conversion rates.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Minimum Amount"
                    type="number"
                    placeholder="120000"
                    value={salaryMin}
                    onChange={(e) => setSalaryMin(e.target.value)}
                    leftIcon={<span className="text-neutral-400 text-xs font-semibold">$</span>}
                    required
                  />

                  <Input
                    label="Maximum Amount"
                    type="number"
                    placeholder="160000"
                    value={salaryMax}
                    onChange={(e) => setSalaryMax(e.target.value)}
                    leftIcon={<span className="text-neutral-400 text-xs font-semibold">$</span>}
                    required
                  />

                  <Select
                    label="Frequency"
                    value={salaryPeriod}
                    onChange={(e) => setSalaryPeriod(e.target.value)}
                    options={[
                      { value: 'yr', label: 'Per Year ($/yr)' },
                      { value: 'mo', label: 'Per Month ($/mo)' },
                      { value: 'hr', label: 'Per Hour ($/hr)' },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Skills & Eligibility Criteria */}
            <Card>
              <CardHeader className="border-b border-neutral-100 pb-4">
                <CardTitle className="text-base font-semibold text-neutral-900">
                  Required Competencies & Eligibility
                </CardTitle>
                <CardDescription>
                  Tags are parsed directly by the InsightResume semantic matcher to compute ATS scores.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 pt-5">
                {/* Tag Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Required Skills (Press Enter or Comma to add)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Type a skill and hit enter, e.g. React, PyTorch..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleKeyDownSkill}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={() => handleAddSkill()}
                    >
                      Add Tag
                    </Button>
                  </div>

                  {/* Active Skill Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-200"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-primary-400 hover:text-primary-800 transition-colors cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {skills.length === 0 && (
                      <span className="text-xs text-neutral-400 italic">
                        No skill tags added yet. Add at least 3 skills for accurate ATS scoring.
                      </span>
                    )}
                  </div>

                  {/* Popular Suggestions */}
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Quick Add Suggestions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_SKILLS.filter((s) => !skills.includes(s))
                        .slice(0, 10)
                        .map((suggested) => (
                          <button
                            key={suggested}
                            type="button"
                            onClick={() => handleAddSkill(suggested)}
                            className="text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-600 px-2 py-0.5 rounded transition-colors cursor-pointer"
                          >
                            + {suggested}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Hard Eligibility Criteria */}
                <div className="pt-2">
                  <Input
                    label="Hard Eligibility Criteria"
                    placeholder="e.g. Min 3.5 CGPA, Graduating Batch 2025/2026, authorized to work in USA"
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    helperText="Used to auto-filter campus drives and verified university batches."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Detailed Description & Responsibilities */}
            <Card>
              <CardHeader className="border-b border-neutral-100 pb-4">
                <CardTitle className="text-base font-semibold text-neutral-900">
                  Role Description & Scope
                </CardTitle>
                <CardDescription>
                  Detailed overview of day-to-day work, engineering challenges, and team mission.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-5">
                <Textarea
                  label="Role Overview & Mission"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a compelling overview of what the candidate will achieve..."
                  required
                />

                {/* Key Responsibilities Bullet Manager */}
                <div className="space-y-2 pt-2">
                  <label className="block text-sm font-medium text-neutral-700">
                    Key Responsibilities & Deliverables
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Add a key deliverable or daily task..."
                      value={newRespInput}
                      onChange={(e) => setNewRespInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddResponsibility();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={handleAddResponsibility}
                    >
                      Add Point
                    </Button>
                  </div>

                  <ul className="space-y-2 pt-2">
                    {responsibilities.map((resp, idx) => (
                      <li
                        key={idx}
                        className="flex items-start justify-between gap-3 p-2.5 rounded-md bg-neutral-50 border border-neutral-200/80 text-xs text-neutral-700"
                      >
                        <span className="leading-relaxed flex-1">• {resp}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveResponsibility(idx)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Publication Status Selector */}
                <div className="pt-3 border-t border-neutral-100">
                  <Select
                    label="Publication State"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    options={[
                      { value: 'Active', label: 'Active (Accepting applications immediately)' },
                      { value: 'Paused', label: 'Paused (Draft / On-hold)' },
                      { value: 'Closed', label: 'Closed (Archived)' },
                    ]}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 py-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(ROUTES.JOB_LISTINGS)}
                >
                  Discard Changes
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab('preview')}
                  >
                    Preview Listing
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={isSubmitting}
                  >
                    {isEditing ? 'Update Job Listing' : 'Publish Job Listing'}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </form>
        )}

        {/* ============================================================ */}
        {/* TAB 2: LIVE APPLICANT PREVIEW                                */}
        {/* ============================================================ */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center justify-between">
              <span className="font-medium">
                Live Preview Mode: This is how your role appears to applicants and university placement cells.
              </span>
              <Button
                variant="outline"
                size="sm"
                className="bg-white"
                onClick={() => setActiveTab('form')}
              >
                Back to Edit
              </Button>
            </div>

            <Card className="overflow-hidden shadow-md">
              <div className="p-6 sm:p-8 bg-neutral-900 text-white space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="info">{type}</Badge>
                  <Badge variant="default" className="bg-white/20 text-white border-transparent">
                    {workMode}
                  </Badge>
                  <span className="text-xs text-neutral-400 font-medium">
                    Department: {department}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {title || 'Untitled Role'}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    {location || 'Location Not Specified'}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-emerald-400">
                    ${(Number(salaryMin) / 1000).toFixed(0)}k - ${(Number(salaryMax) / 1000).toFixed(0)}k / {salaryPeriod}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                    Deadline: {deadline || 'Open until filled'}
                  </span>
                </div>
              </div>

              <CardContent className="p-6 sm:p-8 space-y-6">
                {/* Skills */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    Target Tech Stack & Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs font-semibold px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Hard Eligibility */}
                {eligibility && (
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200/80">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-primary-600" />
                      Eligibility & Academic Prerequisites
                    </h4>
                    <p className="text-xs text-neutral-700">{eligibility}</p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                    About The Role
                  </h4>
                  <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                    {description || 'No description provided.'}
                  </p>
                </div>

                {/* Responsibilities */}
                {responsibilities.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Key Deliverables & Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {responsibilities.map((r, i) => (
                        <li key={i} className="text-sm text-neutral-700 flex items-start gap-2">
                          <span className="text-primary-600 font-bold">•</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>

              <CardFooter className="border-t border-neutral-100 bg-neutral-50 p-6 flex items-center justify-between">
                <span className="text-xs text-neutral-500">
                  Status: <strong className="text-neutral-900">{status}</strong>
                </span>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                >
                  Save & Publish Now
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
