// src/components/CreateResume.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateResume.css';

const CreateResume = () => {
  const navigate = useNavigate();
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: ''
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    stream: '',
    specificField: '',
    youAre: '',
    experienceLevel: '',
    targetRole: '',
    keySkills: ''
  });

  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleProfessionalInfoChange = (e) => {
    const { name, value } = e.target;
    setProfessionalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateResume = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = {
        prompt: additionalInstructions,
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: personalInfo.location,
        stream: professionalInfo.stream,
        specificField: professionalInfo.specificField,
        youAre: professionalInfo.youAre,
        experienceLevel: professionalInfo.experienceLevel,
        targetRole: professionalInfo.targetRole,
        keySkills: professionalInfo.keySkills
      };

      console.log('🚀 Sending to backend:', formData);

      const response = await fetch('http://localhost:5000/api/generate-resume-from-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();
      console.log('📨 Response from backend:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }

      if (!responseData.resumeData) {
        throw new Error('No resume data received from server');
      }

      // ✅ FIX: Save the AI-generated resume data to localStorage
      localStorage.setItem('currentResume', JSON.stringify(responseData.resumeData));
      localStorage.setItem('resumeFormData', JSON.stringify(formData));
      
      // ✅ FIX: Navigate to editor with state
      navigate('/editor', { 
        state: { 
          resumeData: responseData.resumeData,
          formData: formData
        }
      });

    } catch (err) {
      console.error('❌ Error creating resume:', err);
      setError(`Failed to create resume: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-resume-container">
      <h1>Create New Resume</h1>
      
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleCreateResume} className="resume-form">
        {/* Personal Information Section */}
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                placeholder="MANAN"
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                placeholder="manan@example.com"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
                placeholder="+919977001889"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={personalInfo.location}
                onChange={handlePersonalInfoChange}
                placeholder="IDR INDIA"
              />
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="form-section">
          <h2>Professional Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Stream/Background *</label>
              <select
                name="stream"
                value={professionalInfo.stream}
                onChange={handleProfessionalInfoChange}
                required
              >
                <option value="">Select Stream</option>
                <option value="Science">Science</option>
                <option value="Commerce">Commerce</option>
                <option value="Arts">Arts</option>
                <option value="Engineering">Engineering</option>
              </select>
            </div>
            <div className="form-group">
              <label>Specific Field *</label>
              <input
                type="text"
                name="specificField"
                value={professionalInfo.specificField}
                onChange={handleProfessionalInfoChange}
                placeholder="BCA"
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>You are a *</label>
              <select
                name="youAre"
                value={professionalInfo.youAre}
                onChange={handleProfessionalInfoChange}
                required
              >
                <option value="">Select</option>
                <option value="Student">Student</option>
                <option value="Professional">Professional</option>
                <option value="Fresher">Fresher</option>
              </select>
            </div>
            <div className="form-group">
              <label>Experience Level *</label>
              <select
                name="experienceLevel"
                value={professionalInfo.experienceLevel}
                onChange={handleProfessionalInfoChange}
                required
              >
                <option value="">Select</option>
                <option value="No Experience">No Experience</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Target Role *</label>
              <input
                type="text"
                name="targetRole"
                value={professionalInfo.targetRole}
                onChange={handleProfessionalInfoChange}
                placeholder="Software Testing"
                required
              />
            </div>
            <div className="form-group">
              <label>Key Skills (comma separated)</label>
              <input
                type="text"
                name="keySkills"
                value={professionalInfo.keySkills}
                onChange={handleProfessionalInfoChange}
                placeholder="e.g., JavaScript, React, Testing"
              />
            </div>
          </div>
        </div>

        {/* Additional Instructions */}
        <div className="form-section">
          <h2>Additional Instructions / Prompt</h2>
          <textarea
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder="I AM STUDENT OF MEDICAPS UNIVERSITY 2024-27 BATCH AND PREV EDUCATION WAS 12TH CBSE BOARDS IN CHOITHRAM SCHOOL MANIK BAGH"
            rows="4"
            className="prompt-textarea"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="create-resume-btn"
          disabled={loading}
        >
          {loading ? 'Creating Resume...' : 'Create Resume'}
        </button>
      </form>
    </div>
  );
};

export default CreateResume;