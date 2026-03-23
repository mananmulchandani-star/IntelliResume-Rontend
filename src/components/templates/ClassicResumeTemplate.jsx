// src/components/templates/ClassicResumeTemplate.jsx

import React from 'react';
import './ClassicResumeTemplate.css';

const ClassicResumeTemplate = ({ data = {} }) => {
    // Destructure data with robust fallbacks
    const {
        fullName = 'ANAISHA PARVATI',
        jobTitle = 'ENGINEERING STUDENT',
        phone, email, address, aboutMe,
        education = [],
        skills = [],
        // --- CHANGE 1: Work Experience is now empty by default ---
        // It will only be populated if the AI provides it or the user adds it manually.
        experience = [], 
        references = [],
        // --- CHANGE 2: Languages section defaults to English and Hindi ---
        languages = ['English', 'Hindi'],
    } = data;

    return (
        <div className="resume-paper-modern">
            {/* === TOP HEADER: NAME AND TITLE === */}
            <header className="resume-header-modern">
                <h1>{fullName}</h1>
                <p>{jobTitle}</p>
            </header>

            {/* === TWO-COLUMN LAYOUT CONTAINER === */}
            <div className="resume-body-columns">
                
                {/* --- LEFT SIDEBAR --- */}
                <aside className="resume-sidebar">

                    {/* CONTACT SECTION */}
                    {(phone || email || address) && (
                        <section className="sidebar-section">
                            <h2>CONTACT</h2>
                            <div className="contact-list">
                                {phone && <span><strong>Phone:</strong> {phone}</span>}
                                {email && <span><strong>Email:</strong> {email}</span>}
                                {address && <span><strong>Address:</strong> {address}</span>}
                            </div>
                        </section>
                    )}

                    {/* EDUCATION SECTION */}
                    {education && education.length > 0 && (
                        <section className="sidebar-section">
                            <h2>EDUCATION</h2>
                            {education.map(edu => (
                                <div key={edu.id || edu.university} className="sidebar-item">
                                    <h3>{edu.university}</h3>
                                    <p>{edu.degree}</p>
                                    <em>{edu.dates}</em>
                                </div>
                            ))}
                        </section>
                    )}
                    
                    {/* SKILLS SECTION */}
                    {skills && skills.length > 0 && (
                        <section className="sidebar-section">
                            <h2>SKILLS</h2>
                            <ul className="skills-list-sidebar">
                                {skills.map((skill, index) => <li key={index}>{skill}</li>)}
                            </ul>
                        </section>
                    )}

                    {/* --- NEW LANGUAGES SECTION --- */}
                    {languages && languages.length > 0 && (
                        <section className="sidebar-section">
                            <h2>LANGUAGES</h2>
                            <ul className="languages-list-sidebar">
                                {languages.map((lang, index) => <li key={index}>{lang}</li>)}
                            </ul>
                        </section>
                    )}

                    {/* REFERENCES SECTION */}
                    {references && references.length > 0 && (
                        <section className="sidebar-section">
                            <h2>REFERENCES</h2>
                            {references.map(ref => (
                                <div key={ref.id || ref.name} className="sidebar-item">
                                    <h3>{ref.name}</h3>
                                    <p>{ref.title}</p>
                                    <em>{ref.contact}</em>
                                </div>
                            ))}
                        </section>
                    )}
                </aside>

                {/* --- RIGHT MAIN CONTENT --- */}
                <main className="resume-main-content">

                    {/* ABOUT ME SECTION */}
                    {aboutMe && (
                        <section className="main-section">
                            <h2>ABOUT ME</h2>
                            <p className="about-me-text">{aboutMe}</p>
                        </section>
                    )}

                    {/* WORK EXPERIENCE SECTION (Conditionally Rendered) */}
                    {experience && experience.length > 0 && (
                        <section className="main-section">
                            <h2>WORK EXPERIENCE</h2>
                            {experience.map(exp => (
                                <div key={exp.id || exp.company} className="experience-item-main">
                                    <h3>{exp.jobTitle}</h3>
                                    <h4>{exp.company} | {exp.dates}</h4>
                                    <p>{exp.description}</p>
                                </div>
                            ))}
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ClassicResumeTemplate;