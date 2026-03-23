// src/components/ExperienceForm.jsx

import React from 'react';
// Make sure you have created this CSS file
import './ExperienceForm.css'; 

const ExperienceForm = ({ experience, setResumeData }) => {

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedExperience = [...experience];
    updatedExperience[index] = { ...updatedExperience[index], [name]: value };
    setResumeData(prevData => ({ ...prevData, experience: updatedExperience }));
  };

  const addExperience = () => {
    const newExperience = {
      id: Date.now(), // simple unique id
      jobTitle: '',
      company: '',
      dates: '',
      description: ''
    };
    setResumeData(prevData => ({ ...prevData, experience: [...prevData.experience, newExperience] }));
  };

  const removeExperience = (index) => {
    const filteredExperience = experience.filter((_, i) => i !== index);
    setResumeData(prevData => ({ ...prevData, experience: filteredExperience }));
  };

  return (
    <div>
      {experience.map((exp, index) => (
        <div key={exp.id || index} className="experience-entry">
           <button onClick={() => removeExperience(index)} className="remove-btn">×</button>
           <div className="input-group-row">
                <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={exp.jobTitle}
                    onChange={(e) => handleChange(e, index)}
                />
                <input
                    type="text"
                    name="company"
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleChange(e, index)}
                />
           </div>
            <input
                type="text"
                name="dates"
                placeholder="e.g., 2021 - Present"
                value={exp.dates}
                onChange={(e) => handleChange(e, index)}
            />
            <textarea
                name="description"
                placeholder="Describe your role and achievements"
                value={exp.description}
                onChange={(e) => handleChange(e, index)}
            />
        </div>
      ))}
      <button onClick={addExperience} className="add-btn">+ Add</button>
    </div>
  );
};

// --- THIS IS THE LINE THAT WAS MISSING ---
export default ExperienceForm;