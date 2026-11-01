import React from 'react';
import { Mail, Phone, MapPin, Calendar, CheckCircle2, ShieldCheck, Sparkles, User } from 'lucide-react';

export default function IRMSpecialTemplate({ data = {}, verifiedSkills = [] }) {
  const {
    personalInfo = {},
    education = [],
    skills = [],
    projects = [],
    workExperience = [],
    internships = [],
    extracurriculars = [],
    languages = [],
  } = data;

  const fullName = personalInfo.fullName || 'Anaisha Parvati';
  const jobTitle = personalInfo.jobTitle || 'Computer Science Graduate';
  const phone = personalInfo.phone || '+1 (555) 234-5678';
  const email = personalInfo.email || 'anaisha.parvati@university.edu';
  const location = personalInfo.location || 'San Francisco, CA';
  const dateOfBirth = personalInfo.dateOfBirth;
  const photo = personalInfo.photo;
  const about = personalInfo.about || personalInfo.summary || personalInfo.aboutMe ||
    'High-performing technology student recognized for academic excellence, technical agility, and problem-solving. Specialized in modern software frameworks, database architecture, and agile product development.';

  const safeSkills = Array.isArray(skills)
    ? skills.map(s => (typeof s === 'string' ? s : s.name || s.skill || '')).filter(Boolean)
    : [];

  const safeExperience = Array.isArray(workExperience) && workExperience.length > 0
    ? workExperience
    : Array.isArray(data.experience) ? data.experience : [];

  const safeInternships = Array.isArray(internships) ? internships : [];
  const safeEducation = Array.isArray(education) ? education : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
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
      {/* IRM Top Bar */}
      <div className="flex items-center justify-between border-b-2 border-indigo-600 pb-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
            IR
          </div>
          <span className="text-[11px] font-bold tracking-widest text-indigo-900 uppercase">
            InsightResume Verified Portfolio
          </span>
        </div>
        <span className="text-[10px] text-neutral-400 font-mono">
          ID: {personalInfo.studentId || 'IR-STUDENT-2026'}
        </span>
      </div>

      {/* Header with Photo support */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-5 pb-5 border-b border-neutral-200">
        {/* Photo Section */}
        <div className="shrink-0">
          {photo ? (
            <img
              src={photo}
              alt={fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover border-2 border-indigo-500 shadow-xs"
            />
          ) : (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-neutral-100 border-2 border-dashed border-indigo-200 flex flex-col items-center justify-center text-neutral-400">
              <User className="w-8 h-8 text-neutral-300 mb-1" />
              <span className="text-[9px] uppercase tracking-wider font-semibold text-neutral-500">Student Photo</span>
            </div>
          )}
        </div>

        {/* Identity Details */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            {fullName}
          </h1>
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mt-0.5 mb-2">
            {jobTitle}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-neutral-600">
            {phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                {phone}
              </span>
            )}
            {email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                {email}
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
        </div>
      </header>

      {/* Summary */}
      {about && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1 text-indigo-900 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-indigo-600 rounded-2xs" />
            Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-neutral-700 bg-neutral-50 p-3 rounded border border-neutral-200">
            {about}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {safeExperience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-indigo-900 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-indigo-600 rounded-2xs" />
            Professional Experience
          </h2>
          <div className="space-y-3">
            {safeExperience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-neutral-900">
                  <span>{exp.position || exp.jobTitle || 'Role'}</span>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    {exp.startDate || exp.dates ? `${exp.startDate || ''} - ${exp.endDate || 'Present'}` : exp.dates}
                  </span>
                </div>
                <div className="text-indigo-600 font-semibold text-[11px] mb-1">
                  {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                </div>
                {exp.description && (
                  <p className="text-neutral-600 leading-normal whitespace-pre-line text-[11px]">
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
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-indigo-900 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-indigo-600 rounded-2xs" />
            Industry Internships
          </h2>
          <div className="space-y-3">
            {safeInternships.map((intern, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-neutral-900">
                  <span>{intern.position || 'Intern'}</span>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    {intern.startDate ? `${intern.startDate} - ${intern.endDate || 'Present'}` : intern.duration}
                  </span>
                </div>
                <div className="text-indigo-600 font-semibold text-[11px] mb-1">
                  {intern.company}{intern.location ? ` • ${intern.location}` : ''}
                </div>
                {intern.description && (
                  <p className="text-neutral-600 leading-normal whitespace-pre-line text-[11px]">
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
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-indigo-900 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-indigo-600 rounded-2xs" />
            Academic Education
          </h2>
          <div className="space-y-2">
            {safeEducation.map((edu, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-neutral-900">
                  <span>{edu.degree || 'Degree'}</span>
                  <span className="text-[11px] text-neutral-500 font-normal">{edu.year || edu.dates}</span>
                </div>
                <div className="flex justify-between text-neutral-600 text-[11px]">
                  <span>{edu.institution || edu.school || edu.university}</span>
                  {edu.score && (
                    <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                      Score: {edu.score}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills with IRM Special Verified Styling */}
      {safeSkills.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <span className="w-1.5 h-3.5 bg-indigo-600 rounded-2xs" />
              Verified Technical Stack
            </h2>
            <div className="flex items-center gap-1 text-[10px] text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              InsightResume Certified
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {safeSkills.map((skill, idx) => {
              const verified = isSkillVerified(skill);
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded border font-medium ${
                    verified
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-2xs font-semibold'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                  }`}
                >
                  {skill}
                  {verified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                  )}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* Projects */}
      {safeProjects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-indigo-900 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-indigo-600 rounded-2xs" />
            Technical Projects
          </h2>
          <div className="space-y-2.5">
            {safeProjects.map((proj, idx) => (
              <div key={idx} className="text-xs border-l-2 border-indigo-500 pl-2.5">
                <div className="flex justify-between items-baseline font-bold text-neutral-900">
                  <span>{proj.title || 'Project'}</span>
                  {proj.link && <span className="text-[10px] text-indigo-600 font-mono">{proj.link}</span>}
                </div>
                {proj.technologies && (
                  <p className="text-[10px] text-indigo-600 font-medium">
                    {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                  </p>
                )}
                {proj.description && (
                  <p className="text-neutral-600 leading-normal text-[11px] mt-0.5">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Extracurriculars */}
      {(safeLanguages.length > 0 || safeExtracurriculars.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-neutral-200">
          {safeLanguages.length > 0 && (
            <div>
              <h3 className="font-bold text-neutral-900 text-xs mb-1">Languages</h3>
              <div className="space-y-0.5 text-[11px] text-neutral-600">
                {safeLanguages.map((l, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="font-medium text-neutral-800">{typeof l === 'string' ? l : l.language}</span>
                    <span>{typeof l === 'object' ? l.proficiency : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {safeExtracurriculars.length > 0 && (
            <div>
              <h3 className="font-bold text-neutral-900 text-xs mb-1">Extracurricular</h3>
              <div className="space-y-0.5 text-[11px] text-neutral-600">
                {safeExtracurriculars.map((act, i) => (
                  <div key={i}>
                    <span className="font-medium text-neutral-800">{act.role}</span>
                    {act.organization && <span> - {act.organization}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
