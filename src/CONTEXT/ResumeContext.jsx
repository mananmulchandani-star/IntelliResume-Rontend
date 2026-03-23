// src/CONTEXT/ResumeContext.jsx
import React, { createContext, useContext, useState } from 'react';

// Create the context
const ResumeContext = createContext();

// Create the provider component
export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);

  const addResume = (resumeData) => {
    setResumes(prev => [...prev, resumeData]);
    setCurrentResume(resumeData);
  };

  const updateResume = (id, updatedData) => {
    setResumes(prev => 
      prev.map(resume => 
        resume.id === id ? { ...resume, ...updatedData } : resume
      )
    );
    if (currentResume && currentResume.id === id) {
      setCurrentResume(prev => ({ ...prev, ...updatedData }));
    }
  };

  const deleteResume = (id) => {
    setResumes(prev => prev.filter(resume => resume.id !== id));
    if (currentResume && currentResume.id === id) {
      setCurrentResume(null);
    }
  };

  const value = {
    resumes,
    currentResume,
    addResume,
    updateResume,
    deleteResume,
    setCurrentResume
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};

// Export the context for consumption
export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

// Export the context itself (if needed for some components)
export default ResumeContext;