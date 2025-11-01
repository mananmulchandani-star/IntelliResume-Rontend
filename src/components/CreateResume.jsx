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
      // Validate required fields
      if (!personalInfo.fullName || !personalInfo.email) {
        throw new Error('Full Name and Email are required');
      }

      if (!professionalInfo.stream || !professionalInfo.specificField || !professionalInfo.youAre) {
        throw new Error('Please fill all professional information fields');
      }

      // Prepare form data for AI Prompt page
      const formData = {
        // Personal Info
        fullName: personalInfo.fullName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: personalInfo.location,
        
        // Professional Info
        stream: professionalInfo.stream,
        field: professionalInfo.specificField,
        userType: professionalInfo.youAre,
        experienceLevel: professionalInfo.experienceLevel,
        targetRole: professionalInfo.targetRole,
        skills: professionalInfo.keySkills,
        
        // AI Prompt
        userPrompt: additionalInstructions,
        prompt: additionalInstructions
      };

      console.log('🚀 Sending to AI Prompt page:', formData);

      // Navigate to AI Prompt page with all data
      navigate('/ai-prompt', { 
        state: { 
          formData: formData 
        }
      });

    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-resume-container">
      <div className="create-resume-header">
        <h1>Create New Resume</h1>
        <p>Fill in your details and we'll help you create a professional resume with AI</p>
      </div>
      
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleCreateResume} className="resume-form">
        {/* Personal Information Section */}
        <div className="form-section">
          <h2>📝 Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                placeholder="Enter your full name"
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
                placeholder="your.email@example.com"
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
                placeholder="Phone number"
              />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={personalInfo.location}
                onChange={handlePersonalInfoChange}
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="form-section">
          <h2>💼 Professional Information</h2>
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
                <option value="Computer Science">Computer Science</option>
                <option value="Business">Business</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Specific Field *</label>
              <input
                type="text"
                name="specificField"
                value={professionalInfo.specificField}
                onChange={handleProfessionalInfoChange}
                placeholder="Your specific field of study/work"
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
                <option value="Intern">Intern</option>
                <option value="Career Changer">Career Changer</option>
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
                placeholder="Desired job role"
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
                placeholder="List your key skills"
              />
            </div>
          </div>
        </div>

        {/* Additional Instructions */}
        <div className="form-section">
          <h2>📋 Additional Information</h2>
          <textarea
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder="Describe your education, projects, achievements, or any other relevant information..."
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
          {loading ? 'Processing...' : 'Continue to AI Assistant →'}
        </button>
      </form>
    </div>
  );
};

export default CreateResume;