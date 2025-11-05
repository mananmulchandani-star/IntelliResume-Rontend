import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './DashboardPage.css';

// Icons (you can replace with actual icon library like react-icons)
const Icons = {
  Sun: () => <span>☀️</span>,
  Moon: () => <span>🌙</span>,
  Logout: () => <span>↪</span>,
  Create: () => <span>+</span>,
  AI: () => <span>AI</span>,
  Edit: () => <span>✎</span>,
  Delete: () => <span>🗑</span>,
  Calendar: () => <span>📅</span>,
  Document: () => <span>📄</span>,
  Close: () => <span>×</span>,
  Sparkle: () => <span>✨</span>,
  Robot: () => <span>🤖</span>
};

// Theme Context
const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const DashboardPage = () => {
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [userName, setUserName] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    location: '',
    dateOfBirth: '', // Added DOB field
    stream: '',
    field: '',
    userType: '',
    experienceLevel: '',
    targetRole: '',
    skills: '',
    prompt: ''
  });
  // Skill levels state - now with default values
  const [skillLevels, setSkillLevels] = useState({
    technical: 'intermediate',
    soft: 'intermediate',
    tools: 'intermediate'
  });
  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  const navigate = useNavigate();
  const aiPopupRef = useRef(null);

  // Theme provider value
  const themeValue = {
    darkMode,
    toggleDarkMode: () => {
      const newDarkMode = !darkMode;
      setDarkMode(newDarkMode);
      localStorage.setItem('darkMode', newDarkMode.toString());
    }
  };

  // Load user's existing resumes and user name
  useEffect(() => {
    const userResumes = JSON.parse(localStorage.getItem('userResumes')) || [];
    const loggedInUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    setUserName(loggedInUser.name || loggedInUser.email || 'User');
    setResumes(userResumes);
    
    // Debug: Check what's loaded
    console.log('Loaded resumes:', userResumes);
    console.log('Current user:', loggedInUser);
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.body.style.backgroundColor = '#0f172a';
    } else {
      document.body.classList.remove('dark-mode');
      document.body.style.backgroundColor = '#ffffff';
    }
  }, [darkMode]);

  // Close AI popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aiPopupRef.current && !aiPopupRef.current.contains(event.target)) {
        closeAIPopup();
      }
    };

    if (showAIPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAIPopup]);

  // Handle skill level change
  const handleSkillLevelChange = (category, level) => {
    setSkillLevels(prev => ({
      ...prev,
      [category]: level
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAiPromptChange = (e) => {
    setAiPrompt(e.target.value);
  };

  const handleCreateResume = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const comprehensivePrompt = `
      Create a professional resume with the following information:
      
      PERSONAL INFORMATION:
      - Full Name: ${formData.fullName || 'Not specified'}
      - Email: ${formData.email || 'Not specified'}
      - Phone: ${formData.phone || 'Not specified'} 
      - Location: ${formData.location || 'Not specified'}
      - Date of Birth: ${formData.dateOfBirth || 'Not specified'}
      
      PROFESSIONAL BACKGROUND:
      - Stream/Background: ${formData.stream}
      - Specific Field: ${formData.field}
      - User Type: ${formData.userType}
      - Experience Level: ${formData.experienceLevel}
      - Target Role: ${formData.targetRole}
      - User Provided Skills: ${formData.skills || 'None provided'}
      
      SKILL PROFICIENCY REQUIREMENTS:
      - Technical Skills Level: ${skillLevels.technical} (Programming languages, frameworks, technical expertise)
      - Soft Skills Level: ${skillLevels.soft} (Communication, teamwork, leadership, problem-solving)
      - Tools & Software Level: ${skillLevels.tools} (Development tools, software applications, platforms)
      
      IMPORTANT: Generate skills based on:
      1. Stream/Background: ${formData.stream}
      2. Target Role: ${formData.targetRole}
      3. Field: ${formData.field}
      4. User-specified skill proficiency levels
      
      Include appropriate skills for each category at the specified proficiency level.
      
      ADDITIONAL INSTRUCTIONS:
      ${formData.prompt}
      
      Generate a COMPLETE resume with ALL sections filled. Include:
      - Professional summary/objective
      - Education details (at least one entry)
      - Skills (generate relevant skills based on stream and proficiency levels)
      - Projects/Experience (at least one substantial project)
      - Certifications/Achievements if relevant
      - Work Experience ONLY if experience level is not "no-experience"
      
      Return as valid JSON that can be parsed by JSON.parse()
    `;

    try {
      console.log("Sending request to backend with prompt:", comprehensivePrompt);
      
      const response = await fetch('https://intelli-resume-backend.vercel.app/api/generate-resume-from-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: comprehensivePrompt })
      });

      if (response.ok) {
        const data = await response.json();
        let resumeData;
        
        if (typeof data === 'string') {
          try {
            resumeData = JSON.parse(data);
          } catch (parseError) {
            console.error('Error parsing string response:', parseError);
            if (data.resumeData) {
              resumeData = typeof data.resumeData === 'string' ? JSON.parse(data.resumeData) : data.resumeData;
            } else {
              throw new Error('Invalid response format from AI');
            }
          }
        } else if (data.resumeData) {
          resumeData = typeof data.resumeData === 'string' ? JSON.parse(data.resumeData) : data.resumeData;
        } else {
          resumeData = data;
        }
        
        // Ensure basic personal info is included
        if (formData.fullName) {
          resumeData.fullName = formData.fullName;
        }
        if (formData.email) {
          resumeData.email = formData.email;
        }
        if (formData.phone) {
          resumeData.phone = formData.phone;
        }
        if (formData.location) {
          resumeData.location = formData.location;
        }
        if (formData.dateOfBirth) {
          resumeData.dateOfBirth = formData.dateOfBirth;
        }
        if (formData.targetRole) {
          resumeData.jobTitle = formData.targetRole;
        }

        // Add skill levels to resume data
        resumeData.skillLevels = skillLevels;

        // Save resume to local storage
        const newResume = {
          id: Date.now(),
          title: `${formData.targetRole} - ${formData.field}`,
          created: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          data: resumeData
        };
        
        const updatedResumes = [...resumes, newResume];
        setResumes(updatedResumes);
        localStorage.setItem('userResumes', JSON.stringify(updatedResumes));
        
        setTimeout(() => {
          navigate('/editor', { 
            state: { 
              resumeData: resumeData,
              formData: formData,
              skillLevels: skillLevels
            } 
          });
        }, 500);
        
        setShowCreatePopup(false);
        setFormData(prev => ({
          fullName: prev.fullName,
          email: prev.email,
          phone: prev.phone,
          location: prev.location,
          dateOfBirth: prev.dateOfBirth,
          stream: '',
          field: '',
          userType: '',
          experienceLevel: '',
          targetRole: '',
          skills: '',
          prompt: ''
        }));
        // Reset skill levels to default
        setSkillLevels({
          technical: 'intermediate',
          soft: 'intermediate',
          tools: 'intermediate'
        });
      } else {
        const errorText = await response.text();
        let errorMessage = 'Failed to generate resume';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
        }
        
        showErrorAnimation(errorMessage);
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      setTimeout(() => {
        const fallbackData = createFallbackResume(formData);
        navigate('/editor', { 
          state: { 
            resumeData: fallbackData,
            formData: formData,
            skillLevels: skillLevels
          } 
        });
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWithAI = async () => {
    if (!aiPrompt.trim()) {
      showErrorAnimation('Please enter a prompt for the AI assistant');
      return;
    }

    setAiLoading(true);

    try {
      const comprehensivePrompt = `
        Create a professional resume based on the following user instructions:
        
        USER PROMPT:
        ${aiPrompt}
        
        ${formData.fullName ? `- Name: ${formData.fullName}` : ''}
        ${formData.email ? `- Email: ${formData.email}` : ''}
        ${formData.phone ? `- Phone: ${formData.phone}` : ''}
        ${formData.location ? `- Location: ${formData.location}` : ''}
        ${formData.dateOfBirth ? `- Date of Birth: ${formData.dateOfBirth}` : ''}
        ${formData.stream ? `- Background: ${formData.stream}` : ''}
        ${formData.field ? `- Field: ${formData.field}` : ''}
        ${formData.userType ? `- User Type: ${formData.userType}` : ''}
        ${formData.experienceLevel ? `- Experience: ${formData.experienceLevel}` : ''}
        ${formData.targetRole ? `- Target Role: ${formData.targetRole}` : ''}
        ${formData.skills ? `- User Skills: ${formData.skills}` : ''}
        
        SKILL PROFICIENCY REQUIREMENTS:
        - Technical Skills Level: ${skillLevels.technical} (Programming languages, frameworks, technical expertise)
        - Soft Skills Level: ${skillLevels.soft} (Communication, teamwork, leadership, problem-solving)
        - Tools & Software Level: ${skillLevels.tools} (Development tools, software applications, platforms)
        
        Generate skills appropriate for the user's background and target role at the specified proficiency levels.
        
        IMPORTANT: Generate a COMPLETE, professional resume with all necessary sections.
        Return as valid JSON that can be parsed by JSON.parse()
      `;

      const response = await fetch('https://intelli-resume-backend.vercel.app/api/generate-resume-from-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: comprehensivePrompt })
      });

      if (response.ok) {
        const data = await response.json();
        let resumeData;
        
        if (typeof data === 'string') {
          try {
            resumeData = JSON.parse(data);
          } catch (parseError) {
            console.error('Error parsing string response:', parseError);
            if (data.resumeData) {
              resumeData = typeof data.resumeData === 'string' ? JSON.parse(data.resumeData) : data.resumeData;
            } else {
              throw new Error('Invalid response format from AI');
            }
          }
        } else if (data.resumeData) {
          resumeData = typeof data.resumeData === 'string' ? JSON.parse(data.resumeData) : data.resumeData;
        } else {
          resumeData = data;
        }

        // Ensure basic personal info is included
        if (formData.fullName) {
          resumeData.fullName = formData.fullName;
        }
        if (formData.email) {
          resumeData.email = formData.email;
        }
        if (formData.phone) {
          resumeData.phone = formData.phone;
        }
        if (formData.location) {
          resumeData.location = formData.location;
        }
        if (formData.dateOfBirth) {
          resumeData.dateOfBirth = formData.dateOfBirth;
        }

        // Add skill levels to resume data
        resumeData.skillLevels = skillLevels;

        // Save resume to local storage
        const newResume = {
          id: Date.now(),
          title: `AI Generated - ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}`,
          created: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          }),
          data: resumeData
        };
        
        const updatedResumes = [...resumes, newResume];
        setResumes(updatedResumes);
        localStorage.setItem('userResumes', JSON.stringify(updatedResumes));

        setTimeout(() => {
          navigate('/editor', { 
            state: { 
              resumeData: resumeData,
              formData: formData,
              skillLevels: skillLevels
            } 
          });
        }, 500);

        closeAIPopup();
        setAiPrompt('');
      } else {
        const errorText = await response.text();
        let errorMessage = 'Failed to generate resume with AI';
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = errorText || `HTTP ${response.status}: ${response.statusText}`;
        }
        
        showErrorAnimation(errorMessage);
      }
    } catch (error) {
      console.error('Error generating resume with AI:', error);
      showErrorAnimation('Failed to connect to AI service. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // Error animation function
  const showErrorAnimation = (message) => {
    const errorElement = document.createElement('div');
    errorElement.className = `error-toast ${darkMode ? 'dark' : 'light'}`;
    errorElement.innerHTML = `
      <div class="error-content">
        <div class="error-icon">!</div>
        <span>${message}</span>
      </div>
    `;
    document.body.appendChild(errorElement);

    setTimeout(() => {
      errorElement.classList.add('show');
    }, 10);

    setTimeout(() => {
      errorElement.classList.remove('show');
      setTimeout(() => {
        if (errorElement.parentNode) {
          errorElement.parentNode.removeChild(errorElement);
        }
      }, 300);
    }, 4000);
  };

  const createFallbackResume = (formData) => {
    return {
      fullName: formData.fullName || 'Your Name',
      email: formData.email || 'your.email@example.com',
      phone: formData.phone || '+1 234 567 8900',
      location: formData.location || 'Your City, Country',
      dateOfBirth: formData.dateOfBirth || '',
      jobTitle: formData.targetRole || 'Professional Title',
      summary: `Experienced ${formData.field || 'professional'} with background in ${formData.stream || 'relevant field'}. Seeking ${formData.targetRole || 'new opportunities'} where I can apply my skills in ${formData.skills || 'relevant areas'}.`,
      
      education: [{
        degree: formData.stream === 'engineering' ? 'Bachelor of Engineering' : 
                formData.stream === 'computer-science' ? 'Bachelor of Computer Science' :
                formData.stream === 'business' ? 'Bachelor of Business Administration' :
                'Your Degree',
        school: 'University Name',
        year: '2020-2024',
        score: '3.8 GPA'
      }],
      
      skills: formData.skills ? 
        formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) :
        ['Communication', 'Teamwork', 'Problem Solving', 'Project Management', formData.field || 'Technical Skills'],
        
      projects: [{
        title: `${formData.field || 'Industry'} Project`,
        description: `Developed and implemented solutions in ${formData.field || 'relevant field'} demonstrating expertise and achieving measurable results.`
      }],
      
      certifications: [],
      achievements: [],
      workExperience: formData.experienceLevel !== 'no-experience' ? [{
        company: 'Previous Company',
        position: formData.targetRole || 'Professional Role',
        startDate: '2020',
        endDate: '2024',
        description: `Responsible for ${formData.field || 'key duties'} and achieved significant results in ${formData.stream || 'the field'}.`
      }] : []
    };
  };

  const handleEditResume = (resume) => {
    navigate('/editor', { 
      state: { 
        resumeData: resume.data 
      } 
    });
  };

  const handleDeleteResume = (id, event) => {
    event.stopPropagation();
    const updatedResumes = resumes.filter(resume => resume.id !== id);
    setResumes(updatedResumes);
    localStorage.setItem('userResumes', JSON.stringify(updatedResumes));
  };

  const openCreatePopup = () => {
    setShowCreatePopup(true);
  };

  const closeCreatePopup = () => {
    setShowCreatePopup(false);
  };

  const openAIPopup = () => {
    setShowAIPopup(true);
  };

  const closeAIPopup = () => {
    setShowAIPopup(false);
    setAiPrompt('');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const popupVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: 20
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <ThemeContext.Provider value={themeValue}>
      <motion.div 
        className="dashboard-page"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{ background: darkMode ? '#0f172a' : '#ffffff', minHeight: '100vh' }}
      >
        {/* Header */}
        <motion.header 
          className="dashboard-header"
          variants={itemVariants}
          style={{ 
            background: darkMode ? '#1e293b' : '#ffffff',
            borderBottom: darkMode ? '1px solid #334155' : '1px solid #e2e8f0'
          }}
        >
          <div className="header-content">
            <div className="brand-section">
              <motion.div 
                className="logo-container"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="logo-icon">
                  <Icons.Document />
                </div>
                <div className="brand-text">
                  <h1 className="gradient-text">InsightResume</h1>
                  <p className="brand-subtitle">Professional Resume Management</p>
                </div>
              </motion.div>
            </div>
            
            <div className="header-actions">
              <motion.button 
                className="theme-toggle-btn"
                onClick={themeValue.toggleDarkMode}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                style={{
                  background: darkMode ? '#334155' : '#f1f5f9',
                  border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0'
                }}
              >
                {darkMode ? <Icons.Sun /> : <Icons.Moon />}
              </motion.button>
              
              <div className="user-section" style={{
                background: darkMode ? '#334155' : '#f8fafc',
                border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0'
              }}>
                <div className="user-avatar">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="user-details">
                  <span className="user-greeting" style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>Welcome back,</span>
                  <span className="user-name" style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>{userName}</span>
                </div>
                <motion.button 
                  className="logout-btn"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icons.Logout />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Quick Actions */}
        <motion.section 
          className="quick-actions-section"
          variants={itemVariants}
        >
          <div className="section-header">
            <h2 style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>Quick Actions</h2>
            <p style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>Start creating your professional resume</p>
          </div>
          <div className="actions-grid">
            <motion.button 
              className="action-card create-card"
              onClick={openCreatePopup}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: darkMode ? '#1e293b' : '#ffffff',
                border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0'
              }}
            >
              <div className="action-icon">
                <Icons.Create />
              </div>
              <div className="action-content">
                <h3 style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>Create Resume</h3>
                <p style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>Build from scratch with our template</p>
              </div>
              <div className="action-arrow" style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>→</div>
            </motion.button>

            <motion.button 
              className="action-card ai-card"
              onClick={openAIPopup}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              style={{
                background: darkMode ? '#1e293b' : '#ffffff',
                border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0'
              }}
            >
              <div className="action-icon">
                <Icons.AI />
              </div>
              <div className="action-content">
                <h3 style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>AI Assistant</h3>
                <p style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>Generate with artificial intelligence</p>
              </div>
              <div className="action-arrow" style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>→</div>
            </motion.button>
          </div>
        </motion.section>

        {/* My Resumes Section */}
        <motion.section 
          className="resumes-section"
          variants={containerVariants}
        >
          <div className="section-header">
            <h2 style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>My Resumes</h2>
            <p style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>Manage and edit your created resumes</p>
          </div>
          
          <AnimatePresence>
            {resumes.length === 0 ? (
              <motion.div 
                className="empty-state"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{
                  background: darkMode ? '#1e293b' : '#f8fafc',
                  border: darkMode ? '2px dashed #334155' : '2px dashed #e2e8f0'
                }}
              >
                <div className="empty-icon" style={{
                  background: darkMode ? '#334155' : '#f1f5f9',
                  color: darkMode ? '#cbd5e1' : '#64748b'
                }}>
                  <Icons.Document />
                </div>
                <h3 style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>No resumes yet</h3>
                <p style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>Create your first professional resume to get started</p>
                <motion.button 
                  className="create-first-btn"
                  onClick={openCreatePopup}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icons.Create />
                  Create First Resume
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="resumes-grid"
                variants={containerVariants}
              >
                <AnimatePresence>
                  {resumes.map((resume) => (
                    <motion.div
                      key={resume.id}
                      className="resume-card"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      whileTap={{ scale: 0.95 }}
                      layout
                      style={{
                        background: darkMode ? '#1e293b' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        boxShadow: darkMode ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div className="card-header">
                        <div className="card-badge">
                          <Icons.Document />
                        </div>
                        <div className="card-actions">
                          <motion.button 
                            className="icon-btn edit-btn"
                            onClick={() => handleEditResume(resume)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Edit resume"
                            style={{
                              background: darkMode ? '#334155' : '#f1f5f9',
                              border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                              color: darkMode ? '#cbd5e1' : '#64748b'
                            }}
                          >
                            <Icons.Edit />
                          </motion.button>
                          <motion.button 
                            className="icon-btn delete-btn"
                            onClick={(e) => handleDeleteResume(resume.id, e)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete resume"
                            style={{
                              background: darkMode ? '#334155' : '#f1f5f9',
                              border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                              color: darkMode ? '#cbd5e1' : '#64748b'
                            }}
                          >
                            <Icons.Delete />
                          </motion.button>
                        </div>
                      </div>
                      <div className="card-content">
                        <h3 className="card-title" style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>{resume.title}</h3>
                        <p className="card-date" style={{ color: darkMode ? '#cbd5e1' : '#64748b' }}>
                          <Icons.Calendar />
                          Created {resume.created}
                        </p>
                      </div>
                      <div className="card-footer">
                        <motion.button 
                          className="view-btn"
                          onClick={() => handleEditResume(resume)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View & Edit
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Create Resume Popup */}
        <AnimatePresence>
          {showCreatePopup && (
            <motion.div 
              className="popup-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="create-popup"
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  background: darkMode ? '#1e293b' : '#ffffff',
                  border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0'
                }}
              >
                <div className="popup-header" style={{
                  background: darkMode ? '#334155' : '#f8fafc',
                  borderBottom: darkMode ? '1px solid #475569' : '1px solid #e2e8f0'
                }}>
                  <div className="popup-title">
                    <Icons.Create />
                    <h2 style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>Create New Resume</h2>
                  </div>
                  <motion.button 
                    className="close-btn"
                    onClick={closeCreatePopup}
                    disabled={loading}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      background: darkMode ? '#475569' : '#f1f5f9',
                      border: darkMode ? '1px solid #64748b' : '1px solid #e2e8f0',
                      color: darkMode ? '#cbd5e1' : '#64748b'
                    }}
                  >
                    <Icons.Close />
                  </motion.button>
                </div>

                <form onSubmit={handleCreateResume} className="resume-form">
                  <div className="form-section">
                    <h3 style={{ color: darkMode ? '#f1f5f9' : '#1e293b', borderBottom: darkMode ? '2px solid #334155' : '2px solid #e2e8f0' }}>Personal Information</h3>
                    <div className="form-grid">
                      {['fullName', 'email', 'phone', 'location', 'dateOfBirth'].map((field) => (
                        <div className="form-group" key={field}>
                          <label style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                            {field === 'fullName' ? 'Full Name' : 
                             field === 'email' ? 'Email' :
                             field === 'phone' ? 'Phone' : 
                             field === 'location' ? 'Location' : 'Date of Birth'}
                          </label>
                          <input
                            type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : field === 'dateOfBirth' ? 'date' : 'text'}
                            name={field}
                            value={formData[field]}
                            onChange={handleInputChange}
                            placeholder={
                              field === 'fullName' ? 'Your full name' :
                              field === 'email' ? 'your.email@example.com' :
                              field === 'phone' ? '+1 234 567 8900' : 
                              field === 'location' ? 'City, Country' : 'YYYY-MM-DD'
                            }
                            disabled={loading}
                            style={{
                              background: darkMode ? '#0f172a' : '#ffffff',
                              border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                              color: darkMode ? '#f1f5f9' : '#1e293b'
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 style={{ color: darkMode ? '#f1f5f9' : '#1e293b', borderBottom: darkMode ? '2px solid #334155' : '2px solid #e2e8f0' }}>Professional Information</h3>
                    <div className="form-grid">
                      {['stream', 'field', 'userType', 'experienceLevel'].map((field) => (
                        <div className="form-group" key={field}>
                          <label style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                            {field === 'stream' ? 'Stream/Background *' :
                             field === 'field' ? 'Specific Field *' :
                             field === 'userType' ? 'You are a *' : 'Experience Level *'}
                          </label>
                          {field === 'stream' || field === 'userType' || field === 'experienceLevel' ? (
                            <select 
                              name={field} 
                              value={formData[field]} 
                              onChange={handleInputChange}
                              required
                              disabled={loading}
                              style={{
                                background: darkMode ? '#0f172a' : '#ffffff',
                                border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                color: darkMode ? '#f1f5f9' : '#1e293b'
                              }}
                            >
                              <option value="">Select {field === 'stream' ? 'Stream' : field === 'userType' ? '' : 'Experience'}</option>
                              {field === 'stream' && (
                                <>
                                  <option value="engineering">Engineering</option>
                                  <option value="computer-science">Computer Science</option>
                                  <option value="business">Business</option>
                                  <option value="arts">Arts & Humanities</option>
                                  <option value="science">Science</option>
                                  <option value="medical">Medical</option>
                                  <option value="other">Other</option>
                                </>
                              )}
                              {field === 'userType' && (
                                <>
                                  <option value="student">Student</option>
                                  <option value="fresh-graduate">Fresh Graduate</option>
                                  <option value="experienced">Experienced Professional</option>
                                  <option value="career-changer">Career Changer</option>
                                </>
                              )}
                              {field === 'experienceLevel' && (
                                <>
                                  <option value="no-experience">No Experience</option>
                                  <option value="0-2">0-2 Years</option>
                                  <option value="2-5">2-5 Years</option>
                                  <option value="5-10">5-10 Years</option>
                                  <option value="10+">10+ Years</option>
                                </>
                              )}
                            </select>
                          ) : (
                            <input
                              type="text"
                              name={field}
                              value={formData[field]}
                              onChange={handleInputChange}
                              placeholder={field === 'field' ? "e.g., Software Development, Marketing, Data Science" : ""}
                              required
                              disabled={loading}
                              style={{
                                background: darkMode ? '#0f172a' : '#ffffff',
                                border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                                color: darkMode ? '#f1f5f9' : '#1e293b'
                              }}
                            />
                          )}
                        </div>
                      ))}

                      <div className="form-group full-width">
                        <label style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>Target Role *</label>
                        <input
                          type="text"
                          name="targetRole"
                          value={formData.targetRole}
                          onChange={handleInputChange}
                          placeholder="e.g., Frontend Developer, Marketing Manager"
                          required
                          disabled={loading}
                          style={{
                            background: darkMode ? '#0f172a' : '#ffffff',
                            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                            color: darkMode ? '#f1f5f9' : '#1e293b'
                          }}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>Key Skills (comma separated) - Optional</label>
                        <input
                          type="text"
                          name="skills"
                          value={formData.skills}
                          onChange={handleInputChange}
                          placeholder="e.g., JavaScript, React, Project Management (Leave empty for AI to generate skills)"
                          disabled={loading}
                          style={{
                            background: darkMode ? '#0f172a' : '#ffffff',
                            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                            color: darkMode ? '#f1f5f9' : '#1e293b'
                          }}
                        />
                      </div>

                      {/* Skill Levels Section - ALWAYS VISIBLE */}
                      <div className="form-group full-width">
                        <label style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>Skill Proficiency Levels *</label>
                        <div className="skill-levels-container">
                          {[
                            { 
                              category: 'technical', 
                              label: 'Technical Skills',
                              description: 'Programming languages, frameworks, technical expertise'
                            },
                            { 
                              category: 'soft', 
                              label: 'Soft Skills',
                              description: 'Communication, teamwork, leadership, problem-solving'
                            },
                            { 
                              category: 'tools', 
                              label: 'Tools & Software',
                              description: 'Development tools, software applications, platforms'
                            }
                          ].map(({ category, label, description }) => (
                            <div key={category} className="skill-level-category">
                              <div className="skill-category-header">
                                <span className="skill-category-label" style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>
                                  {label}
                                </span>
                                <span className="skill-category-description" style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '0.875rem' }}>
                                  {description}
                                </span>
                              </div>
                              <div className="skill-level-options">
                                {[
                                  { level: 'basic', label: 'Basic', desc: 'Fundamental understanding' },
                                  { level: 'intermediate', label: 'Intermediate', desc: 'Practical experience' },
                                  { level: 'advanced', label: 'Advanced', desc: 'Expert proficiency' }
                                ].map(({ level, label, desc }) => (
                                  <label key={level} className="skill-level-option">
                                    <input
                                      type="radio"
                                      name={`skill-${category}`}
                                      value={level}
                                      checked={skillLevels[category] === level}
                                      onChange={() => handleSkillLevelChange(category, level)}
                                      disabled={loading}
                                    />
                                    <div 
                                      className={`skill-level-btn ${skillLevels[category] === level ? 'active' : ''}`}
                                      style={{
                                        background: skillLevels[category] === level 
                                          ? (darkMode ? '#3b82f6' : '#2563eb')
                                          : (darkMode ? '#334155' : '#f1f5f9'),
                                        border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                                        color: skillLevels[category] === level 
                                          ? '#ffffff' 
                                          : (darkMode ? '#cbd5e1' : '#475569')
                                      }}
                                    >
                                      <div className="skill-level-label">{label}</div>
                                      <div className="skill-level-desc" style={{ 
                                        color: skillLevels[category] === level 
                                          ? '#e2e8f0' 
                                          : (darkMode ? '#94a3b8' : '#64748b'),
                                        fontSize: '0.75rem'
                                      }}>
                                        {desc}
                                      </div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <p style={{ color: darkMode ? '#94a3b8' : '#64748b', fontSize: '0.875rem', marginTop: '8px' }}>
                          AI will generate appropriate skills based on your stream and selected proficiency levels
                        </p>
                      </div>

                      <div className="form-group full-width">
                        <label style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>Additional Instructions / Prompt</label>
                        <textarea
                          name="prompt"
                          value={formData.prompt}
                          onChange={handleInputChange}
                          placeholder="Any specific requirements, achievements, or additional information..."
                          rows="4"
                          disabled={loading}
                          style={{
                            background: darkMode ? '#0f172a' : '#ffffff',
                            border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                            color: darkMode ? '#f1f5f9' : '#1e293b'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-actions" style={{ borderTop: darkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                    <motion.button 
                      type="button" 
                      onClick={closeCreatePopup}
                      disabled={loading}
                      className="cancel-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: darkMode ? '#334155' : '#f1f5f9',
                        border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                        color: darkMode ? '#cbd5e1' : '#475569'
                      }}
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button 
                      type="submit" 
                      className={`generate-btn ${loading ? 'loading' : ''}`}
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {loading ? (
                        <>
                          <div className="spinner"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Icons.Sparkle />
                          Generate Resume
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Assistant Popup */}
        <AnimatePresence>
          {showAIPopup && (
            <motion.div 
              className="popup-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                ref={aiPopupRef}
                className="ai-popup"
                variants={popupVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  background: darkMode ? '#1e293b' : '#ffffff',
                  border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0'
                }}
              >
                <div className="popup-header" style={{
                  background: darkMode ? '#334155' : '#f8fafc',
                  borderBottom: darkMode ? '1px solid #475569' : '1px solid #e2e8f0'
                }}>
                  <div className="popup-title">
                    <Icons.Robot />
                    <h2 style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>AI Resume Assistant</h2>
                  </div>
                  <motion.button 
                    className="close-btn"
                    onClick={closeAIPopup}
                    disabled={aiLoading}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                      background: darkMode ? '#475569' : '#f1f5f9',
                      border: darkMode ? '1px solid #64748b' : '1px solid #e2e8f0',
                      color: darkMode ? '#cbd5e1' : '#64748b'
                    }}
                  >
                    <Icons.Close />
                  </motion.button>
                </div>

                <div className="ai-popup-content">
                  <div className="ai-instructions" style={{
                    background: darkMode ? '#334155' : '#f8fafc',
                    border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0'
                  }}>
                    <p style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>Tell the AI assistant what kind of resume you want to create:</p>
                    <ul style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                      <li>Describe your background and experience</li>
                      <li>Specify the job role you're targeting</li>
                      <li>Mention key skills and achievements</li>
                      <li>Include any specific requirements</li>
                    </ul>
                  </div>

                  <div className="ai-form-group">
                    <label style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>Your Prompt:</label>
                    <textarea
                      value={aiPrompt}
                      onChange={handleAiPromptChange}
                      placeholder="e.g., Create a professional resume for a senior frontend developer with 5 years of experience in React and TypeScript. Include experience with modern web technologies and team leadership..."
                      rows="6"
                      disabled={aiLoading}
                      style={{
                        background: darkMode ? '#0f172a' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        color: darkMode ? '#f1f5f9' : '#1e293b'
                      }}
                    />
                  </div>

                  <div className="current-info" style={{
                    background: darkMode ? '#334155' : '#f8fafc',
                    border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0'
                  }}>
                    <h4 style={{ color: darkMode ? '#f1f5f9' : '#1e293b' }}>Current Information:</h4>
                    <div className="info-grid">
                      {formData.fullName && <span style={{
                        background: darkMode ? '#1e293b' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        color: darkMode ? '#cbd5e1' : '#475569'
                      }}>Name: {formData.fullName}</span>}
                      {formData.email && <span style={{
                        background: darkMode ? '#1e293b' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        color: darkMode ? '#cbd5e1' : '#475569'
                      }}>Email: {formData.email}</span>}
                      {formData.dateOfBirth && <span style={{
                        background: darkMode ? '#1e293b' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        color: darkMode ? '#cbd5e1' : '#475569'
                      }}>Date of Birth: {formData.dateOfBirth}</span>}
                      {formData.targetRole && <span style={{
                        background: darkMode ? '#1e293b' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        color: darkMode ? '#cbd5e1' : '#475569'
                      }}>Target Role: {formData.targetRole}</span>}
                      {formData.field && <span style={{
                        background: darkMode ? '#1e293b' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        color: darkMode ? '#cbd5e1' : '#475569'
                      }}>Field: {formData.field}</span>}
                      {formData.experienceLevel && <span style={{
                        background: darkMode ? '#1e293b' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        color: darkMode ? '#cbd5e1' : '#475569'
                      }}>Experience: {formData.experienceLevel}</span>}
                      <span style={{
                        background: darkMode ? '#1e293b' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        color: darkMode ? '#cbd5e1' : '#475569'
                      }}>Tech Skills: {skillLevels.technical}</span>
                      <span style={{
                        background: darkMode ? '#1e293b' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        color: darkMode ? '#cbd5e1' : '#475569'
                      }}>Soft Skills: {skillLevels.soft}</span>
                      <span style={{
                        background: darkMode ? '#1e293b' : '#ffffff',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                        color: darkMode ? '#cbd5e1' : '#475569'
                      }}>Tools Level: {skillLevels.tools}</span>
                    </div>
                  </div>

                  <div className="ai-popup-actions" style={{ borderTop: darkMode ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                    <motion.button 
                      type="button" 
                      onClick={closeAIPopup}
                      disabled={aiLoading}
                      className="cancel-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: darkMode ? '#334155' : '#f1f5f9',
                        border: darkMode ? '1px solid #475569' : '1px solid #e2e8f0',
                        color: darkMode ? '#cbd5e1' : '#475569'
                      }}
                    >
                      Cancel
                    </motion.button>
                    
                    <motion.button 
                      type="button"
                      onClick={handleCreateWithAI}
                      disabled={aiLoading || !aiPrompt.trim()}
                      className={`ai-generate-btn ${aiLoading ? 'loading' : ''}`}
                      whileHover={{ scale: loading ? 1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {aiLoading ? (
                        <>
                          <div className="spinner"></div>
                          AI is generating...
                        </>
                      ) : (
                        <>
                          <Icons.Robot />
                          Generate with AI
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Overlay */}
        <AnimatePresence>
          {(loading || aiLoading) && (
            <motion.div 
              className="loading-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="loading-content">
                <motion.div 
                  className="loading-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="loading-text">
                  {aiLoading ? 'AI is creating your resume...' : 'Creating your resume...'}
                </div>
                <p className="loading-subtext">This may take a few moments</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </ThemeContext.Provider>
  );
};

export default DashboardPage;