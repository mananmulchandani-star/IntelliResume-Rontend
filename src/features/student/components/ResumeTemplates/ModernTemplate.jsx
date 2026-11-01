import React from 'react';
import { Mail, Phone, MapPin, Calendar, CheckCircle2, ShieldCheck, ExternalLink } from 'lucide-react';

export default function ModernTemplate({ data = {}, verifiedSkills = [] }) {
  const {
    personalInfo = {},
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    achievements = [],
    workExperience = [],
    internships = [],
    extracurriculars = [],
    languages = [],
  } = data;

  const fullName = personalInfo.fullName || 'Anaisha Parvati';
  const jobTitle = personalInfo.jobTitle || 'Full Stack Engineer';
  const phone = personalInfo.phone || '+1 (555) 234-5678';
  const email = personalInfo.email || 'anaisha.parvati@university.edu';
  const location = personalInfo.location || 'San Francisco, CA';
  const dateOfBirth = personalInfo.dateOfBirth;
  const about = personalInfo.about || personalInfo.summary || personalInfo.aboutMe ||
    'Proactive software engineering student with proven project leadership and hands-on full-stack development experience. Committed to writing clean, maintainable code and solving real-world challenges using modern web stacks.';

  const safeSkills = Array.isArray(skills)
    ? skills.map(s => (typeof s === 'string' ? s : s.name || s.skill || '')).filter(Boolean)
    : [];

  const safeExperience = Array.isArray(workExperience) && workExperience.length > 0
    ? workExperience
    : Array.isArray(data.experience) ? data.experience : [];

  const safeInternships = Array.isArray(internships) ? internships : [];
  const safeEducation = Array.isArray(education) ? education : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeCertifications = Array.isArray(certifications)
    ? certifications.map(c => (typeof c === 'string' ? c : c.name || '')).filter(Boolean)
    : [];
  const safeLanguages = Array.isArray(languages) ? languages : [];
  const safeExtracurriculars = Array.isArray(extracurriculars) ? extracurriculars : [];

  const isSkillVerified = (skillName) => {
    return Array.isArray(verifiedSkills) && verifiedSkills.some(
      s => s.toLowerCase() === skillName.toLowerCase()
    );
  };

  return (
    <div
      id="resume-preview-document"
      className="w-full bg-white text-neutral-800 shadow-md mx-auto print:shadow-none print:m-0 print:p-0"
      style={{
        minHeight: '297mm',
        maxWidth: '210mm',
        padding: '16mm 18mm',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Header */}
      <header className="border-b border-neutral-200 pb-5 mb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
            {fullName}
          </h1>
          <p className="text-sm font-semibold text-neutral-600 mt-0.5">
            {jobTitle}
          </p>
        </div>

        <div className="flex flex-wrap md:flex-col md:items-end gap-x-4 gap-y-1 text-xs text-neutral-500">
          {email && (
            <span className="inline-flex items-center gap-1.5 hover:text-neutral-900 transition-colors">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              {email}
            </span>
          )}
          {phone && (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              {phone}
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {location}
            </span>
          )}
          {dateOfBirth && (
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-400" />
              {dateOfBirth}
            </span>
          )}
        </div>
      </header>

      {/* Summary */}
      {about && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-neutral-600">
            {about}
          </p>
        </section>
      )}

      {/* Experience */}
      {safeExperience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            Experience
          </h2>
          <div className="space-y-3">
            {safeExperience.map((exp, idx) => (
              <div key={idx} className="text-xs pl-3 border-l-2 border-neutral-200">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-neutral-900 text-xs">
                    {exp.position || exp.jobTitle || 'Role'}
                  </h3>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {exp.startDate || exp.dates ? `${exp.startDate || ''} - ${exp.endDate || 'Present'}` : exp.dates}
                  </span>
                </div>
                <div className="text-neutral-500 font-medium text-[11px] mb-1">
                  {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                </div>
                {exp.description && (
                  <p className="text-neutral-600 leading-normal whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Internships */}
      {safeInternships.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            Internships
          </h2>
          <div className="space-y-3">
            {safeInternships.map((intern, idx) => (
              <div key={idx} className="text-xs pl-3 border-l-2 border-neutral-200">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-neutral-900 text-xs">
                    {intern.position || 'Intern'}
                  </h3>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {intern.startDate ? `${intern.startDate} - ${intern.endDate || 'Present'}` : intern.duration}
                  </span>
                </div>
                <div className="text-neutral-500 font-medium text-[11px] mb-1">
                  {intern.company}{intern.location ? ` | ${intern.location}` : ''}
                </div>
                {intern.description && (
                  <p className="text-neutral-600 leading-normal whitespace-pre-line">
                    {intern.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {safeEducation.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            Education
          </h2>
          <div className="space-y-2.5">
            {safeEducation.map((edu, idx) => (
              <div key={idx} className="text-xs pl-3 border-l-2 border-neutral-200">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-neutral-900">{edu.degree || 'Degree'}</span>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    {edu.year || edu.dates}
                  </span>
                </div>
                <div className="text-neutral-600 text-[11px] flex justify-between">
                  <span>{edu.institution || edu.school || edu.university}</span>
                  {edu.score && <span className="font-semibold text-neutral-700">GPA: {edu.score}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {safeProjects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            Projects
          </h2>
          <div className="space-y-2.5">
            {safeProjects.map((proj, idx) => (
              <div key={idx} className="text-xs pl-3 border-l-2 border-neutral-200">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                    {proj.title || 'Project Title'}
                    {proj.link && (
                      <span className="text-neutral-400 hover:text-neutral-700">
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    )}
                  </h3>
                  {proj.date && <span className="text-[11px] text-neutral-400">{proj.date}</span>}
                </div>
                {proj.technologies && (
                  <p className="text-[11px] text-neutral-500 font-medium mb-0.5">
                    {Array.isArray(proj.technologies) ? proj.technologies.join(' • ') : proj.technologies}
                  </p>
                )}
                {proj.description && (
                  <p className="text-neutral-600 leading-normal">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {safeSkills.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
              Technical & Core Skills
            </h2>
            {verifiedSkills.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Competencies
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {safeSkills.map((skill, idx) => {
              const verified = isSkillVerified(skill);
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full text-xs transition-colors ${
                    verified
                      ? 'bg-neutral-900 text-white font-medium shadow-xs'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {skill}
                  {verified && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  )}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* Languages & Extracurriculars */}
      {(safeLanguages.length > 0 || safeExtracurriculars.length > 0 || safeCertifications.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1 border-t border-neutral-100">
          {safeLanguages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                Languages
              </h2>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {safeLanguages.map((l, i) => (
                  <span key={i} className="bg-neutral-50 px-2 py-0.5 rounded border border-neutral-200 text-neutral-700">
                    {typeof l === 'string' ? l : `${l.language} (${l.proficiency || 'Proficient'})`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {safeCertifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-1.5">
                Certifications
              </h2>
              <ul className="space-y-0.5 text-neutral-700 text-[11px]">
                {safeCertifications.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-neutral-400" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
