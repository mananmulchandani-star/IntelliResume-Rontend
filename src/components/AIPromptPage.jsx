import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AIPromptPage.css';

const AIPromptPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [resumeData, setResumeData] = useState(null);
  const [basicInfo, setBasicInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: ''
  });

  // Get backend URL from environment variable with localhost fallback
  const getBackendUrl = () => {
    // Use environment variable if available, otherwise fallback to localhost
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  };

  // ✅ CRITICAL FIX: Load formData from Dashboard navigation state
  useEffect(() => {
    console.log('📍 AIPrompt Location State:', location.state);
    
    if (location.state?.formData) {
      console.log('🎯 Received formData from Dashboard:', location.state.formData);
      const { formData } = location.state;
      
      // Update basic info from formData
      setBasicInfo({
        fullName: formData.fullName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        location: formData.location || ''
      });

      // Auto-fill prompt with form data for better AI results
      const autoPrompt = generatePromptFromFormData(formData);
      setPrompt(autoPrompt);
      
      // ✅ Save to localStorage as backup
      localStorage.setItem('resumeFormData', JSON.stringify(formData));
    } else {
      // ✅ Check localStorage as fallback
      const savedFormData = localStorage.getItem('resumeFormData');
      if (savedFormData) {
        try {
          const formData = JSON.parse(savedFormData);
          console.log('📦 Loaded formData from localStorage:', formData);
          setBasicInfo({
            fullName: formData.fullName || '',
            email: formData.email || '',
            phone: formData.phone || '',
            location: formData.location || ''
          });
        } catch (error) {
          console.error('Error parsing saved formData:', error);
        }
      }
    }
  }, [location.state]);

  // ✅ Generate comprehensive prompt from form data
  const generatePromptFromFormData = (formData) => {
    if (!formData) return '';
    
    return `
Create a professional resume for:
- Stream/Background: ${formData.stream || 'Not specified'}
- Specific Field: ${formData.field || 'Not specified'}
- User Type: ${formData.userType || 'Not specified'}
- Experience Level: ${formData.experienceLevel || 'Not specified'}
- Target Role: ${formData.targetRole || 'Not specified'}
- Key Skills: ${formData.skills || 'Not specified'}
${formData.prompt ? `- Additional Instructions: ${formData.prompt}` : ''}

Generate a complete resume with professional summary, education, skills, projects, and ${formData.experienceLevel !== 'no-experience' ? 'work experience' : 'focus on education and projects instead of work experience'}.
    `.trim();
  };

  const handleBasicInfoChange = (field, value) => {
    setBasicInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // ✅ UPDATED: Backend connection with environment variable support
  const generateResumeWithAI = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt describing your resume');
      return;
    }

    setIsLoading(true);
    setError('');
    setResumeData(null);

    try {
      const backendUrl = getBackendUrl();
      console.log('🚀 Sending AI request to:', backendUrl);
      console.log('📝 Prompt:', prompt);

      const response = await fetch(`${backendUrl}/api/generate-resume-from-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          fullName: basicInfo.fullName,
          email: basicInfo.email,
          phone: basicInfo.phone,
          location: basicInfo.location
        }),
      });

      console.log('📨 Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Received AI data:', data);

      // ✅ FIX: Handle different response formats
      let aiResumeData;
      if (data && data.resumeData) {
        aiResumeData = typeof data.resumeData === 'string' ? JSON.parse(data.resumeData) : data.resumeData;
      } else {
        aiResumeData = data;
      }

      // Process the AI data to ensure all fields are filled
      const processedData = processAIData(aiResumeData, basicInfo);
      
      console.log('🎯 Processed resume data ready for editor:', processedData);
      
      // ✅ AUTO-NAVIGATE: Immediately navigate to Editor with the generated data
      navigateToEditor(processedData);

    } catch (error) {
      console.error('❌ Error generating resume:', error);
      setError(`Failed to generate resume: ${error.message}. Using template instead...`);
      
      // Fallback: Create a basic resume structure with user info and auto-navigate
      const fallbackData = createFallbackResume(basicInfo, prompt);
      console.log('🔄 Using fallback data and navigating to editor');
      navigateToEditor(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ NEW: Auto-navigation function
  const navigateToEditor = (resumeData) => {
    console.log('💾 Saving resume data for editor...');
    
    // ✅ Save to localStorage for backup
    localStorage.setItem('currentResume', JSON.stringify(resumeData));
    
    // ✅ Get formData from location state or localStorage
    const formData = location.state?.formData || JSON.parse(localStorage.getItem('resumeFormData') || '{}');
    
    console.log('🎯 Auto-navigating to editor with:', { resumeData, formData });
    
    // ✅ Navigate with both resumeData and formData
    navigate('/editor', { 
      state: { 
        resumeData: resumeData,
        formData: formData
      } 
    });
  };

  // Process AI data to ensure no blank fields
  const processAIData = (aiData, basicInfo) => {
    return {
      fullName: aiData.fullName || basicInfo.fullName || 'Your Name',
      email: aiData.email || basicInfo.email || 'your.email@example.com',
      phone: aiData.phone || basicInfo.phone || '+1 234 567 8900',
      location: aiData.location || basicInfo.location || 'Your City, Country',
      jobTitle: aiData.jobTitle || 'Professional Title',
      summary: aiData.summary || `Experienced professional with expertise in relevant fields. ${prompt.substring(0, 100)}...`,
      
      education: aiData.education && aiData.education.length > 0 
        ? aiData.education 
        : [{
            degree: 'Bachelor of Science',
            school: 'University Name',
            year: '2020-2024',
            score: '3.8 GPA'
          }],
          
      skills: aiData.skills && aiData.skills.length > 0
        ? aiData.skills
        : ['Communication', 'Teamwork', 'Problem Solving', 'Project Management', 'Technical Skills'],
        
      projects: aiData.projects && aiData.projects.length > 0
        ? aiData.projects
        : [{
            title: 'Sample Project',
            description: 'Describe your project achievements and technologies used.'
          }],
          
      certifications: aiData.certifications || [],
      achievements: aiData.achievements || [],
      
      // Only include work experience if AI provided it
      workExperience: aiData.workExperience || aiData.experience || [],
      
      // ✅ NEW: Include all the new sections for EditorPage
      internships: aiData.internships || [],
      extracurriculars: aiData.extracurriculars || [],
      languages: aiData.languages || [
        { language: 'English', proficiency: 'Native' },
        { language: 'Hindi', proficiency: 'Native' }
      ]
    };
  };

  // Create fallback resume if AI fails
  const createFallbackResume = (basicInfo, userPrompt) => {
    return {
      fullName: basicInfo.fullName || 'Your Name',
      email: basicInfo.email || 'your.email@example.com',
      phone: basicInfo.phone || '+1 234 567 8900',
      location: basicInfo.location || 'Your City, Country',
      jobTitle: 'Professional Title',
      summary: `Dynamic professional seeking new opportunities. ${userPrompt.substring(0, 150)}...`,
      
      education: [{
        degree: 'Your Degree',
        school: 'Your University',
        year: 'Graduation Year',
        score: 'Your Grade/Score'
      }],
      
      skills: [
        'Communication',
        'Team Collaboration',
        'Problem Solving',
        'Project Management',
        'Technical Proficiency',
        'Leadership',
        'Adaptability'
      ],
      
      projects: [{
        title: 'Relevant Project',
        description: 'Describe your project, your role, technologies used, and key achievements.'
      }],
      
      certifications: [],
      achievements: [],
      workExperience: [], // Empty by default - user can add manually
      
      // ✅ NEW: Include all the new sections
      internships: [],
      extracurriculars: [],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Hindi', proficiency: 'Native' }
      ]
    };
  };

  const handleQuickStart = (templateType) => {
    const quickStartData = createQuickStartResume(templateType, basicInfo);
    
    // ✅ AUTO-NAVIGATE: For quick start templates too
    console.log('🚀 Quick start template selected, navigating to editor');
    navigateToEditor(quickStartData);
  };

  const createQuickStartResume = (templateType, basicInfo) => {
    const baseResume = {
      fullName: basicInfo.fullName || 'Your Name',
      email: basicInfo.email || 'your.email@example.com',
      phone: basicInfo.phone || '+1 234 567 8900',
      location: basicInfo.location || 'Your City, Country',
      summary: 'Professional summary highlighting your key strengths and career objectives.',
      education: [{
        degree: 'Your Degree',
        school: 'Your University', 
        year: 'Graduation Year',
        score: 'Your GPA/Score'
      }],
      skills: ['Skill 1', 'Skill 2', 'Skill 3', 'Skill 4', 'Skill 5'],
      projects: [{
        title: 'Your Project',
        description: 'Project description and your contributions.'
      }],
      certifications: [],
      achievements: [],
      workExperience: [], // Empty by default
      internships: [],
      extracurriculars: [],
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Hindi', proficiency: 'Native' }
      ]
    };

    switch (templateType) {
      case 'student':
        return {
          ...baseResume,
          jobTitle: 'Student / Recent Graduate',
          summary: 'Motivated student/recent graduate seeking to apply academic knowledge and develop professional skills in a challenging environment.',
          skills: ['Academic Research', 'Team Projects', 'Time Management', 'Communication', 'Adaptability', 'Technical Skills'],
          projects: [{
            title: 'Academic Project',
            description: 'Describe a significant academic project, your role, and outcomes achieved.'
          }]
        };
        
      case 'professional':
        return {
          ...baseResume,
          jobTitle: 'Professional Role',
          summary: 'Experienced professional with proven track record in delivering results and driving success in challenging environments.',
          skills: ['Leadership', 'Project Management', 'Strategic Planning', 'Team Development', 'Problem Solving', 'Communication'],
          workExperience: [{
            company: 'Previous Company',
            position: 'Your Position',
            startDate: 'Start Date',
            endDate: 'End Date', 
            description: 'Key responsibilities and achievements in this role.'
          }]
        };
        
      case 'career-change':
        return {
          ...baseResume,
          jobTitle: 'Target Position',
          summary: 'Seeking to leverage transferable skills and experience in a new challenging role. Quick learner with strong adaptability.',
          skills: ['Transferable Skill 1', 'Transferable Skill 2', 'Learning Agility', 'Adaptability', 'Communication', 'Problem Solving'],
          projects: [{
            title: 'Relevant Project/Initiative',
            description: 'Project that demonstrates your capability for the new career direction.'
          }]
        };
        
      default:
        return baseResume;
    }
  };

  return (
    <div className="ai-prompt-page">
      <div className="container">
        <header className="page-header">
          <h1>Create Your AI-Powered Resume</h1>
          <p>Tell me about your background, and I'll create a professional resume for you</p>
        </header>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="content-grid">
          {/* Basic Information Section */}
          <div className="basic-info-section">
            <h2>Basic Information</h2>
            <div className="basic-info-form">
              <div className="input-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={basicInfo.fullName}
                  onChange={(e) => handleBasicInfoChange('fullName', e.target.value)}
                />
              </div>
              
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={basicInfo.email}
                  onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                />
              </div>
              
              <div className="input-row">
                <div className="input-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={basicInfo.phone}
                    onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="input-group">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={basicInfo.location}
                    onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Prompt Section */}
          <div className="prompt-section">
            <h2>Describe Your Professional Background</h2>
            <div className="prompt-input-container">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Examples:
• 'Computer science graduate with internship experience in web development, proficient in React and Node.js'
• 'Marketing professional with 3 years experience in digital campaigns and social media strategy'
• 'Career changer from retail management seeking entry-level IT support role'
• 'Recent high school graduate with volunteer experience looking for administrative assistant position'

Include: Education, skills, projects, career goals, any work experience (optional)..."
                rows="6"
              />
              
              <div className="prompt-tips">
                <h4>💡 Tips for best results:</h4>
                <ul>
                  <li>Mention your education level and field</li>
                  <li>List your key skills and technologies</li>
                  <li>Describe projects or accomplishments</li>
                  <li>Include career objectives</li>
                  <li><strong>Work experience is optional</strong> - include only if relevant</li>
                </ul>
              </div>
            </div>

            <button 
              className={`generate-btn ${isLoading ? 'loading' : ''}`}
              onClick={generateResumeWithAI}
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Generating Your Resume...
                </>
              ) : (
                '✨ Generate Resume with AI'
              )}
            </button>
          </div>

          {/* Quick Start Templates */}
          <div className="quick-start-section">
            <h2>Quick Start Templates</h2>
            <p>Get started quickly with pre-built templates</p>
            
            <div className="template-cards">
              <div className="template-card" onClick={() => handleQuickStart('student')}>
                <div className="template-icon">🎓</div>
                <h3>Student / Graduate</h3>
                <p>Perfect for students and recent graduates with limited work experience</p>
                <div className="template-features">
                  <span>Education-focused</span>
                  <span>Project highlights</span>
                  <span>Skills emphasis</span>
                </div>
              </div>
              
              <div className="template-card" onClick={() => handleQuickStart('professional')}>
                <div className="template-icon">💼</div>
                <h3>Experienced Professional</h3>
                <p>For professionals with work experience to showcase</p>
                <div className="template-features">
                  <span>Work experience</span>
                  <span>Achievements</span>
                  <span>Career progression</span>
                </div>
              </div>
              
              <div className="template-card" onClick={() => handleQuickStart('career-change')}>
                <div className="template-icon">🔄</div>
                <h3>Career Change</h3>
                <p>Transitioning to a new field? Emphasize transferable skills</p>
                <div className="template-features">
                  <span>Transferable skills</span>
                  <span>Learning focus</span>
                  <span>Adaptability</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="action-bar">
          <button 
            className="back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPromptPage;