// src/features/student/pages/ResumeEditor.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { ROUTES } from '../../../constants/routes';
import { exportElementToPDF, exportResumeDataToPDF } from '../../../utils/pdfGenerator';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Button, Card, Input, Select, Badge, Tabs, Tab } from '../../../components/ui';
import { Textarea } from '../../../components/ui/Input';
import SkillVerificationModal from '../components/SkillVerificationModal';
import {
  ProfessionalTemplate,
  ModernTemplate,
  CreativeTemplate,
  IRMSpecialTemplate,
  TwinGridTemplate,
  RESUME_TEMPLATES,
  getTemplateComponent,
} from '../components/ResumeTemplates';
import {
  Save,
  Download,
  FileDown,
  Sparkles,
  ShieldCheck,
  Plus,
  Trash2,
  Eye,
  ScanText,
  User,
  GraduationCap,
  Briefcase,
  Code2,
  FolderGit2,
  Globe,
  Award,
  Layers,
  Upload,
  Check,
} from 'lucide-react';

const INITIAL_RESUME_STATE = {
  id: 'resume-default',
  title: 'Full Stack Engineering Resume',
  selectedTemplate: 'Professional',
  lastModified: new Date().toISOString(),
  atsScore: 89,
  personalInfo: {
    fullName: 'Anaisha Parvati',
    jobTitle: 'Computer Science Engineering Student',
    email: 'anaisha.parvati@university.edu',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    dateOfBirth: '',
    photo: '',
    about: 'Dedicated and analytical computer science student with a strong foundation in software engineering, algorithms, and web development. Passionate about building robust scalable solutions and eager to apply technical skills in high-impact environments.',
  },
  education: [
    {
      degree: 'B.S. in Computer Science',
      institution: 'State Institute of Technology',
      year: '2022 - 2026',
      score: '3.88 GPA',
      details: 'Relevant coursework: Algorithms, Distributed Systems, Database Management',
    },
  ],
  skills: ['React', 'JavaScript', 'Node.js', 'Python', 'TailwindCSS', 'SQL', 'Git', 'Docker'],
  workExperience: [
    {
      position: 'Software Engineering Intern',
      company: 'TechFlow Solutions',
      startDate: 'Jun 2025',
      endDate: 'Aug 2025',
      location: 'San Francisco, CA',
      description: 'Engineered high-performance REST APIs in Node.js serving 45k+ daily active users. Reduced database query latency by 32% using Redis caching.',
    },
  ],
  internships: [],
  projects: [
    {
      title: 'InsightResume Portal',
      description: 'Engineered responsive AI-driven resume builder platform featuring live multi-template rendering and ATS analytics.',
      technologies: 'React, Node.js, TailwindCSS',
      link: 'github.com/anaisha/insight-resume',
      date: 'Jan 2026',
    },
    {
      title: 'Distributed Key-Value Store',
      description: 'Implemented Raft consensus algorithm with fault-tolerant leader election and log replication in Go.',
      technologies: 'Go, gRPC, Docker',
      date: 'Nov 2025',
    },
  ],
  certifications: ['AWS Certified Cloud Practitioner', 'Meta Frontend Developer Professional'],
  achievements: ['Finalist - Global Campus Hackathon 2025', "Dean's Honor List for 5 Consecutive Semesters"],
  languages: [
    { language: 'English', proficiency: 'Native / Bilingual' },
    { language: 'Hindi', proficiency: 'Native' },
  ],
  extracurriculars: [
    {
      role: 'Lead Student Organizer',
      organization: 'Google Developer Student Clubs (GDSC)',
      description: 'Coordinated technical workshops, hackathons, and speaker sessions for 400+ campus engineers.',
    },
  ],
};

export default function ResumeEditor() {
  const navigate = useNavigate();
  const location = useLocation();
  const previewRef = useRef(null);

  const [resumeData, setResumeData] = useState(() => {
    try {
      const fromNav = location.state?.resumeData;
      if (fromNav) return fromNav;

      const current = localStorage.getItem('currentResume');
      if (current) return JSON.parse(current);

      const all = localStorage.getItem('userResumes');
      if (all) {
        const parsed = JSON.parse(all);
        if (parsed.length > 0) return parsed[0];
      }
    } catch (e) {
      console.error('Error restoring resume state:', e);
    }
    return INITIAL_RESUME_STATE;
  });

  const [verifiedSkills, setVerifiedSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('verifiedSkills');
      return saved ? JSON.parse(saved) : ['React', 'JavaScript', 'Node.js'];
    } catch {
      return ['React', 'JavaScript'];
    }
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [skillToVerify, setSkillToVerify] = useState(null);

  // Auto-save debounced or on change to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('currentResume', JSON.stringify(resumeData));

      // Also update in userResumes list
      const savedResumes = JSON.parse(localStorage.getItem('userResumes') || '[]');
      const index = savedResumes.findIndex((r) => r.id === resumeData.id);
      if (index >= 0) {
        savedResumes[index] = resumeData;
      } else {
        savedResumes.unshift(resumeData);
      }
      localStorage.setItem('userResumes', JSON.stringify(savedResumes));
    } catch (e) {
      console.error('Error auto-saving resume:', e);
    }
  }, [resumeData]);

  // Nested field handlers
  const handlePersonalInfoChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const handleTemplateChange = (templateName) => {
    setResumeData((prev) => ({
      ...prev,
      selectedTemplate: templateName,
    }));
  };

  // Education handlers
  const handleAddEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { degree: '', institution: '', year: '', score: '', details: '' },
      ],
    }));
  };

  const handleUpdateEducation = (index, field, value) => {
    setResumeData((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const handleDeleteEducation = (index) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Experience handlers
  const handleAddExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { position: '', company: '', startDate: '', endDate: '', location: '', description: '' },
      ],
    }));
  };

  const handleUpdateExperience = (index, field, value) => {
    setResumeData((prev) => {
      const updated = [...prev.workExperience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, workExperience: updated };
    });
  };

  const handleDeleteExperience = (index) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  // Projects handlers
  const handleAddProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: '', description: '', technologies: '', link: '', date: '' },
      ],
    }));
  };

  const handleUpdateProject = (index, field, value) => {
    setResumeData((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, projects: updated };
    });
  };

  const handleDeleteProject = (index) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // Skills handlers
  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (resumeData.skills.includes(trimmed)) {
      setNewSkillInput('');
      return;
    }
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmed],
    }));
    setNewSkillInput('');
  };

  const handleDeleteSkill = (skillToDelete) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToDelete),
    }));
  };

  // Photo upload handler
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePersonalInfoChange('photo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // PDF Export
  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      // Guaranteed isolated PDF containing strictly the resume page (zero editor UI)
      await exportResumeDataToPDF(resumeData, verifiedSkills);
    } catch (err) {
      console.error('PDF export error:', err);
      if (previewRef.current) {
        const candidateName = resumeData.personalInfo?.fullName || resumeData.title || 'Resume';
        const fileName = `${candidateName.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_')}_InsightResume.pdf`;
        await exportElementToPDF(previewRef.current, fileName);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleManualSave = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Render selected template
  const SelectedTemplateComponent = getTemplateComponent(resumeData.selectedTemplate);

  return (
    <DashboardLayout
      title="Resume Editor"
      subtitle="Refine your resume content with live side-by-side template rendering and verified skills."
      actions={
        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 animate-fade-in">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ScanText className="w-3.5 h-3.5" />}
            onClick={() => navigate(ROUTES.RESUME_INTELLIGENCE)}
          >
            ATS Scan
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={isExporting}
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExportPDF}
          >
            Download PDF
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Top Control Bar: Template Selector */}
        <div className="bg-white p-3 rounded-lg border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Template:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {RESUME_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleTemplateChange(tmpl.name)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    resumeData.selectedTemplate === tmpl.name
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {tmpl.name}
                  {tmpl.badge && (
                    <span
                      className={`ml-1.5 text-[9px] px-1 py-0.2 rounded font-normal ${
                        resumeData.selectedTemplate === tmpl.name
                          ? 'bg-white/20 text-white'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {tmpl.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ShieldCheck className="w-4 h-4 text-emerald-600" />}
              onClick={() => {
                setSkillToVerify(null);
                setIsVerifyModalOpen(true);
              }}
            >
              Verify Skills ({verifiedSkills.length})
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Save className="w-3.5 h-3.5" />}
              onClick={handleManualSave}
            >
              Save
            </Button>
          </div>
        </div>

        {/* Two-Column Workspace: Left Form, Right Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Editing Forms (5 Cols on large) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-neutral-200 shadow-xs overflow-hidden">
              {/* Form Navigation Tabs */}
              <div className="flex border-b border-neutral-200 overflow-x-auto bg-neutral-50/70 p-1.5 gap-1">
                {[
                  { id: 'personal', label: 'Personal', icon: User },
                  { id: 'education', label: 'Education', icon: GraduationCap },
                  { id: 'experience', label: 'Experience', icon: Briefcase },
                  { id: 'projects', label: 'Projects', icon: FolderGit2 },
                  { id: 'skills', label: 'Skills', icon: Code2 },
                  { id: 'more', label: 'More', icon: Layers },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                          : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: Personal Info */}
              {activeTab === 'personal' && (
                <div className="p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Contact & Identification
                  </h4>
                  <Input
                    label="Full Name"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                  />
                  <Input
                    label="Job Title / Professional Headline"
                    value={resumeData.personalInfo.jobTitle}
                    onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Email Address"
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    />
                    <Input
                      label="Phone Number"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Location"
                      placeholder="e.g. San Francisco, CA"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                    />
                    <Input
                      label="Date of Birth (Optional)"
                      placeholder="e.g. 15 March 2003"
                      value={resumeData.personalInfo.dateOfBirth || ''}
                      onChange={(e) => handlePersonalInfoChange('dateOfBirth', e.target.value)}
                    />
                  </div>

                  {/* Photo Upload (Required for IRM Special) */}
                  <div className="pt-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Profile Photo (Featured in IRM Special Template)
                    </label>
                    <div className="flex items-center gap-3">
                      {resumeData.personalInfo.photo ? (
                        <img
                          src={resumeData.personalInfo.photo}
                          alt="Profile Preview"
                          className="w-12 h-12 rounded-lg object-cover border border-neutral-300"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-400">
                          <User className="w-6 h-6" />
                        </div>
                      )}
                      <label className="cursor-pointer">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 shadow-2xs">
                          <Upload className="w-3.5 h-3.5" />
                          Choose Image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>
                  </div>

                  <Textarea
                    label="Professional Summary / About Me"
                    rows={4}
                    value={resumeData.personalInfo.about}
                    onChange={(e) => handlePersonalInfoChange('about', e.target.value)}
                  />
                </div>
              )}

              {/* Tab 2: Education */}
              {activeTab === 'education' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Education History
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={handleAddEducation}
                    >
                      Add Degree
                    </Button>
                  </div>

                  {resumeData.education.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-neutral-50/70 border border-neutral-200 space-y-3 relative group"
                    >
                      <button
                        type="button"
                        aria-label="Delete Education"
                        onClick={() => handleDeleteEducation(idx)}
                        className="absolute top-3 right-3 text-neutral-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <Input
                        label="Degree / Major"
                        value={edu.degree}
                        placeholder="e.g. B.S. in Computer Science"
                        onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                      />
                      <Input
                        label="Institution / University"
                        value={edu.institution || edu.school || edu.university || ''}
                        placeholder="e.g. State University of Technology"
                        onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Year / Duration"
                          value={edu.year || edu.dates || ''}
                          placeholder="e.g. 2022 - 2026"
                          onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                        />
                        <Input
                          label="GPA / Grade"
                          value={edu.score || ''}
                          placeholder="e.g. 3.88 / 4.0"
                          onChange={(e) => handleUpdateEducation(idx, 'score', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3: Experience */}
              {activeTab === 'experience' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Experience & Internships
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={handleAddExperience}
                    >
                      Add Position
                    </Button>
                  </div>

                  {resumeData.workExperience.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-neutral-50/70 border border-neutral-200 space-y-3 relative group"
                    >
                      <button
                        type="button"
                        aria-label="Delete Experience"
                        onClick={() => handleDeleteExperience(idx)}
                        className="absolute top-3 right-3 text-neutral-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <Input
                        label="Position / Role"
                        value={exp.position || exp.jobTitle || ''}
                        placeholder="e.g. Software Engineering Intern"
                        onChange={(e) => handleUpdateExperience(idx, 'position', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Company"
                          value={exp.company}
                          placeholder="e.g. TechFlow Solutions"
                          onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                        />
                        <Input
                          label="Location"
                          value={exp.location || ''}
                          placeholder="e.g. San Francisco, CA"
                          onChange={(e) => handleUpdateExperience(idx, 'location', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Start Date"
                          value={exp.startDate || ''}
                          placeholder="e.g. Jun 2025"
                          onChange={(e) => handleUpdateExperience(idx, 'startDate', e.target.value)}
                        />
                        <Input
                          label="End Date"
                          value={exp.endDate || ''}
                          placeholder="e.g. Aug 2025"
                          onChange={(e) => handleUpdateExperience(idx, 'endDate', e.target.value)}
                        />
                      </div>
                      <Textarea
                        label="Responsibilities & Impact"
                        rows={3}
                        value={exp.description}
                        placeholder="Quantify your achievements: e.g. Reduced latency by 25%..."
                        onChange={(e) => handleUpdateExperience(idx, 'description', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Projects */}
              {activeTab === 'projects' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Projects & Engineering
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={handleAddProject}
                    >
                      Add Project
                    </Button>
                  </div>

                  {resumeData.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-neutral-50/70 border border-neutral-200 space-y-3 relative group"
                    >
                      <button
                        type="button"
                        aria-label="Delete Project"
                        onClick={() => handleDeleteProject(idx)}
                        className="absolute top-3 right-3 text-neutral-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <Input
                        label="Project Title"
                        value={proj.title}
                        placeholder="e.g. Distributed Key-Value Store"
                        onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Technologies"
                          value={proj.technologies || ''}
                          placeholder="e.g. React, Node.js, Redis"
                          onChange={(e) => handleUpdateProject(idx, 'technologies', e.target.value)}
                        />
                        <Input
                          label="Link / Repository"
                          value={proj.link || ''}
                          placeholder="e.g. github.com/user/project"
                          onChange={(e) => handleUpdateProject(idx, 'link', e.target.value)}
                        />
                      </div>
                      <Textarea
                        label="Description & Implementation"
                        rows={3}
                        value={proj.description}
                        placeholder="Describe the problem, technologies deployed, and outcome..."
                        onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Skills */}
              {activeTab === 'skills' && (
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      Technical Skills
                    </h4>
                    <Badge variant="info" size="sm">
                      {resumeData.skills.length} skills listed
                    </Badge>
                  </div>

                  <form onSubmit={handleAddSkill} className="flex gap-2">
                    <Input
                      placeholder="Add a new skill (e.g. Docker, GraphQL, Kubernetes)"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                    />
                    <Button type="submit" variant="primary" size="md">
                      Add
                    </Button>
                  </form>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs text-neutral-500 font-semibold block">
                      Click the badge icon to verify a skill with AI:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill) => {
                        const isVerified = verifiedSkills.some(
                          (v) => v.toLowerCase() === skill.toLowerCase()
                        );
                        return (
                          <div
                            key={skill}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                              isVerified
                                ? 'bg-blue-50/80 border-blue-200 text-blue-900 font-semibold'
                                : 'bg-white border-neutral-200 text-neutral-800'
                            }`}
                          >
                            <span>{skill}</span>
                            {isVerified ? (
                              <span
                                title="Verified Skill"
                                className="inline-flex items-center text-emerald-600 ml-1"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                            ) : (
                              <button
                                type="button"
                                title="Verify this skill"
                                onClick={() => {
                                  setSkillToVerify(skill);
                                  setIsVerifyModalOpen(true);
                                }}
                                className="text-neutral-400 hover:text-primary-600 cursor-pointer ml-1"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              aria-label={`Remove ${skill}`}
                              onClick={() => handleDeleteSkill(skill)}
                              className="text-neutral-400 hover:text-rose-500 cursor-pointer ml-1"
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 6: More (Languages, Certifications) */}
              {activeTab === 'more' && (
                <div className="p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Certifications & Languages
                  </h4>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                      Certifications (One per line)
                    </label>
                    <Textarea
                      rows={3}
                      value={resumeData.certifications.join('\n')}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          certifications: e.target.value.split('\n').filter(Boolean),
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
                      Achievements & Honors (One per line)
                    </label>
                    <Textarea
                      rows={3}
                      value={resumeData.achievements.join('\n')}
                      onChange={(e) =>
                        setResumeData((prev) => ({
                          ...prev,
                          achievements: e.target.value.split('\n').filter(Boolean),
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* RIGHT COLUMN: Live Interactive Resume Preview (7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
              <span className="font-semibold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-neutral-400" /> Live Preview: {resumeData.selectedTemplate} Template
              </span>
              <span>A4 Document Aspect (210mm × 297mm)</span>
            </div>

            <div
              ref={previewRef}
              className="bg-neutral-100/80 p-4 sm:p-6 rounded-xl border border-neutral-200 overflow-x-auto shadow-inner"
            >
              <SelectedTemplateComponent
                data={resumeData}
                verifiedSkills={verifiedSkills}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Skill Verification Modal */}
      <SkillVerificationModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        skillToVerify={skillToVerify}
        availableSkills={resumeData.skills}
        jobTitle={resumeData.personalInfo.jobTitle}
        onVerificationComplete={(passed) => {
          const updated = Array.from(new Set([...verifiedSkills, ...passed]));
          setVerifiedSkills(updated);
          localStorage.setItem('verifiedSkills', JSON.stringify(updated));
        }}
      />
    </DashboardLayout>
  );
}
