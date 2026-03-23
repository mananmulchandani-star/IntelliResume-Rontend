import React from 'react';
import './FormStyles.css';

const EducationForm = ({ education = [], setResumeData }) => {
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [name]: value };
    setResumeData(prev => ({ ...prev, education: updatedEducation }));
  };
  const addEducation = () => {
    const newEducation = { id: Date.now(), university: '', degree: '', dates: '' };
    setResumeData(prev => ({ ...prev, education: [...(prev.education || []), newEducation] }));
  };
  const removeEducation = (index) => {
    setResumeData(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== index) }));
  };
  return (
    <div>
      {education.map((edu, index) => (
        <div key={edu.id} className="form-entry">
          <button onClick={() => removeEducation(index)} className="remove-btn">×</button>
          <div className="input-group">
            <input name="university" placeholder="University/College" value={edu.university || ''} onChange={e => handleChange(e, index)} />
            <input name="degree" placeholder="Degree" value={edu.degree || ''} onChange={e => handleChange(e, index)} />
          </div>
          <input name="dates" placeholder="Date Range" value={edu.dates || ''} onChange={e => handleChange(e, index)} />
        </div>
      ))}
      <button onClick={addEducation} className="add-btn">+ Add Education</button>
    </div>
  );
};
export default EducationForm;