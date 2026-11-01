import React from 'react';
import { Mail, Phone, MapPin, Calendar, CheckCircle2, Award } from 'lucide-react';

export default function ProfessionalTemplate({ data = {}, verifiedSkills = [] }) {
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
  const jobTitle = personalInfo.jobTitle || 'Computer Science Student';
  const phone = personalInfo.phone || '+1 (555) 234-5678';
  const email = personalInfo.email || 'anaisha.parvati@university.edu';
  const location = personalInfo.location || 'San Francisco, CA';
  const dateOfBirth = personalInfo.dateOfBirth;
  const about = personalInfo.about || personalInfo.summary || personalInfo.aboutMe ||
    'Dedicated and analytical computer science student with a strong foundation in software engineering, algorithms, and web development. Passionate about building robust scalable solutions and eager to apply technical skills in high-impact environments.';

  // Normalize arrays
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
  const safeAchievements = Array.isArray(achievements)
    ? achievements.map(a => (typeof a === 'string' ? a : a.title || '')).filter(Boolean)
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
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Top Accent Bar */}
      <div className="w-full h-1.5 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 rounded-t-sm mb-6" />

      {/* Header */}
      <header className="border-b-2 border-neutral-200 pb-5 mb-5 text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-neutral-900 mb-1">
          {fullName}
        </h1>
        <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mb-3">
          {jobTitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-xs text-neutral-600">
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
      </header>

      {/* Professional Summary */}
      {about && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-neutral-700 text-justify">
            {about}
          </p>
        </section>
      )}

      {/* Work Experience */}
      {safeExperience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2">
            Work Experience
          </h2>
          <div className="space-y-3">
            {safeExperience.map((exp, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-semibold text-neutral-900">
                  <span className="text-xs font-bold">{exp.position || exp.jobTitle || 'Role'}</span>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    {exp.startDate || exp.dates ? `${exp.startDate || ''} - ${exp.endDate || ''}` : exp.dates}
                  </span>
                </div>
                <div className="text-blue-700 font-medium text-[11px] mb-1">
                  {exp.company}{exp.location ? ` • ${exp.location}` : ''}
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
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2">
            Internships
          </h2>
          <div className="space-y-3">
            {safeInternships.map((intern, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-semibold text-neutral-900">
                  <span className="text-xs font-bold">{intern.position || 'Intern'}</span>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    {intern.startDate ? `${intern.startDate} - ${intern.endDate || 'Present'}` : intern.duration}
                  </span>
                </div>
                <div className="text-blue-700 font-medium text-[11px] mb-1">
                  {intern.company}{intern.location ? ` • ${intern.location}` : ''}
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
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2.5">
            {safeEducation.map((edu, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-semibold text-neutral-900">
                  <span>{edu.degree || 'Degree Program'}</span>
                  <span className="text-[11px] text-neutral-500 font-normal">
                    {edu.year || edu.dates || 'Graduation Year'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-neutral-600 text-[11px]">
                  <span className="font-medium text-neutral-700">{edu.institution || edu.school || edu.university}</span>
                  {edu.score && (
                    <span className="bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      GPA / Score: {edu.score}
                    </span>
                  )}
                </div>
                {edu.details && (
                  <p className="text-neutral-500 text-[11px] mt-0.5">{edu.details}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {safeProjects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2">
            Projects
          </h2>
          <div className="space-y-2.5">
            {safeProjects.map((proj, idx) => (
              <div key={idx} className="text-xs">
                <div className="flex justify-between items-baseline font-semibold text-neutral-900">
                  <span className="font-bold text-neutral-900">{proj.title || 'Project'}</span>
                  {proj.link && (
                    <span className="text-[10px] text-blue-600 underline font-normal">
                      {proj.link}
                    </span>
                  )}
                </div>
                {proj.technologies && (
                  <p className="text-[11px] text-neutral-500 mb-0.5 italic">
                    Tech Stack: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
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

      {/* Skills with Verification Badges */}
      {safeSkills.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-1 mb-2">
            <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest">
              Skills & Competencies
            </h2>
            {verifiedSkills.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Award className="w-3 h-3 text-emerald-600" />
                {verifiedSkills.length} Verified
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {safeSkills.map((skill, idx) => {
              const verified = isSkillVerified(skill);
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded border font-medium ${
                    verified
                      ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-2xs'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                  }`}
                >
                  {skill}
                  {verified && (
                    <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" aria-label="Verified Skill" />
                  )}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* Languages & Certifications Grid */}
      {(safeLanguages.length > 0 || safeCertifications.length > 0 || safeAchievements.length > 0 || safeExtracurriculars.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          {safeLanguages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2">
                Languages
              </h2>
              <div className="space-y-1">
                {safeLanguages.map((l, i) => (
                  <div key={i} className="flex justify-between text-neutral-700 text-[11px]">
                    <span className="font-medium">{typeof l === 'string' ? l : l.language}</span>
                    <span className="text-neutral-500">{typeof l === 'object' ? l.proficiency : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {safeCertifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2">
                Certifications
              </h2>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 text-[11px]">
                {safeCertifications.map((cert, i) => (
                  <li key={i}>{cert}</li>
                ))}
              </ul>
            </div>
          )}

          {safeAchievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2">
                Achievements
              </h2>
              <ul className="list-disc list-inside space-y-1 text-neutral-700 text-[11px]">
                {safeAchievements.map((ach, i) => (
                  <li key={i}>{ach}</li>
                ))}
              </ul>
            </div>
          )}

          {safeExtracurriculars.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-widest border-b border-neutral-200 pb-1 mb-2">
                Activities & Leadership
              </h2>
              <div className="space-y-1">
                {safeExtracurriculars.map((act, i) => (
                  <div key={i} className="text-[11px] text-neutral-700">
                    <span className="font-semibold">{act.role}</span>
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
