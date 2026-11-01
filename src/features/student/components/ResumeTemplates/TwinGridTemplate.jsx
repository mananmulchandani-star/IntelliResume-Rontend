import React from 'react';
import { Mail, Phone, MapPin, Calendar, CheckCircle2, ShieldCheck, Globe, GraduationCap, Briefcase, Award } from 'lucide-react';

export default function TwinGridTemplate({ data = {}, verifiedSkills = [] }) {
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
  const jobTitle = personalInfo.jobTitle || 'Computer Science Engineering Student';
  const phone = personalInfo.phone || '+1 (555) 234-5678';
  const email = personalInfo.email || 'anaisha.parvati@university.edu';
  const location = personalInfo.location || 'San Francisco, CA';
  const dateOfBirth = personalInfo.dateOfBirth;
  const website = personalInfo.website || personalInfo.linkedin;
  const about = personalInfo.about || personalInfo.summary || personalInfo.aboutMe ||
    'High-achieving computer science student with strong foundations in data structures, algorithms, and full-stack software development. Proven leadership experience through campus initiatives and technical hackathons.';

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
      {/* Top Header - Centered Name and Title */}
      <header className="text-center border-b-2 border-neutral-800 pb-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-neutral-900 mb-1">
          {fullName}
        </h1>
        <p className="text-sm font-semibold text-neutral-600 uppercase tracking-widest">
          {jobTitle}
        </p>
      </header>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: 4 Cols (~33%) */}
        <div className="md:col-span-4 space-y-6 md:border-r md:border-neutral-200 md:pr-5">
          {/* Contact Details */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
              Contact
            </h2>
            <div className="space-y-2 text-xs text-neutral-600">
              {phone && (
                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  <span className="break-all">{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  <span className="break-all">{email}</span>
                </div>
              )}
              {location && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  <span>{location}</span>
                </div>
              )}
              {website && (
                <div className="flex items-start gap-2">
                  <Globe className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  <span className="break-all text-[11px] text-blue-600">{website}</span>
                </div>
              )}
              {dateOfBirth && (
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                  <span>{dateOfBirth}</span>
                </div>
              )}
            </div>
          </section>

          {/* Skills */}
          {safeSkills.length > 0 && (
            <section>
              <div className="flex items-center justify-between border-b border-neutral-300 pb-1 mb-2.5">
                <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900">
                  Skills
                </h2>
                {verifiedSkills.length > 0 && (
                  <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Verified
                  </span>
                )}
              </div>
              <ul className="space-y-1.5">
                {safeSkills.map((skill, idx) => {
                  const verified = isSkillVerified(skill);
                  return (
                    <li
                      key={idx}
                      className={`text-xs flex items-center justify-between p-1 rounded ${
                        verified ? 'bg-neutral-100 font-semibold text-neutral-900' : 'text-neutral-700'
                      }`}
                    >
                      <span className="truncate">{skill}</span>
                      {verified && (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 ml-1" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Education */}
          {safeEducation.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
                Education
              </h2>
              <div className="space-y-3">
                {safeEducation.map((edu, idx) => (
                  <div key={idx} className="text-xs">
                    <p className="font-bold text-neutral-900 leading-tight">
                      {edu.degree || 'Degree Program'}
                    </p>
                    <p className="text-neutral-600 text-[11px] mt-0.5">
                      {edu.institution || edu.school || edu.university}
                    </p>
                    <p className="text-neutral-400 text-[10px]">{edu.year || edu.dates}</p>
                    {edu.score && (
                      <p className="text-[10px] font-semibold text-neutral-700 mt-0.5">
                        GPA: {edu.score}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {safeLanguages.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
                Languages
              </h2>
              <div className="space-y-1 text-xs">
                {safeLanguages.map((l, i) => (
                  <div key={i} className="flex justify-between text-neutral-700 text-[11px]">
                    <span className="font-medium">{typeof l === 'string' ? l : l.language}</span>
                    <span className="text-neutral-400">{typeof l === 'object' ? l.proficiency : ''}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {safeCertifications.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
                Certifications
              </h2>
              <ul className="space-y-1 text-[11px] text-neutral-600 list-disc list-inside">
                {safeCertifications.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column: 8 Cols (~67%) */}
        <div className="md:col-span-8 space-y-6">
          {/* Profile Statement */}
          {about && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
                Profile
              </h2>
              <p className="text-xs leading-relaxed text-neutral-700 text-justify">
                {about}
              </p>
            </section>
          )}

          {/* Internship Experience */}
          {safeInternships.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
                Internship Experience
              </h2>
              <div className="space-y-3.5">
                {safeInternships.map((intern, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-neutral-900">
                      <span>{intern.position || 'Intern'}</span>
                      <span className="text-[11px] text-neutral-500 font-normal">
                        {intern.startDate ? `${intern.startDate} - ${intern.endDate || 'Present'}` : intern.duration}
                      </span>
                    </div>
                    <div className="text-neutral-600 font-medium text-[11px] mb-1">
                      {intern.company}{intern.location ? ` | ${intern.location}` : ''}
                    </div>
                    {intern.description && (
                      <p className="text-neutral-600 leading-normal text-[11px]">
                        {intern.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Academic Projects */}
          {safeProjects.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
                Academic & Engineering Projects
              </h2>
              <div className="space-y-3">
                {safeProjects.map((proj, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-neutral-900">
                      <span>{proj.title || 'Project'}</span>
                      {proj.date && <span className="text-[10px] text-neutral-400 font-normal">{proj.date}</span>}
                    </div>
                    {proj.technologies && (
                      <p className="text-[10px] text-neutral-500 font-semibold mb-0.5">
                        Technologies: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                      </p>
                    )}
                    {proj.description && (
                      <p className="text-neutral-600 leading-normal text-[11px]">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Work Experience */}
          {safeExperience.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
                Work Experience
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
                    <div className="text-neutral-600 font-medium text-[11px] mb-1">
                      {exp.company}{exp.location ? ` | ${exp.location}` : ''}
                    </div>
                    {exp.description && (
                      <p className="text-neutral-600 leading-normal text-[11px]">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Co- and Extra-Curricular */}
          {safeExtracurriculars.length > 0 && (
            <section>
              <h2 className="text-xs font-black uppercase tracking-wider text-neutral-900 border-b border-neutral-300 pb-1 mb-2.5">
                Co- & Extra-Curricular
              </h2>
              <div className="space-y-2">
                {safeExtracurriculars.map((act, idx) => (
                  <div key={idx} className="text-[11px] text-neutral-600">
                    <span className="font-semibold text-neutral-900">{act.role}</span>
                    {act.organization && <span> - {act.organization}</span>}
                    {act.description && <p className="mt-0.5 text-neutral-500">{act.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
