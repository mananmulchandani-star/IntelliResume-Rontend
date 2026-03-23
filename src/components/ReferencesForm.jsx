import React from 'react';
import './FormStyles.css';

const ReferencesForm = ({ references = [], setResumeData }) => {
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRefs = [...references];
    updatedRefs[index] = { ...updatedRefs[index], [name]: value };
    setResumeData(prev => ({ ...prev, references: updatedRefs }));
  };
  const addReference = () => {
    const newRef = { id: Date.now(), name: '', title: '', contact: '' };
    setResumeData(prev => ({ ...prev, references: [...(prev.references || []), newRef] }));
  };
  const removeReference = (index) => {
    setResumeData(prev => ({ ...prev, references: prev.references.filter((_, i) => i !== index) }));
  };
  return (
    <div>
      {references.map((ref, index) => (
        <div key={ref.id} className="form-entry">
          <button onClick={() => removeReference(index)} className="remove-btn">×</button>
          <input name="name" placeholder="Reference's Name" value={ref.name || ''} onChange={e => handleChange(e, index)} />
          <input name="title" placeholder="Title & Company" value={ref.title || ''} onChange={e => handleChange(e, index)} />
          <textarea name="contact" placeholder="Contact Info" value={ref.contact || ''} onChange={e => handleChange(e, index)} rows={2} />
        </div>
      ))}
      <button onClick={addReference} className="add-btn">+ Add Reference</button>
    </div>
  );
};
export default ReferencesForm;