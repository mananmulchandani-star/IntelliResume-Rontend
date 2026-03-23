// src/components/SkillsForm.jsx

import React, { useState } from 'react';
// Make sure you have created this CSS file
import './SkillsForm.css';

const SkillsForm = ({ skills, setResumeData }) => {
  const [currentSkill, setCurrentSkill] = useState('');

  const addSkill = () => {
    // Trim whitespace and check if the skill is not empty and not already in the list
    const trimmedSkill = currentSkill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setResumeData(prev => ({ ...prev, skills: [...prev.skills, trimmedSkill] }));
      setCurrentSkill(''); // Clear the input field
    }
  };

  const removeSkill = (skillToRemove) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Allow adding skill by pressing Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      addSkill();
    }
  };

  return (
    <div>
      <div className="skill-input-container">
        <input
          type="text"
          value={currentSkill}
          onChange={(e) => setCurrentSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a skill"
        />
        <button onClick={addSkill}>+</button>
      </div>
      <div className="skills-tags-container">
        {skills.map(skill => (
          <span key={skill} className="skill-tag">
            {skill}
            <button onClick={() => removeSkill(skill)}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

// --- THIS IS THE MISSING LINE ---
export default SkillsForm;