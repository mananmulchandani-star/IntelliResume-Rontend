import React from 'react';
import { Mail, Phone, MapPin, Calendar, CheckCircle2, Sparkles, Award } from 'lucide-react';

export default function CreativeTemplate({ data = {}, verifiedSkills = [] }) {
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
  const jobTitle = personalInfo.jobTitle || 'Product Designer & Developer';
  const phone = personalInfo.phone || '+1 (555) 234-5678';
  const email = personalInfo.email || 'anaisha.parvati@university.edu';
  const location = personalInfo.location || 'San Francisco, CA';
  const dateOfBirth = personalInfo.dateOfBirth;
  const about = personalInfo.about || personalInfo.summary || personalInfo.aboutMe ||
    'Creative technologist blending user-centered design principles with clean software engineering. Passionate about building delightful digital products, interactive prototypes, and accessible user experiences.';

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
      {/* Decorative top header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-xl p-6 text-white mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest text-violet-200 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Portfolio & Resume
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {fullName}
            </h1>
            <p className="text-sm font-medium text-violet-100 mt-0.5">
              {jobTitle}
            </p>
          </div>

          <div className="flex flex-col gap-1 text-xs text-violet-100 bg-white/10 backdrop-blur-xs p-3 rounded-lg border border-white/20">
            {email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-violet-200" />
                {email}
              </span>
            )}
            {phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-violet-200" />
                {phone}
              </span>
            )}
            {location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-violet-200" />
                {location}
              </span>
            )}
            {dateOfBirth && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-violet-200" />
                {dateOfBirth}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* About Section */}
      {about && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-violet-900 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-violet-600" />
            About Me
          </h2>
          <p className="text-xs leading-relaxed text-neutral-600 bg-violet-50/50 p-3 rounded-lg border border-violet-100">
            {about}
          </p>
        </section>
      )}

      {/* Experience */}
      {safeExperience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-violet-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-violet-600" />
            Work Experience
          </h2>
          <div className="space-y-3">
            {safeExperience.map((exp, idx) => (
              <div key={idx} className="text-xs p-2.5 rounded-lg border border-neutral-100 hover:border-violet-200 transition-colors">
                <div className="flex justify-between items-baseline font-bold text-neutral-900">
                  <span className="text-xs text-neutral-900">{exp.position || exp.jobTitle || 'Role'}</span>
                  <span className="text-[11px] text-violet-700 font-medium">
                    {exp.startDate || exp.dates ? `${exp.startDate || ''} - ${exp.endDate || 'Present'}` : exp.dates}
                  </span>
                </div>
                <div className="text-neutral-500 font-medium text-[11px] mb-1">
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
          <h2 className="text-xs font-bold text-violet-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-violet-600" />
            Internships
          </h2>
          <div className="space-y-3">
            {safeInternships.map((intern, idx) => (
              <div key={idx} className="text-xs p-2.5 rounded-lg border border-neutral-100">
                <div className="flex justify-between items-baseline font-bold text-neutral-900">
                  <span className="text-xs text-neutral-900">{intern.position || 'Intern'}</span>
                  <span className="text-[11px] text-violet-700 font-medium">
                    {intern.startDate ? `${intern.startDate} - ${intern.endDate || 'Present'}` : intern.duration}
                  </span>
                </div>
                <div className="text-neutral-500 font-medium text-[11px] mb-1">
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

      {/* Projects */}
      {safeProjects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-violet-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-violet-600" />
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {safeProjects.map((proj, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className="font-bold text-neutral-900">{proj.title || 'Project'}</span>
                    {proj.link && (
                      <span className="text-[10px] text-violet-600 truncate max-w-[120px]">
                        {proj.link}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-neutral-600 text-[11px] leading-relaxed mb-2">
                      {proj.description}
                    </p>
                  )}
                </div>
                {proj.technologies && (
                  <div className="text-[10px] font-semibold text-violet-700 bg-violet-100/60 px-2 py-0.5 rounded w-fit">
                    {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {safeEducation.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold text-violet-900 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-violet-600" />
            Education
          </h2>
          <div className="space-y-2">
            {safeEducation.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline text-xs pb-1.5 border-b border-neutral-100">
                <div>
                  <span className="font-bold text-neutral-900">{edu.degree || 'Degree'}</span>
                  <div className="text-[11px] text-neutral-500">
                    {edu.institution || edu.school || edu.university}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-medium text-neutral-700">{edu.year || edu.dates}</span>
                  {edu.score && <div className="text-[10px] text-violet-600 font-semibold">GPA: {edu.score}</div>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {safeSkills.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-violet-900 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-violet-600" />
              Skills & Expertise
            </h2>
            {verifiedSkills.length > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                <Award className="w-3 h-3 text-violet-600" />
                Certified Verified Skills
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {safeSkills.map((skill, idx) => {
              const verified = isSkillVerified(skill);
              return (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border font-medium ${
                    verified
                      ? 'bg-violet-50 text-violet-900 border-violet-300 font-semibold shadow-2xs'
                      : 'bg-white text-neutral-700 border-neutral-200'
                  }`}
                >
                  {skill}
                  {verified && (
                    <CheckCircle2 className="w-3 h-3 text-violet-600 shrink-0" />
                  )}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer Details: Languages, Certifications, Extracurriculars */}
      {(safeLanguages.length > 0 || safeCertifications.length > 0 || safeExtracurriculars.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-neutral-100">
          {safeLanguages.length > 0 && (
            <div>
              <h3 className="font-bold text-neutral-900 text-xs mb-1">Languages</h3>
              <div className="flex flex-wrap gap-1.5">
                {safeLanguages.map((l, i) => (
                  <span key={i} className="text-[11px] bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">
                    {typeof l === 'string' ? l : `${l.language} (${l.proficiency || 'Fluent'})`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {safeCertifications.length > 0 && (
            <div>
              <h3 className="font-bold text-neutral-900 text-xs mb-1">Certifications</h3>
              <ul className="text-[11px] text-neutral-600 list-disc list-inside">
                {safeCertifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
