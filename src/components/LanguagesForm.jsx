import React, { useState } from 'react';
import './FormStyles.css';

const LanguagesForm = ({ languages = [], setResumeData }) => {
  const [currentLang, setCurrentLang] = useState('');
  const addLanguage = () => {
    if (currentLang && !languages.includes(currentLang)) {
      setResumeData(prev => ({ ...prev, languages: [...prev.languages, currentLang] }));
      setCurrentLang('');
    }
  };
  const removeLanguage = (lang) => {
    setResumeData(prev => ({ ...prev, languages: prev.languages.filter(l => l !== lang) }));
  };
  return (
    <div>
      <div className="tag-input-container">
        <input value={currentLang} onChange={e => setCurrentLang(e.target.value)} placeholder="Add a language" />
        <button onClick={addLanguage}>+</button>
      </div>
      <div className="tags-container">
        {languages.map(lang => (
          <span key={lang} className="tag-item">
            {lang}
            <button onClick={() => removeLanguage(lang)}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
};
export default LanguagesForm;