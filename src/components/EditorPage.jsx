import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './EditorPage.css';

// ✅ Update this function to use your Railway backend
const getBackendUrl = () => {
  return 'https://insightr-backend-production.up.railway.app';
};

// Skill Verification Popup Component
const SkillVerificationPopup = ({ 
  skills, 
  onComplete, 
  onClose, 
  resumeData 
}) => {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [attemptedSkills, setAttemptedSkills] = useState([]);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  const currentSkill = skills[currentSkillIndex];

  // Timer effect - 20 seconds
  useEffect(() => {
    if (!currentQuestion || showResults || timeoutOccurred) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, showResults, timeoutOccurred]);

  // Check verification status on component mount
  useEffect(() => {
    checkVerificationStatus();
  }, []);

  // Load question for current skill
  useEffect(() => {
    if (currentSkill && !showResults && verificationStatus?.can_attempt) {
      loadQuestionForSkill(currentSkill);
      setTimeoutOccurred(false); // Reset timeout flag for new question
    }
  }, [currentSkill, showResults, verificationStatus]);

  // Check verification status
  const checkVerificationStatus = async () => {
    try {
      const userIdentifier = resumeData.personalInfo.fullName || 'default_user';
      
      const response = await fetch(`${getBackendUrl()}/api/check-verification-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIdentifier: userIdentifier
        })
      });

      if (response.ok) {
        const result = await response.json();
        setVerificationStatus(result);
        return result;
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
    return { can_attempt: true, message: 'Proceeding with verification' };
  };

  const loadQuestionForSkill = async (skill) => {
    setIsLoading(true);
    try {
      // ✅ Updated to use Railway backend
      const response = await fetch(`${getBackendUrl()}/api/generate-skill-question`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skill: skill,
          level: 'intermediate',
          field: resumeData.personalInfo.jobTitle || 'general',
          difficulty: 'basic'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentQuestion(data.question);
        setTimeLeft(20); // Reset to 20 seconds
      } else {
        console.error('Failed to load question');
        // Fallback question
        setCurrentQuestion({
          question: `What is the primary purpose of ${skill}?`,
          options: {
            A: "To solve problems efficiently",
            B: "To manage databases", 
            C: "To create user interfaces",
            D: "To handle network security"
          },
          correct_answer: "A",
          explanation: `${skill} is used to solve problems in its domain.`
        });
      }
    } catch (error) {
      console.error('Error loading question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ FIXED: handleAnswerSelect function with enhanced attempt system
  const handleAnswerSelect = async (answer) => {
    if (!currentQuestion || timeoutOccurred) return;

    // Mark as attempted
    setAttemptedSkills(prev => [...prev, currentSkill]);

    // Verify answer with backend
    try {
      const userIdentifier = resumeData.personalInfo.fullName || 'default_user';
      
      // ✅ FIXED: Corrected the field names to match backend
      const response = await fetch(`${getBackendUrl()}/api/verify-skill-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion,        // ✅ Changed from question_data
          selectedAnswer: answer,           // ✅ Changed from user_answer  
          skill: currentSkill,
          level: 'intermediate',
          userIdentifier: userIdentifier
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Store result - FIXED: Access the correct path
          setResults(prev => ({
            ...prev,
            [currentSkill]: result.result.is_correct  // ✅ Fixed: result.result.is_correct
          }));

          setUserAnswers(prev => ({
            ...prev,
            [currentSkill]: answer
          }));

          // Update verification status
          setVerificationStatus(prev => ({
            ...prev,
            attempt_data: result.result.attempt_data
          }));

          // Move to next skill after a brief delay
          setTimeout(() => {
            if (currentSkillIndex < skills.length - 1) {
              setCurrentSkillIndex(prev => prev + 1);
            } else {
              // All skills completed
              setShowResults(true);
            }
          }, 1500);
        } else {
          console.error('Backend verification failed:', result.error);
          // Handle backend error
          setResults(prev => ({
            ...prev,
            [currentSkill]: false
          }));
          
          setTimeout(() => {
            if (currentSkillIndex < skills.length - 1) {
              setCurrentSkillIndex(prev => prev + 1);
            } else {
              setShowResults(true);
            }
          }, 1500);
        }
      } else {
        console.error('HTTP error:', response.status);
        // Handle HTTP error
        setResults(prev => ({
          ...prev,
          [currentSkill]: false
        }));
        
        setTimeout(() => {
          if (currentSkillIndex < skills.length - 1) {
            setCurrentSkillIndex(prev => prev + 1);
          } else {
            setShowResults(true);
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Error verifying answer:', error);
      // Handle network error
      setResults(prev => ({
        ...prev,
        [currentSkill]: false
      }));
      
      setTimeout(() => {
        if (currentSkillIndex < skills.length - 1) {
          setCurrentSkillIndex(prev => prev + 1);
        } else {
          setShowResults(true);
        }
      }, 1500);
    }
  };

  const handleTimeUp = () => {
    // Mark as not attempted when time's up
    setAttemptedSkills(prev => [...prev, currentSkill]);
    setResults(prev => ({
      ...prev,
      [currentSkill]: 'not_attempted'
    }));

    // Set timeout flag to stop timer
    setTimeoutOccurred(true);
    
    // Show timeout message but DON'T auto-proceed to next question
    console.log(`Time's up for ${currentSkill}! Question marked as not attempted.`);
  };

  const handleProceedToNext = () => {
    // Reset timeout flag
    setTimeoutOccurred(false);
    
    // Move to next question
    if (currentSkillIndex < skills.length - 1) {
      setCurrentSkillIndex(prev => prev + 1);
    } else {
      // All skills completed
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    const attemptedResults = Object.entries(results)
      .filter(([skill, result]) => attemptedSkills.includes(skill) && result !== 'not_attempted');
    
    if (attemptedResults.length === 0) return 0;
    
    const correctAnswers = attemptedResults.filter(([skill, result]) => result === true).length;
    return Math.round((correctAnswers / attemptedResults.length) * 100);
  };

  const handleVerificationComplete = () => {
    const score = calculateScore();
    const passed = score >= 67; // 67% passing criteria
    
    // Track attempt
    const attemptKey = `skill_attempts_${resumeData.personalInfo.fullName}`;
    const currentAttempts = parseInt(localStorage.getItem(attemptKey) || '0');
    localStorage.setItem(attemptKey, (currentAttempts + 1).toString());
    
    if (passed) {
      // Store verification results
      const verificationData = {
        passed: true,
        score: score,
        results: results,
        attemptedSkills: attemptedSkills,
        verifiedSkills: Object.entries(results)
          .filter(([skill, result]) => result === true)
          .map(([skill]) => skill),
        verifiedAt: new Date().toISOString(),
        attempt_data: verificationStatus?.attempt_data
      };
      localStorage.setItem(`resume_verified_${resumeData.personalInfo.fullName}`, JSON.stringify(verificationData));
    }
    
    onComplete({
      passed,
      score,
      results,
      userAnswers,
      attemptedSkills,
      verifiedSkills: passed ? Object.entries(results)
        .filter(([skill, result]) => result === true)
        .map(([skill]) => skill) : [],
      attempt_data: verificationStatus?.attempt_data
    });
  };

  const getAttemptText = () => {
    if (verificationStatus?.attempt_data) {
      const { current_attempt, total_attempts, passed } = verificationStatus.attempt_data;
      if (passed) {
        return '✅ Verification Passed';
      }
      return `Attempt ${current_attempt} of 3`;
    }
    
    const attempts = localStorage.getItem(`skill_attempts_${resumeData.personalInfo.fullName}`) || 0;
    return `Attempt ${parseInt(attempts) + 1} of 3`;
  };

  const getResultStatus = (skill) => {
    if (!attemptedSkills.includes(skill)) return 'pending';
    if (results[skill] === 'not_attempted') return 'not_attempted';
    return results[skill] ? 'correct' : 'incorrect';
  };

  // Show verification status if user cannot attempt
  if (verificationStatus && !verificationStatus.can_attempt) {
    return (
      <div className="skill-verification-popup">
        <div className="popup-content">
          <div className="popup-header">
            <h2>Skill Verification</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="verification-locked">
            <div className="lock-icon">🔒</div>
            <h3>Verification Locked</h3>
            <p>{verificationStatus.message}</p>
            
            {verificationStatus.attempt_data && (
              <div className="attempt-details">
                <p><strong>Attempt Status:</strong> {verificationStatus.attempt_data.current_attempt}/3</p>
                <p><strong>Total Attempts:</strong> {verificationStatus.attempt_data.total_attempts}</p>
                {verificationStatus.attempt_data.lock_until && (
                  <p><strong>Next Attempt:</strong> {new Date(verificationStatus.attempt_data.lock_until).toLocaleString()}</p>
                )}
              </div>
            )}
            
            <div className="popup-actions">
              <button className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 67;

    return (
      <div className="skill-verification-popup">
        <div className="popup-content">
          <div className="popup-header">
            <h2>Skill Verification Results</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          
          <div className="results-section">
            <div className={`score-display ${passed ? 'passed' : 'failed'}`}>
              <h3>{passed ? '🎉 Verification Passed!' : '❌ Verification Failed'}</h3>
              <div className="score-circle">
                <span>{score}%</span>
              </div>
              <p>Required: 67% | Your Score: {score}%</p>
              <p className="attempted-info">
                Based on {Object.entries(results).filter(([skill, result]) => attemptedSkills.includes(skill) && result !== 'not_attempted').length} attempted questions
              </p>
            </div>

            {verificationStatus?.attempt_data && (
              <div className="attempt-summary">
                <h4>Attempt Summary:</h4>
                <div className="attempt-details">
                  <p><strong>Current Attempt:</strong> {verificationStatus.attempt_data.current_attempt}/3</p>
                  <p><strong>Total Attempts:</strong> {verificationStatus.attempt_data.total_attempts}</p>
                  {!passed && verificationStatus.attempt_data.lock_until && (
                    <p className="warning-text">
                      <strong>Next Attempt Available:</strong> {new Date(verificationStatus.attempt_data.lock_until).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="skills-results">
              <h4>Skill Results:</h4>
              {skills.map((skill, index) => {
                const status = getResultStatus(skill);
                return (
                  <div key={skill} className="skill-result-item">
                    <span className="skill-name">{skill}</span>
                    <span className={`result-badge ${status}`}>
                      {status === 'correct' && '✅ Verified'}
                      {status === 'incorrect' && '❌ Incorrect'}
                      {status === 'not_attempted' && '⏰ Not Attempted (0 marks)'}
                      {status === 'pending' && '⏳ Pending'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="popup-actions">
              {passed ? (
                <button 
                  className="btn-success" 
                  onClick={handleVerificationComplete}
                >
                  🎉 Continue to Download
                </button>
              ) : (
                <div className="failed-actions">
                  {verificationStatus?.attempt_data && (
                    <div className="attempt-info">
                      <p>
                        {verificationStatus.attempt_data.current_attempt === 1 && 
                         '2nd attempt will unlock in 2 minutes'}
                        {verificationStatus.attempt_data.current_attempt === 2 && 
                         'Final attempt will unlock in 24 hours'}
                        {verificationStatus.attempt_data.current_attempt === 3 && 
                         'No more attempts available. Verification failed.'}
                      </p>
                      <p>Attempts remaining: {3 - verificationStatus.attempt_data.current_attempt}</p>
                    </div>
                  )}
                  <button className="btn-secondary" onClick={onClose}>
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="skill-verification-popup">
      <div className="popup-content">
        <div className="popup-header">
          <h2>Skill Verification</h2>
          <div className="attempt-info">{getAttemptText()}</div>
        </div>

        {verificationStatus?.attempt_data && (
          <div className="attempt-progress">
            <div className="attempt-badges">
              <span className={`attempt-badge ${verificationStatus.attempt_data.current_attempt >= 1 ? 'active' : ''}`}>
                Attempt 1
              </span>
              <span className={`attempt-badge ${verificationStatus.attempt_data.current_attempt >= 2 ? 'active' : ''}`}>
                Attempt 2
              </span>
              <span className={`attempt-badge ${verificationStatus.attempt_data.current_attempt >= 3 ? 'active' : ''}`}>
                Attempt 3
              </span>
            </div>
            <div className="attempt-rules">
              <small>
                {verificationStatus.attempt_data.current_attempt === 1 && '→ 2 min wait if failed'}
                {verificationStatus.attempt_data.current_attempt === 2 && '→ 24 hr wait if failed'}
                {verificationStatus.attempt_data.current_attempt === 3 && '→ Final attempt'}
              </small>
            </div>
          </div>
        )}

        <div className="verification-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentSkillIndex) / skills.length) * 100}%` }}
            ></div>
          </div>
          <div className="progress-text">
            Skill {currentSkillIndex + 1} of {skills.length}: {currentSkill}
          </div>
        </div>

        {isLoading ? (
          <div className="loading-question">
            <div className="spinner"></div>
            <p>Generating question...</p>
          </div>
        ) : currentQuestion ? (
          <div className="question-section">
            <div className="timer-section">
              <div className={`timer-circle ${timeoutOccurred ? 'timeout' : ''}`}>
                <span>{timeLeft}s</span>
              </div>
              <p className="timer-note">20 seconds per question</p>
            </div>

            <div className="question-content">
              <h3>{currentQuestion.question}</h3>
              
              {timeoutOccurred ? (
                <div className="timeout-message">
                  <div className="timeout-alert">
                    <h4>⏰ Time's Up!</h4>
                    <p>This question has been marked as <strong>"Not Attempted"</strong> and will receive <strong>0 marks</strong>.</p>
                    <p>Click the button below to proceed to the next question.</p>
                  </div>
                  <button 
                    className="proceed-btn"
                    onClick={handleProceedToNext}
                  >
                    Next Question →
                  </button>
                </div>
              ) : (
                <>
                  <div className="options-grid">
                    {Object.entries(currentQuestion.options).map(([key, value]) => (
                      <button
                        key={key}
                        className="option-btn"
                        onClick={() => handleAnswerSelect(key)}
                        disabled={attemptedSkills.includes(currentSkill)}
                      >
                        <span className="option-key">{key}</span>
                        <span className="option-text">{value}</span>
                      </button>
                    ))}
                  </div>
                  
                  <div className="time-warning">
                    <p>⚠️ If time runs out, this question will be marked as "Not Attempted" and will receive 0 marks.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="error-state">
            <p>Failed to load question. Please try again.</p>
            <button onClick={() => loadQuestionForSkill(currentSkill)}>
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Main EditorPage Component
const EditorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resumeRef = useRef();
  
  // Default resume structure WITH ALL NEW SECTIONS INCLUDING DOB
  const defaultResumeData = {
    personalInfo: {
      fullName: 'Your Name',
      jobTitle: 'Professional Title',
      email: 'your.email@example.com',
      phone: '+1 234 567 8900',
      location: 'Your City, Country',
      dateOfBirth: '', // Added DOB field
      about: 'Professional summary about your background, skills, and career objectives.',
      photo: null
    },
    education: [
      {
        degree: 'Your Degree',
        institution: 'Your University',
        year: 'Graduation Year',
        score: '',
        details: ''
      }
    ],
    skills: ['Communication', 'Teamwork', 'Problem Solving'],
    projects: [
      {
        title: 'Sample Project',
        description: 'Describe your project and key contributions'
      }
    ],
    certifications: [],
    achievements: [],
    workExperience: [],
    internships: [],
    extracurriculars: [],
    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Hindi', proficiency: 'Native' }
    ],
    selectedTemplate: 'Professional'
  };

  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState('');
  const [isFromAI, setIsFromAI] = useState(false);
  const [skillRecommendations, setSkillRecommendations] = useState([]);
  
  // Skill Verification States
  const [showSkillVerification, setShowSkillVerification] = useState(false);
  const [verificationResults, setVerificationResults] = useState(null);
  const [verifiedSkills, setVerifiedSkills] = useState([]);
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);

  // ✅ FIXED: Enhanced data loading with better error handling
  useEffect(() => {
    console.log("🔄 Editor useEffect - Checking for data sources");
    console.log("📍 Location state:", location.state);
    
    const loadData = () => {
      try {
        setIsLoading(true);

        // ✅ PRIORITY 1: Check for AI-generated data from navigation state
        if (location.state?.resumeData) {
          console.log('🎯 Received AI-generated data directly:', location.state.resumeData);
          const aiData = location.state.resumeData;
          const formData = location.state.formData || {};
          
          const transformedData = transformAIDataToEditorFormat(aiData, formData);
          console.log('✅ Transformed AI Data:', transformedData);
          
          setResumeData(transformedData);
          setIsFromAI(true);
          setIsLoading(false);
          return;
        }

        // ✅ PRIORITY 2: Check localStorage for saved AI data
        const savedResume = localStorage.getItem('currentResume');
        const savedFormData = localStorage.getItem('resumeFormData');
        
        if (savedResume) {
          try {
            console.log('📦 Loading from localStorage - currentResume found');
            const aiData = JSON.parse(savedResume);
            const formData = savedFormData ? JSON.parse(savedFormData) : {};
            
            console.log('📦 AI Data from localStorage:', aiData);
            console.log('📦 Form Data from localStorage:', formData);

            const transformedData = transformAIDataToEditorFormat(aiData, formData);
            console.log('✅ Transformed Data from localStorage:', transformedData);
            
            setResumeData(transformedData);
            setIsFromAI(true);
            
          } catch (error) {
            console.error('❌ Error parsing saved data:', error);
            // Fallback to default data
            setResumeData(defaultResumeData);
          }
        } 
        // ✅ PRIORITY 3: Check for manually saved resume data
        else if (localStorage.getItem('resumeData')) {
          console.log('💾 Loading manually saved resume data');
          try {
            const savedData = JSON.parse(localStorage.getItem('resumeData'));
            setResumeData(savedData);
            setIsFromAI(false);
          } catch (error) {
            console.error('❌ Error parsing saved resume data:', error);
            setResumeData(defaultResumeData);
          }
        }
        else {
          console.log('⚠️ No data found, using default template');
          setResumeData(defaultResumeData);
        }

      } catch (error) {
        console.error('❌ Error loading data:', error);
        setResumeData(defaultResumeData);
      } finally {
        setIsLoading(false);
      }
    };

    // Small delay to ensure everything is loaded properly
    setTimeout(loadData, 100);
  }, [location.state]);

  // Check for existing verification on component load
  useEffect(() => {
    const storedVerification = localStorage.getItem(`resume_verified_${resumeData.personalInfo.fullName}`);
    if (storedVerification) {
      const verificationData = JSON.parse(storedVerification);
      if (verificationData.passed) {
        setVerifiedSkills(verificationData.verifiedSkills || []);
        setIsVerificationComplete(true);
      }
    }
  }, [resumeData.personalInfo.fullName]);

  // Check verification status
  const checkVerificationStatus = async () => {
    try {
      const userIdentifier = resumeData.personalInfo.fullName || 'default_user';
      
      const response = await fetch(`${getBackendUrl()}/api/check-verification-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIdentifier: userIdentifier
        })
      });

      if (response.ok) {
        const result = await response.json();
        setVerificationStatus(result);
        return result;
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
    }
    return { can_attempt: true, message: 'Proceeding with verification' };
  };

  // ✅ Professional Title Generator
  const generateProfessionalTitle = () => {
    const { personalInfo, education, skills } = resumeData;
    
    if (personalInfo.jobTitle && personalInfo.jobTitle !== 'Professional Title') {
      return personalInfo.jobTitle;
    }

    const highestEducation = education && education.length > 0 ? education[0].degree : '';
    const keySkills = skills && skills.length > 0 ? skills.slice(0, 3) : [];
    
    let title = '';
    
    if (highestEducation.toLowerCase().includes('computer') || highestEducation.toLowerCase().includes('software') || highestEducation.toLowerCase().includes('engineering')) {
      if (keySkills.some(skill => ['JavaScript', 'React', 'Node.js', 'Python'].includes(skill))) {
        title = 'Software Developer';
      } else if (keySkills.some(skill => ['Data', 'Analysis', 'Python', 'SQL'].includes(skill))) {
        title = 'Data Analyst';
      } else {
        title = 'Technology Professional';
      }
    } else if (highestEducation.toLowerCase().includes('business') || highestEducation.toLowerCase().includes('management')) {
      title = 'Business Professional';
    } else if (highestEducation.toLowerCase().includes('marketing')) {
      title = 'Marketing Specialist';
    } else {
      title = 'Professional';
    }
    
    // Update the resume data with generated title
    setResumeData(prevData => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        jobTitle: title
      }
    }));
    
    return title;
  };

  // ✅ Enhanced skill recommendations
  const getSkillRecommendations = () => {
    const { personalInfo, skills } = resumeData;
    const jobTitle = personalInfo.jobTitle?.toLowerCase() || '';
    const currentSkills = skills || [];
    
    const allRecommendations = {
      technical: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'HTML/CSS', 'TypeScript', 'AWS', 'Docker'],
      soft: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management', 'Adaptability', 'Creativity', 'Critical Thinking'],
      business: ['Project Management', 'Data Analysis', 'Strategic Planning', 'Market Research', 'Budget Management', 'Stakeholder Management'],
      design: ['UI/UX Design', 'Figma', 'Adobe Creative Suite', 'Wireframing', 'Prototyping', 'User Research']
    };
    
    let recommendations = [];
    
    if (jobTitle.includes('developer') || jobTitle.includes('engineer')) {
      recommendations = [...allRecommendations.technical, ...allRecommendations.soft];
    } else if (jobTitle.includes('design')) {
      recommendations = [...allRecommendations.design, ...allRecommendations.soft];
    } else if (jobTitle.includes('manager') || jobTitle.includes('business')) {
      recommendations = [...allRecommendations.business, ...allRecommendations.soft];
    } else {
      recommendations = [...allRecommendations.soft, ...allRecommendations.technical.slice(0, 3)];
    }
    
    const filteredRecommendations = recommendations.filter(
      skill => !currentSkills.includes(skill)
    );
    
    return [...new Set(filteredRecommendations)].slice(0, 8);
  };

  // ✅ Update skill recommendations when data changes
  useEffect(() => {
    const recommendations = getSkillRecommendations();
    setSkillRecommendations(recommendations);
  }, [resumeData.personalInfo.jobTitle, resumeData.skills]);

  // ✅ FIXED: Transform AI data to editor format WITH ALL NEW SECTIONS INCLUDING DOB
  const transformAIDataToEditorFormat = (aiData, formData = {}) => {
    return {
      personalInfo: {
        fullName: aiData.fullName || formData.fullName || 'Your Name',
        jobTitle: aiData.jobTitle || formData.targetRole || 'Professional',
        email: aiData.email || formData.email || 'your.email@example.com',
        phone: aiData.phone || formData.phone || '+1 234 567 8900',
        location: aiData.location || formData.location || 'Your Location',
        dateOfBirth: aiData.dateOfBirth || formData.dateOfBirth || '', // Added DOB
        about: aiData.summary || `A motivated ${formData.experienceLevel || 'individual'} with background in ${formData.stream || 'general studies'}. Currently pursuing ${formData.specificField || 'education'} and seeking opportunities in ${formData.targetRole || 'professional field'}.`,
        photo: null
      },
      education: aiData.education && aiData.education.length > 0 
        ? aiData.education.map(edu => ({
            degree: edu.degree || 'Degree',
            institution: edu.school || 'University',
            year: edu.year || 'Year',
            score: edu.score || '',
            details: ''
          }))
        : [{
            degree: formData.specificField || 'Your Degree',
            institution: 'Your University',
            year: 'Present',
            score: '',
            details: ''
          }],
      skills: aiData.skills && aiData.skills.length > 0 
        ? aiData.skills 
        : (formData.keySkills ? formData.keySkills.split(',').map(skill => skill.trim()) : ['Communication', 'Teamwork', 'Problem Solving']),
      projects: aiData.projects && aiData.projects.length > 0
        ? aiData.projects.map(proj => ({
            title: proj.title || 'Project',
            description: proj.description || 'Project description'
          }))
        : [{
            title: 'Sample Project',
            description: 'Describe your project and key contributions'
          }],
      certifications: aiData.certifications || [],
      achievements: aiData.achievements || [],
      workExperience: aiData.experience || aiData.workExperience || [],
      internships: aiData.internships || [],
      extracurriculars: aiData.extracurriculars || aiData.extraCurricular || [],
      languages: aiData.languages || [
        { language: 'English', proficiency: 'Native' },
        { language: 'Hindi', proficiency: 'Native' }
      ],
      selectedTemplate: 'Professional'
    };
  };

  // Save data functionality
  const handleSaveResume = () => {
    try {
      localStorage.setItem('resumeData', JSON.stringify(resumeData));
      setSaveMessage('Resume saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving resume:', error);
      setSaveMessage('Error saving resume');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // ✅ OPTIMIZED PDF Generation Function - FIXED VERSION
  const generateAndDownloadPDF = async () => {
    try {
      const element = resumeRef.current;
      
      // Apply PDF-specific styles temporarily
      element.classList.add('pdf-export', 'pdf-optimized');
      
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced from 2 to 1.5 for smaller file size
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels
        height: element.scrollHeight,
        onclone: (clonedDoc, clonedElement) => {
          // Inject PDF-specific styles
          clonedElement.classList.add('pdf-export', 'pdf-optimized');
          const style = clonedDoc.createElement('style');
          style.textContent = `
            .pdf-export * {
              box-sizing: border-box;
              max-width: 100% !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .pdf-export {
              font-family: Arial, Helvetica, sans-serif !important;
              background: white !important;
              color: black !important;
            }
            .pdf-export .shadow, .pdf-export .box-shadow {
              box-shadow: none !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      // Remove temporary classes
      element.classList.remove('pdf-export', 'pdf-optimized');

      // Use JPEG compression instead of PNG for smaller file size
      const imgData = canvas.toDataURL('image/jpeg', 0.8); // 80% quality
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true // Enable PDF compression
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit PDF
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      pdf.save(`${resumeData.personalInfo.fullName || 'resume'}.pdf`);
      
      setSaveMessage('PDF downloaded successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSaveMessage('Error generating PDF');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Download without verification
  const handleDownloadWithoutVerification = async () => {
    try {
      await generateAndDownloadPDF();
      setSaveMessage('PDF downloaded successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSaveMessage('Error generating PDF');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Download with verification
  const handleDownloadWithVerification = async () => {
    // Check if skills are already verified
    const storedVerification = localStorage.getItem(`resume_verified_${resumeData.personalInfo.fullName}`);
    
    if (storedVerification) {
      const verificationData = JSON.parse(storedVerification);
      if (verificationData.passed && verificationData.verifiedSkills.length > 0) {
        // Skills already verified, proceed with download
        await generateAndDownloadPDF();
        return;
      }
    }

    // Check verification status first
    const status = await checkVerificationStatus();
    
    if (!status.can_attempt) {
      alert(status.message);
      return;
    }

    // If not verified, show verification popup
    if (resumeData.skills && resumeData.skills.length > 0) {
      setShowSkillVerification(true);
    } else {
      alert('Please add skills to your resume before verification.');
    }
  };

  // Skill Verification Handlers
  const handleVerificationComplete = (results) => {
    setVerificationResults(results);
    setShowSkillVerification(false);
    
    if (results.passed) {
      setVerifiedSkills(results.verifiedSkills);
      setIsVerificationComplete(true);
      // Automatically download after successful verification
      setTimeout(() => {
        generateAndDownloadPDF();
      }, 1000);
    } else {
      const attemptsRemaining = 3 - (results.attempt_data?.current_attempt || 0);
      let message = `Verification failed! Score: ${results.score}%. `;
      
      if (results.attempt_data?.current_attempt === 1) {
        message += 'Next attempt available in 2 minutes.';
      } else if (results.attempt_data?.current_attempt === 2) {
        message += 'Final attempt available in 24 hours.';
      } else {
        message += 'No more attempts available.';
      }
      
      setSaveMessage(message);
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  const handleVerificationClose = () => {
    setShowSkillVerification(false);
  };

  // Input handlers
  const handleInputChange = (section, field, value) => {
    setResumeData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };

  // Work Experience handlers
  const addWorkExperience = () => {
    setResumeData(prevData => ({
      ...prevData,
      workExperience: [
        ...(prevData.workExperience || []),
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }));
  };

  const handleWorkExperienceChange = (index, field, value) => {
    setResumeData(prevData => {
      const newWorkExperience = [...(prevData.workExperience || [])];
      if (!newWorkExperience[index]) {
        newWorkExperience[index] = { company: '', position: '', startDate: '', endDate: '', description: '' };
      }
      newWorkExperience[index] = {
        ...newWorkExperience[index],
        [field]: value
      };
      return {
        ...prevData,
        workExperience: newWorkExperience
      };
    });
  };

  const removeWorkExperience = (index) => {
    setResumeData(prevData => {
      const newWorkExperience = prevData.workExperience ? prevData.workExperience.filter((_, i) => i !== index) : [];
      return {
        ...prevData,
        workExperience: newWorkExperience
      };
    });
  };

  // ✅ NEW: Internship handlers
  const addInternship = () => {
    setResumeData(prevData => ({
      ...prevData,
      internships: [
        ...(prevData.internships || []),
        {
          company: '',
          position: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }));
  };

  const handleInternshipChange = (index, field, value) => {
    setResumeData(prevData => {
      const newInternships = [...(prevData.internships || [])];
      if (!newInternships[index]) {
        newInternships[index] = { company: '', position: '', startDate: '', endDate: '', description: '' };
      }
      newInternships[index] = {
        ...newInternships[index],
        [field]: value
      };
      return {
        ...prevData,
        internships: newInternships
      };
    });
  };

  const removeInternship = (index) => {
    setResumeData(prevData => {
      const newInternships = prevData.internships ? prevData.internships.filter((_, i) => i !== index) : [];
      return {
        ...prevData,
        internships: newInternships
      };
    });
  };

  // ✅ NEW: Extra Curricular Activities handlers
  const addExtracurricular = () => {
    setResumeData(prevData => ({
      ...prevData,
      extracurriculars: [
        ...(prevData.extracurriculars || []),
        {
          role: '',
          organization: '',
          startDate: '',
          endDate: '',
          description: ''
        }
      ]
    }));
  };

  const handleExtracurricularChange = (index, field, value) => {
    setResumeData(prevData => {
      const newExtracurriculars = [...(prevData.extracurriculars || [])];
      if (!newExtracurriculars[index]) {
        newExtracurriculars[index] = { role: '', organization: '', startDate: '', endDate: '', description: '' };
      }
      newExtracurriculars[index] = {
        ...newExtracurriculars[index],
        [field]: value
      };
      return {
        ...prevData,
        extracurriculars: newExtracurriculars
      };
    });
  };

  const removeExtracurricular = (index) => {
    setResumeData(prevData => {
      const newExtracurriculars = prevData.extracurriculars ? prevData.extracurriculars.filter((_, i) => i !== index) : [];
      return {
        ...prevData,
        extracurriculars: newExtracurriculars
      };
    });
  };

  // ✅ NEW: Languages handlers
  const addLanguage = () => {
    setResumeData(prevData => ({
      ...prevData,
      languages: [
        ...(prevData.languages || []),
        {
          language: '',
          proficiency: 'Intermediate'
        }
      ]
    }));
  };

  const handleLanguageChange = (index, field, value) => {
    setResumeData(prevData => {
      const newLanguages = [...(prevData.languages || [])];
      if (!newLanguages[index]) {
        newLanguages[index] = { language: '', proficiency: 'Intermediate' };
      }
      newLanguages[index] = {
        ...newLanguages[index],
        [field]: value
      };
      return {
        ...prevData,
        languages: newLanguages
      };
    });
  };

  const removeLanguage = (index) => {
    setResumeData(prevData => {
      const newLanguages = prevData.languages ? prevData.languages.filter((_, i) => i !== index) : [];
      // Ensure at least one language remains
      if (newLanguages.length === 0) {
        newLanguages.push({ language: 'English', proficiency: 'Native' });
      }
      return {
        ...prevData,
        languages: newLanguages
      };
    });
  };

  // Skills handlers with recommendations
  const handleSkillAdd = (skill) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !resumeData.skills.includes(trimmedSkill)) {
      setResumeData(prevData => ({
        ...prevData,
        skills: [...prevData.skills, trimmedSkill]
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setResumeData(prevData => ({
      ...prevData,
      skills: prevData.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSkillRecommendationClick = (skill) => {
    handleSkillAdd(skill);
    // Remove from recommendations
    setSkillRecommendations(prev => prev.filter(s => s !== skill));
  };

  const handleTemplateSelect = (template) => {
    setResumeData(prevData => ({
      ...prevData,
      selectedTemplate: template
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setResumeData(prevData => {
      const newEducation = [...prevData.education];
      if (!newEducation[index]) {
        newEducation[index] = { degree: '', institution: '', year: '', score: '', details: '' };
      }
      newEducation[index] = {
        ...newEducation[index],
        [field]: value
      };
      return {
        ...prevData,
        education: newEducation
      };
    });
  };

  const addNewEducation = () => {
    if (resumeData.education.length >= 5) {
      alert('Maximum 5 education entries allowed');
      return;
    }
    
    setResumeData(prevData => ({
      ...prevData,
      education: [
        ...prevData.education,
        {
          degree: '',
          institution: '',
          year: '',
          score: '',
          details: ''
        }
      ]
    }));
  };

  const removeEducation = (index) => {
    if (resumeData.education.length <= 1) {
      setResumeData(prevData => ({
        ...prevData,
        education: [{
          degree: '',
          institution: '',
          year: '',
          score: '',
          details: ''
        }]
      }));
    } else {
      setResumeData(prevData => ({
        ...prevData,
        education: prevData.education.filter((_, i) => i !== index)
      }));
    }
  };

  const handleProjectChange = (index, field, value) => {
    setResumeData(prevData => {
      const newProjects = [...prevData.projects];
      if (!newProjects[index]) {
        newProjects[index] = { title: '', description: '' };
      }
      newProjects[index] = {
        ...newProjects[index],
        [field]: value
      };
      return {
        ...prevData,
        projects: newProjects
      };
    });
  };

  const addNewProject = () => {
    if (resumeData.projects.length >= 5) {
      alert('Maximum 5 project entries allowed');
      return;
    }
    
    setResumeData(prevData => ({
      ...prevData,
      projects: [
        ...prevData.projects,
        {
          title: '',
          description: ''
        }
      ]
    }));
  };

  const removeProject = (index) => {
    if (resumeData.projects.length <= 1) {
      setResumeData(prevData => ({
        ...prevData,
        projects: [{
          title: '',
          description: ''
        }]
      }));
    } else {
      setResumeData(prevData => ({
        ...prevData,
        projects: prevData.projects.filter((_, i) => i !== index)
      }));
    }
  };

  const handleCertificationAdd = (certification) => {
    const trimmedCert = certification.trim();
    if (trimmedCert && !resumeData.certifications.includes(trimmedCert)) {
      setResumeData(prevData => ({
        ...prevData,
        certifications: [...prevData.certifications, trimmedCert]
      }));
    }
  };

  const handleCertificationRemove = (certToRemove) => {
    setResumeData(prevData => ({
      ...prevData,
      certifications: prevData.certifications.filter(cert => cert !== certToRemove)
    }));
  };

  const handleAchievementAdd = (achievement) => {
    const trimmedAch = achievement.trim();
    if (trimmedAch && !resumeData.achievements.includes(trimmedAch)) {
      setResumeData(prevData => ({
        ...prevData,
        achievements: [...prevData.achievements, trimmedAch]
      }));
    }
  };

  const handleAchievementRemove = (achToRemove) => {
    setResumeData(prevData => ({
      ...prevData,
      achievements: prevData.achievements.filter(ach => ach !== achToRemove)
    }));
  };

  const clearAllData = () => {
    try {
      localStorage.removeItem('resumeData');
      localStorage.removeItem('currentResume');
      localStorage.removeItem('resumeFormData');
      localStorage.removeItem(`resume_verified_${resumeData.personalInfo.fullName}`);
      localStorage.removeItem(`skill_attempts_${resumeData.personalInfo.fullName}`);
      setResumeData(defaultResumeData);
      setIsFromAI(false);
      setVerifiedSkills([]);
      setIsVerificationComplete(false);
      setVerificationStatus(null);
      setSaveMessage('All data cleared!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeData(prevData => ({
          ...prevData,
          personalInfo: {
            ...prevData.personalInfo,
            photo: e.target.result
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setResumeData(prevData => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        photo: null
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="editor-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-page">
      <div className="editor-header">
        <div className="header-left">
          <h1>InsightResume Editor</h1>
          <p>AI-Powered Resume Builder - A4 Format Ready</p>
          
          {/* AI Generated Badge */}
          {isFromAI && (
            <div className="ai-badge">
              🚀 AI-Generated Resume - Ready to Customize!
            </div>
          )}
          
          {/* Verification Status Badge */}
          {isVerificationComplete && verifiedSkills.length > 0 && (
            <div className="verification-badge">
              ✅ Skills Verified! {verifiedSkills.length} skills certified
            </div>
          )}
          
          {/* Attempt Status Badge */}
          {verificationStatus && !verificationStatus.can_attempt && (
            <div className="attempt-status-badge">
              🔒 {verificationStatus.message}
            </div>
          )}
          
          {saveMessage && <div className="save-message">{saveMessage}</div>}
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
          
          {/* Download Options Dropdown */}
          <div className="download-options">
            <button className="btn-primary dropdown-toggle">
              Download Options ▼
            </button>
            <div className="dropdown-menu">
              <button 
                className="dropdown-item"
                onClick={handleDownloadWithoutVerification}
              >
                📄 Download PDF (Without Verification)
              </button>
              <button 
                className={`dropdown-item ${isVerificationComplete ? 'verified' : ''}`}
                onClick={handleDownloadWithVerification}
              >
                {isVerificationComplete ? '✅ Download Verified PDF' : '🔒 Download with Verification'}
              </button>
              <button 
                className="dropdown-item"
                onClick={handleSaveResume}
              >
                💾 Save Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="editor-layout">
        {/* Left Sidebar - Template Selector */}
        <div className="template-selector">
          <h3>Choose Template</h3>
          <div className="template-buttons">
            {[
              { id: 'professional', name: 'Professional' },
              { id: 'modern', name: 'Modern' },
              { id: 'creative', name: 'Creative' },
              { id: 'irm', name: 'IRM Special' }
            ].map(template => (
              <button
                key={template.id}
                className={resumeData.selectedTemplate === template.name ? 'active' : ''}
                onClick={() => handleTemplateSelect(template.name)}
              >
                {template.name}
              </button>
            ))}
          </div>

          {/* Photo Upload for IRM Template */}
          {resumeData.selectedTemplate === 'IRM Special' && (
            <div className="photo-upload-section">
              <h4>Profile Photo</h4>
              <div className="photo-preview">
                {resumeData.personalInfo.photo ? (
                  <img src={resumeData.personalInfo.photo} alt="Profile" className="profile-photo" />
                ) : (
                  <div className="default-photo">No Photo</div>
                )}
              </div>
              <div className="photo-actions">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="photo-input"
                />
                <label htmlFor="photo-upload" className="upload-btn">
                  Upload Photo
                </label>
                {resumeData.personalInfo.photo && (
                  <button className="remove-photo-btn" onClick={handleRemovePhoto}>
                    Remove
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ✅ NEW: Professional Title Generator */}
          <div className="title-generator-section">
            <h4>Professional Title</h4>
            <button 
              className="btn-generate-title"
              onClick={generateProfessionalTitle}
            >
              🚀 Generate Professional Title
            </button>
            <p className="generator-note">
              Based on your education and skills
            </p>
          </div>

          {/* ✅ NEW: Enhanced Skill Verification Status */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="verification-status-section">
              <h4>Download Options</h4>
              
              {/* Quick Download Options */}
              <div className="quick-download-options">
                <button 
                  className="btn-download-quick"
                  onClick={handleDownloadWithoutVerification}
                >
                  📄 Quick Download
                </button>
                
                {isVerificationComplete ? (
                  <button 
                    className="btn-download-verified"
                    onClick={handleDownloadWithVerification}
                  >
                    ✅ Download Verified
                  </button>
                ) : (
                  <button 
                    className="btn-download-verify"
                    onClick={handleDownloadWithVerification}
                  >
                    🔒 Verify & Download
                  </button>
                )}
              </div>

              {isVerificationComplete ? (
                <div className="verification-success">
                  <p>✅ {verifiedSkills.length} skills verified</p>
                  <p>Ready for download!</p>
                </div>
              ) : verificationStatus && !verificationStatus.can_attempt ? (
                <div className="verification-locked">
                  <p>🔒 {verificationStatus.message}</p>
                  {verificationStatus.attempt_data && (
                    <div className="attempt-details-small">
                      <p>Attempt: {verificationStatus.attempt_data.current_attempt}/3</p>
                      {verificationStatus.attempt_data.lock_until && (
                        <p>Next: {new Date(verificationStatus.attempt_data.lock_until).toLocaleString()}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="verification-pending">
                  <p>Skills need verification</p>
                  <p>Click "Verify & Download" to start</p>
                  <p className="verification-note">20 seconds per question</p>
                  <p className="attempt-rules-note">
                    <small>3 attempts total • 67% to pass</small>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center Panel - Live Preview */}
        <div className="preview-panel">
          <div className="preview-container">
            <div 
              ref={resumeRef}
              className={`resume-preview ${resumeData.selectedTemplate.toLowerCase().replace(' ', '-')}-template a4-page`}
            >
              {resumeData.selectedTemplate === 'Professional' && (
                <ProfessionalTemplate data={resumeData} verifiedSkills={verifiedSkills} />
              )}
              {resumeData.selectedTemplate === 'Modern' && (
                <ModernTemplate data={resumeData} verifiedSkills={verifiedSkills} />
              )}
              {resumeData.selectedTemplate === 'Creative' && (
                <CreativeTemplate data={resumeData} verifiedSkills={verifiedSkills} />
              )}
              {resumeData.selectedTemplate === 'IRM Special' && (
                <IRMSpecialTemplate data={resumeData} verifiedSkills={verifiedSkills} />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Editing Controls */}
        <div className="editing-panel">
          <ResumeForm 
            data={resumeData} 
            onChange={handleInputChange}
            onAddEducation={addNewEducation}
            onRemoveEducation={removeEducation}
            onEducationChange={handleEducationChange}
            onSkillAdd={handleSkillAdd}
            onSkillRemove={handleSkillRemove}
            onSkillRecommendationClick={handleSkillRecommendationClick}
            skillRecommendations={skillRecommendations}
            onProjectAdd={addNewProject}
            onProjectRemove={removeProject}
            onProjectChange={handleProjectChange}
            onCertificationAdd={handleCertificationAdd}
            onCertificationRemove={handleCertificationRemove}
            onAchievementAdd={handleAchievementAdd}
            onAchievementRemove={handleAchievementRemove}
            onWorkExperienceAdd={addWorkExperience}
            onWorkExperienceChange={handleWorkExperienceChange}
            onWorkExperienceRemove={removeWorkExperience}
            onInternshipAdd={addInternship}
            onInternshipChange={handleInternshipChange}
            onInternshipRemove={removeInternship}
            onExtracurricularAdd={addExtracurricular}
            onExtracurricularChange={handleExtracurricularChange}
            onExtracurricularRemove={removeExtracurricular}
            onLanguageAdd={addLanguage}
            onLanguageChange={handleLanguageChange}
            onLanguageRemove={removeLanguage}
            onClearAll={clearAllData}
          />
        </div>
      </div>

      {/* Skill Verification Popup */}
      {showSkillVerification && (
        <SkillVerificationPopup
          skills={resumeData.skills || []}
          onComplete={handleVerificationComplete}
          onClose={handleVerificationClose}
          resumeData={resumeData}
        />
      )}
    </div>
  );
};

// Professional Template Component - UPDATED WITH VERIFIED SKILLS AND DOB
const ProfessionalTemplate = ({ data, verifiedSkills = [] }) => {
  const { personalInfo, education, skills, projects, certifications, achievements, workExperience, internships, extracurriculars, languages } = data;
  
  // Ensure all data is safe to render
  const safeSkills = Array.isArray(skills) ? skills.filter(skill => typeof skill === 'string') : [];
  const safeCertifications = Array.isArray(certifications) ? certifications.filter(cert => typeof cert === 'string') : [];
  const safeAchievements = Array.isArray(achievements) ? achievements.filter(ach => typeof ach === 'string') : [];
  const safeWorkExperience = Array.isArray(workExperience) ? workExperience.filter(exp => exp && (exp.company || exp.position)) : [];
  const safeInternships = Array.isArray(internships) ? internships.filter(intern => intern && (intern.company || intern.position)) : [];
  const safeExtracurriculars = Array.isArray(extracurriculars) ? extracurriculars.filter(activity => activity && (activity.role || activity.organization)) : [];
  const safeLanguages = Array.isArray(languages) ? languages.filter(lang => lang && lang.language) : [];

  const hasWorkExperience = safeWorkExperience.length > 0;
  const hasInternships = safeInternships.length > 0;
  const hasExtracurriculars = safeExtracurriculars.length > 0;
  const hasLanguages = safeLanguages.length > 0;
  
  return (
    <div className="professional-template a4-document">
      {/* Header */}
      <div className="professional-header">
        <h1 className="professional-name">{personalInfo.fullName || "Your Name"}</h1>
        <p className="professional-title">{personalInfo.jobTitle || "Professional Title"}</p>
        <div className="professional-contact">
          <span>📞 {personalInfo.phone || "Phone"}</span>
          <span>📧 {personalInfo.email || "Email"}</span>
          <span>📍 {personalInfo.location || "Location"}</span>
          {personalInfo.dateOfBirth && <span>📆 {personalInfo.dateOfBirth}</span>}
        </div>
      </div>

      {/* Summary */}
      <div className="section">
        <h2 className="section-title">PROFESSIONAL SUMMARY</h2>
        <div className="section-content">
          <p>{personalInfo.about || "Professional summary about your background, skills, and career objectives."}</p>
        </div>
      </div>

      {/* Work Experience - ONLY SHOW IF EXISTS */}
      {hasWorkExperience && (
        <div className="section">
          <h2 className="section-title">WORK EXPERIENCE</h2>
          <div className="section-content">
            {safeWorkExperience.map((exp, index) => (
              <div key={index} className="education-item">
                <div className="education-header">
                  <strong>{exp.position || "Position"}</strong>
                  <span className="education-year">{exp.startDate || "Start"} - {exp.endDate || "End"}</span>
                </div>
                <div className="education-school">{exp.company || "Company"}</div>
                {exp.description && <div className="education-details">{exp.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ NEW: Internships - ONLY SHOW IF EXISTS */}
      {hasInternships && (
        <div className="section">
          <h2 className="section-title">INTERNSHIPS</h2>
          <div className="section-content">
            {safeInternships.map((intern, index) => (
              <div key={index} className="education-item">
                <div className="education-header">
                  <strong>{intern.position || "Position"}</strong>
                  <span className="education-year">{intern.startDate || "Start"} - {intern.endDate || "End"}</span>
                </div>
                <div className="education-school">{intern.company || "Company"}</div>
                {intern.description && <div className="education-details">{intern.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      <div className="section">
        <h2 className="section-title">EDUCATION</h2>
        <div className="section-content">
          {education && education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="education-header">
                <strong>{edu.degree || "Degree"}</strong>
                <span className="education-year">{edu.year || "Year"}</span>
              </div>
              <div className="education-school">{edu.institution || "School/University"}</div>
              {edu.score && <div className="education-score">Score: {edu.score}</div>}
              {edu.details && <div className="education-details">{edu.details}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ NEW: Extra Curricular Activities - ONLY SHOW IF EXISTS */}
      {hasExtracurriculars && (
        <div className="section">
          <h2 className="section-title">EXTRA CURRICULAR ACTIVITIES</h2>
          <div className="section-content">
            {safeExtracurriculars.map((activity, index) => (
              <div key={index} className="education-item">
                <div className="education-header">
                  <strong>{activity.role || "Role"}</strong>
                  <span className="education-year">{activity.startDate || "Start"} - {activity.endDate || "End"}</span>
                </div>
                <div className="education-school">{activity.organization || "Organization"}</div>
                {activity.description && <div className="education-details">{activity.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {safeSkills.length > 0 && (
        <div className="section">
          <h2 className="section-title">SKILLS</h2>
          <div className="section-content">
            <div className="skills-grid">
              {safeSkills.map((skill, index) => (
                <span key={index} className={`skill-tag ${verifiedSkills.includes(skill) ? 'verified' : ''}`}>
                  {skill}
                  {verifiedSkills.includes(skill) && <span className="verified-badge">✅</span>}
                </span>
              ))}
            </div>
            {verifiedSkills.length > 0 && (
              <div className="verification-note">
                <small>✅ Verified skills certified by InsightResume</small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && projects.some(p => p.title || p.description) && (
        <div className="section">
          <h2 className="section-title">PROJECTS</h2>
          <div className="section-content">
            {projects.map((project, index) => (
              (project.title || project.description) && (
                <div key={index} className="project-item">
                  <strong>{project.title || "Project Title"}</strong>
                  <p>{project.description || "Project description"}</p>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* ✅ NEW: Languages - ONLY SHOW IF EXISTS */}
      {hasLanguages && (
        <div className="section">
          <h2 className="section-title">LANGUAGES</h2>
          <div className="section-content">
            <div className="languages-list">
              {safeLanguages.map((lang, index) => (
                <div key={index} className="language-item">
                  <strong>{lang.language}</strong>: {lang.proficiency}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certifications */}
      {safeCertifications.length > 0 && (
        <div className="section">
          <h2 className="section-title">CERTIFICATIONS</h2>
          <div className="section-content">
            <ul>
              {safeCertifications.map((cert, index) => (
                <li key={index}>{cert}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Achievements */}
      {safeAchievements.length > 0 && (
        <div className="section">
          <h2 className="section-title">ACHIEVEMENTS</h2>
          <div className="section-content">
            <ul>
              {safeAchievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Modern Template Component - UPDATED WITH VERIFIED SKILLS AND DOB
const ModernTemplate = ({ data, verifiedSkills = [] }) => {
  const { personalInfo, education, skills, projects, workExperience, internships, extracurriculars, languages } = data;
  const safeWorkExperience = Array.isArray(workExperience) ? workExperience.filter(exp => exp && (exp.company || exp.position)) : [];
  const safeInternships = Array.isArray(internships) ? internships.filter(intern => intern && (intern.company || intern.position)) : [];
  const safeExtracurriculars = Array.isArray(extracurriculars) ? extracurriculars.filter(activity => activity && (activity.role || activity.organization)) : [];
  const safeLanguages = Array.isArray(languages) ? languages.filter(lang => lang && lang.language) : [];
  const safeSkills = Array.isArray(skills) ? skills.filter(skill => typeof skill === 'string') : [];
  
  const hasWorkExperience = safeWorkExperience.length > 0;
  const hasInternships = safeInternships.length > 0;
  const hasExtracurriculars = safeExtracurriculars.length > 0;
  const hasLanguages = safeLanguages.length > 0;
  
  return (
    <div className="modern-template a4-document">
      <div className="modern-header">
        <h1>{personalInfo.fullName || "Your Name"}</h1>
        <p>{personalInfo.jobTitle || "Professional Title"}</p>
        <div className="modern-contact">
          <span>{personalInfo.email || "Email"}</span>
          <span>{personalInfo.phone || "Phone"}</span>
          <span>{personalInfo.location || "Location"}</span>
          {personalInfo.dateOfBirth && <span>📆 {personalInfo.dateOfBirth}</span>}
        </div>
      </div>
      
      <div className="modern-section">
        <h2>PROFESSIONAL SUMMARY</h2>
        <p>{personalInfo.about || "Professional summary about your background and career objectives."}</p>
      </div>

      {/* Work Experience - Conditionally rendered */}
      {hasWorkExperience && (
        <div className="modern-section">
          <h2>EXPERIENCE</h2>
          {safeWorkExperience.map((exp, index) => (
            <div key={index} className="modern-item">
              <h3>{exp.position || "Position"}</h3>
              <p className="modern-company">{exp.company || "Company"} | {exp.startDate || "Start"} - {exp.endDate || "End"}</p>
              <p>{exp.description || "Job responsibilities and achievements"}</p>
            </div>
          ))}
        </div>
      )}

      {/* ✅ NEW: Internships - Conditionally rendered */}
      {hasInternships && (
        <div className="modern-section">
          <h2>INTERNSHIPS</h2>
          {safeInternships.map((intern, index) => (
            <div key={index} className="modern-item">
              <h3>{intern.position || "Position"}</h3>
              <p className="modern-company">{intern.company || "Company"} | {intern.startDate || "Start"} - {intern.endDate || "End"}</p>
              <p>{intern.description || "Internship responsibilities and learnings"}</p>
            </div>
          ))}
        </div>
      )}

      <div className="modern-section">
        <h2>EDUCATION</h2>
        {education && education.map((edu, index) => (
          <div key={index} className="modern-item">
            <h3>{edu.degree || "Degree"}</h3>
            <p className="modern-company">{edu.institution || "Institution"} | {edu.year || "Year"}</p>
            {edu.score && <p>Score: {edu.score}</p>}
          </div>
        ))}
      </div>

      {/* ✅ NEW: Extra Curricular Activities - Conditionally rendered */}
      {hasExtracurriculars && (
        <div className="modern-section">
          <h2>EXTRA CURRICULAR</h2>
          {safeExtracurriculars.map((activity, index) => (
            <div key={index} className="modern-item">
              <h3>{activity.role || "Role"}</h3>
              <p className="modern-company">{activity.organization || "Organization"} | {activity.startDate || "Start"} - {activity.endDate || "End"}</p>
              <p>{activity.description || "Activities and responsibilities"}</p>
            </div>
          ))}
        </div>
      )}

      {safeSkills.length > 0 && (
        <div className="modern-section">
          <h2>SKILLS</h2>
          <div className="modern-skills">
            {safeSkills.map((skill, index) => (
              <span key={index} className={`modern-skill-tag ${verifiedSkills.includes(skill) ? 'verified' : ''}`}>
                {skill}
                {verifiedSkills.includes(skill) && <span className="verified-badge">✅</span>}
              </span>
            ))}
          </div>
          {verifiedSkills.length > 0 && (
            <div className="verification-note">
              <small>✅ Verified skills certified by InsightResume</small>
            </div>
          )}
        </div>
      )}

      {/* ✅ NEW: Languages - Conditionally rendered */}
      {hasLanguages && (
        <div className="modern-section">
          <h2>LANGUAGES</h2>
          <div className="modern-languages">
            {safeLanguages.map((lang, index) => (
              <span key={index} className="modern-language-tag">
                {lang.language} ({lang.proficiency})
              </span>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && projects.some(p => p.title || p.description) && (
        <div className="modern-section">
          <h2>PROJECTS</h2>
          {projects.map((project, index) => (
            (project.title || project.description) && (
              <div key={index} className="modern-item">
                <h3>{project.title || "Project Title"}</h3>
                <p>{project.description || "Project description"}</p>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

// Creative Template Component - UPDATED WITH VERIFIED SKILLS AND DOB
const CreativeTemplate = ({ data, verifiedSkills = [] }) => {
  const { personalInfo, education, skills, projects, workExperience, internships, extracurriculars, languages } = data;
  const safeWorkExperience = Array.isArray(workExperience) ? workExperience.filter(exp => exp && (exp.company || exp.position)) : [];
  const safeInternships = Array.isArray(internships) ? internships.filter(intern => intern && (intern.company || intern.position)) : [];
  const safeExtracurriculars = Array.isArray(extracurriculars) ? extracurriculars.filter(activity => activity && (activity.role || activity.organization)) : [];
  const safeLanguages = Array.isArray(languages) ? languages.filter(lang => lang && lang.language) : [];
  const safeSkills = Array.isArray(skills) ? skills.filter(skill => typeof skill === 'string') : [];
  
  const hasWorkExperience = safeWorkExperience.length > 0;
  const hasInternships = safeInternships.length > 0;
  const hasExtracurriculars = safeExtracurriculars.length > 0;
  const hasLanguages = safeLanguages.length > 0;
  
  return (
    <div className="creative-template a4-document">
      <div className="creative-header">
        <h1>{personalInfo.fullName || "Your Name"}</h1>
        <p>{personalInfo.jobTitle || "Professional Title"}</p>
        <div className="creative-contact">
          <span>📧 {personalInfo.email || "Email"}</span>
          <span>📞 {personalInfo.phone || "Phone"}</span>
          <span>📍 {personalInfo.location || "Location"}</span>
          {personalInfo.dateOfBirth && <span>📆 {personalInfo.dateOfBirth}</span>}
        </div>
      </div>
      
      <div className="creative-section">
        <h2>About Me</h2>
        <p>{personalInfo.about || "Professional summary about your background and career objectives."}</p>
      </div>

      {/* Work Experience - Conditionally rendered */}
      {hasWorkExperience && (
        <div className="creative-section">
          <h2>Work Experience</h2>
          {safeWorkExperience.map((exp, index) => (
            <div key={index} className="creative-item">
              <h3>{exp.position || "Position"} at {exp.company || "Company"}</h3>
              <p className="creative-dates">{exp.startDate || "Start"} - {exp.endDate || "End"}</p>
              <p>{exp.description || "Job responsibilities and achievements"}</p>
            </div>
          ))}
        </div>
      )}

      {/* ✅ NEW: Internships - Conditionally rendered */}
      {hasInternships && (
        <div className="creative-section">
          <h2>Internships</h2>
          {safeInternships.map((intern, index) => (
            <div key={index} className="creative-item">
              <h3>{intern.position || "Position"} at {intern.company || "Company"}</h3>
              <p className="creative-dates">{intern.startDate || "Start"} - {intern.endDate || "End"}</p>
              <p>{intern.description || "Internship responsibilities and learnings"}</p>
            </div>
          ))}
        </div>
      )}

      <div className="creative-section">
        <h2>Education</h2>
        {education && education.map((edu, index) => (
          <div key={index} className="creative-item">
            <h3>{edu.degree || "Degree"}</h3>
            <p>{edu.institution || "Institution"} • {edu.year || "Year"}</p>
            {edu.score && <p>Grade: {edu.score}</p>}
          </div>
        ))}
      </div>

      {/* ✅ NEW: Extra Curricular Activities - Conditionally rendered */}
      {hasExtracurriculars && (
        <div className="creative-section">
          <h2>Extra Curricular</h2>
          {safeExtracurriculars.map((activity, index) => (
            <div key={index} className="creative-item">
              <h3>{activity.role || "Role"} at {activity.organization || "Organization"}</h3>
              <p className="creative-dates">{activity.startDate || "Start"} - {activity.endDate || "End"}</p>
              <p>{activity.description || "Activities and responsibilities"}</p>
            </div>
          ))}
        </div>
      )}

      {safeSkills.length > 0 && (
        <div className="creative-section">
          <h2>Skills</h2>
          <div className="creative-skills">
            {safeSkills.map((skill, index) => (
              <span key={index} className={`creative-skill-tag ${verifiedSkills.includes(skill) ? 'verified' : ''}`}>
                {skill}
                {verifiedSkills.includes(skill) && <span className="verified-badge">✅</span>}
              </span>
            ))}
          </div>
          {verifiedSkills.length > 0 && (
            <div className="verification-note">
              <small>✅ Verified skills certified by InsightResume</small>
            </div>
          )}
        </div>
      )}

      {/* ✅ NEW: Languages - Conditionally rendered */}
      {hasLanguages && (
        <div className="creative-section">
          <h2>Languages</h2>
          <div className="creative-languages">
            {safeLanguages.map((lang, index) => (
              <span key={index} className="creative-language-tag">
                {lang.language} ({lang.proficiency})
              </span>
            ))}
          </div>
        </div>
      )}

      {projects && projects.length > 0 && projects.some(p => p.title || p.description) && (
        <div className="creative-section">
          <h2>Projects</h2>
          {projects.map((project, index) => (
            (project.title || project.description) && (
              <div key={index} className="creative-item">
                <h3>{project.title || "Project Title"}</h3>
                <p>{project.description || "Project description"}</p>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

// IRM Special Template Component - UPDATED WITH VERIFIED SKILLS AND DOB
const IRMSpecialTemplate = ({ data, verifiedSkills = [] }) => {
  const { personalInfo, education, skills, projects, workExperience, internships, extracurriculars, languages } = data;
  
  // Ensure skills are safe to render
  const safeSkills = Array.isArray(skills) ? skills.filter(skill => typeof skill === 'string') : [];
  const safeWorkExperience = Array.isArray(workExperience) ? workExperience.filter(exp => exp && (exp.company || exp.position)) : [];
  const safeInternships = Array.isArray(internships) ? internships.filter(intern => intern && (intern.company || intern.position)) : [];
  const safeExtracurriculars = Array.isArray(extracurriculars) ? extracurriculars.filter(activity => activity && (activity.role || activity.organization)) : [];
  const safeLanguages = Array.isArray(languages) ? languages.filter(lang => lang && lang.language) : [];

  const hasWorkExperience = safeWorkExperience.length > 0;
  const hasInternships = safeInternships.length > 0;
  const hasExtracurriculars = safeExtracurriculars.length > 0;
  const hasLanguages = safeLanguages.length > 0;
  
  return (
    <div className="irm-template a4-document">
      {/* Header with Photo */}
      <div className="irm-header">
        <div className="irm-photo-section">
          {personalInfo.photo ? (
            <img src={personalInfo.photo} alt="Profile" className="irm-profile-photo" />
          ) : (
            <div className="irm-default-photo">
              <div className="irm-logo-circle">
                <span className="irm-logo-text">IR</span>
              </div>
            </div>
          )}
        </div>
        <div className="irm-info-section">
          <h1 className="irm-name">{personalInfo.fullName || "Your Name"}</h1>
          <p className="irm-title">{personalInfo.jobTitle || "Professional Title"}</p>
          <div className="irm-contact">
            <span>📞 {personalInfo.phone || "Phone"}</span>
            <span>📧 {personalInfo.email || "Email"}</span>
            <span>📍 {personalInfo.location || "Location"}</span>
            {personalInfo.dateOfBirth && <span>📆 {personalInfo.dateOfBirth}</span>}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="irm-section">
        <h2 className="irm-section-title">PROFESSIONAL SUMMARY</h2>
        <div className="irm-section-content">
          <p>{personalInfo.about || "Professional summary about your background and career objectives."}</p>
        </div>
      </div>

      {/* Work Experience - ONLY SHOW IF EXISTS */}
      {hasWorkExperience && (
        <div className="irm-section">
          <h2 className="irm-section-title">WORK EXPERIENCE</h2>
          <div className="irm-section-content">
            {safeWorkExperience.map((exp, index) => (
              <div key={index} className="irm-education-item">
                <div className="irm-education-header">
                  <strong>{exp.position || "Position"}</strong>
                  <span className="irm-education-year">{exp.startDate || "Start"} - {exp.endDate || "End"}</span>
                </div>
                <div className="irm-education-school">{exp.company || "Company"}</div>
                {exp.description && <div className="irm-education-details">{exp.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ NEW: Internships - ONLY SHOW IF EXISTS */}
      {hasInternships && (
        <div className="irm-section">
          <h2 className="irm-section-title">INTERNSHIPS</h2>
          <div className="irm-section-content">
            {safeInternships.map((intern, index) => (
              <div key={index} className="irm-education-item">
                <div className="irm-education-header">
                  <strong>{intern.position || "Position"}</strong>
                  <span className="irm-education-year">{intern.startDate || "Start"} - {intern.endDate || "End"}</span>
                </div>
                <div className="irm-education-school">{intern.company || "Company"}</div>
                {intern.description && <div className="irm-education-details">{intern.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      <div className="irm-section">
        <h2 className="irm-section-title">EDUCATION</h2>
        <div className="irm-section-content">
          {education && education.map((edu, index) => (
            <div key={index} className="irm-education-item">
              <div className="irm-education-header">
                <strong>{edu.degree || "Degree"}</strong>
                <span className="irm-education-year">{edu.year || "Year"}</span>
              </div>
              <div className="irm-education-school">{edu.institution || "Institution"}</div>
              {edu.score && <div className="irm-education-score">{edu.score}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ NEW: Extra Curricular Activities - ONLY SHOW IF EXISTS */}
      {hasExtracurriculars && (
        <div className="irm-section">
          <h2 className="irm-section-title">EXTRA CURRICULAR ACTIVITIES</h2>
          <div className="irm-section-content">
            {safeExtracurriculars.map((activity, index) => (
              <div key={index} className="irm-education-item">
                <div className="irm-education-header">
                  <strong>{activity.role || "Role"}</strong>
                  <span className="irm-education-year">{activity.startDate || "Start"} - {activity.endDate || "End"}</span>
                </div>
                <div className="irm-education-school">{activity.organization || "Organization"}</div>
                {activity.description && <div className="irm-education-details">{activity.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {safeSkills.length > 0 && (
        <div className="irm-section">
          <h2 className="irm-section-title">SKILLS</h2>
          <div className="irm-section-content">
            <div className="irm-skills-grid">
              {safeSkills.map((skill, index) => (
                <span key={index} className={`irm-skill-tag ${verifiedSkills.includes(skill) ? 'verified' : ''}`}>
                  {skill}
                  {verifiedSkills.includes(skill) && <span className="verified-badge">✅</span>}
                </span>
              ))}
            </div>
            {verifiedSkills.length > 0 && (
              <div className="verification-note">
                <small>✅ Verified skills certified by InsightResume</small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ✅ NEW: Languages - ONLY SHOW IF EXISTS */}
      {hasLanguages && (
        <div className="irm-section">
          <h2 className="irm-section-title">LANGUAGES</h2>
          <div className="irm-section-content">
            <div className="irm-languages-list">
              {safeLanguages.map((lang, index) => (
                <div key={index} className="irm-language-item">
                  <strong>{lang.language}</strong>: {lang.proficiency}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && projects.some(p => p.title || p.description) && (
        <div className="irm-section">
          <h2 className="irm-section-title">PROJECTS</h2>
          <div className="irm-section-content">
            {projects.map((project, index) => (
              (project.title || project.description) && (
                <div key={index} className="irm-project-item">
                  <h4>{project.title || "Project Title"}</h4>
                  <p>{project.description || "Project description"}</p>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Resume Form Component for Editing - UPDATED WITH ALL NEW SECTIONS INCLUDING DOB
const ResumeForm = ({ 
  data, 
  onChange, 
  onAddEducation, 
  onRemoveEducation, 
  onEducationChange,
  onSkillAdd,
  onSkillRemove,
  onSkillRecommendationClick,
  skillRecommendations,
  onProjectAdd,
  onProjectRemove,
  onProjectChange,
  onCertificationAdd,
  onCertificationRemove,
  onAchievementAdd,
  onAchievementRemove,
  onWorkExperienceAdd,
  onWorkExperienceChange,
  onWorkExperienceRemove,
  onInternshipAdd,
  onInternshipChange,
  onInternshipRemove,
  onExtracurricularAdd,
  onExtracurricularChange,
  onExtracurricularRemove,
  onLanguageAdd,
  onLanguageChange,
  onLanguageRemove,
  onClearAll
}) => {
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const handleSkillSubmit = (e) => {
    e.preventDefault();
    if (newSkill.trim()) {
      onSkillAdd(newSkill.trim());
      setNewSkill('');
    }
  };

  const handleCertificationSubmit = (e) => {
    e.preventDefault();
    if (newCertification.trim()) {
      onCertificationAdd(newCertification.trim());
      setNewCertification('');
    }
  };

  const handleAchievementSubmit = (e) => {
    e.preventDefault();
    if (newAchievement.trim()) {
      onAchievementAdd(newAchievement.trim());
      setNewAchievement('');
    }
  };

  // Ensure all data is safe for rendering
  const safeSkills = Array.isArray(data.skills) ? data.skills.filter(skill => typeof skill === 'string') : [];
  const safeCertifications = Array.isArray(data.certifications) ? data.certifications.filter(cert => typeof cert === 'string') : [];
  const safeAchievements = Array.isArray(data.achievements) ? data.achievements.filter(ach => typeof ach === 'string') : [];
  const safeWorkExperience = Array.isArray(data.workExperience) ? data.workExperience : [];
  const safeInternships = Array.isArray(data.internships) ? data.internships : [];
  const safeExtracurriculars = Array.isArray(data.extracurriculars) ? data.extracurriculars : [];
  const safeLanguages = Array.isArray(data.languages) ? data.languages : [];

  return (
    <div className="resume-form">
      <h3>Edit Resume</h3>
      
      {/* Personal Information */}
      <div className="form-section">
        <h4>Personal Information</h4>
        <input
          type="text"
          placeholder="Full Name"
          value={data.personalInfo.fullName || ""}
          onChange={(e) => onChange('personalInfo', 'fullName', e.target.value)}
        />
        <input
          type="text"
          placeholder="Job Title"
          value={data.personalInfo.jobTitle || ""}
          onChange={(e) => onChange('personalInfo', 'jobTitle', e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={data.personalInfo.email || ""}
          onChange={(e) => onChange('personalInfo', 'email', e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone"
          value={data.personalInfo.phone || ""}
          onChange={(e) => onChange('personalInfo', 'phone', e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={data.personalInfo.location || ""}
          onChange={(e) => onChange('personalInfo', 'location', e.target.value)}
        />
        {/* ✅ NEW: Date of Birth Field */}
        <input
          type="date"
          placeholder="Date of Birth"
          value={data.personalInfo.dateOfBirth || ""}
          onChange={(e) => onChange('personalInfo', 'dateOfBirth', e.target.value)}
        />
        <textarea
          placeholder="Professional Summary"
          value={data.personalInfo.about || ""}
          onChange={(e) => onChange('personalInfo', 'about', e.target.value)}
          rows="4"
        />
      </div>

      {/* Work Experience */}
      <div className="form-section">
        <div className="section-header">
          <h4>Work Experience</h4>
          <button className="btn-add" onClick={onWorkExperienceAdd}>
            + Add Experience
          </button>
        </div>
        {safeWorkExperience.map((exp, index) => (
          <div key={index} className="form-item">
            <input
              type="text"
              placeholder="Company"
              value={exp.company || ""}
              onChange={(e) => onWorkExperienceChange(index, 'company', e.target.value)}
            />
            <input
              type="text"
              placeholder="Position"
              value={exp.position || ""}
              onChange={(e) => onWorkExperienceChange(index, 'position', e.target.value)}
            />
            <div className="form-row">
              <input
                type="text"
                placeholder="Start Date"
                value={exp.startDate || ""}
                onChange={(e) => onWorkExperienceChange(index, 'startDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="End Date"
                value={exp.endDate || ""}
                onChange={(e) => onWorkExperienceChange(index, 'endDate', e.target.value)}
              />
            </div>
            <textarea
              placeholder="Description & Achievements"
              value={exp.description || ""}
              onChange={(e) => onWorkExperienceChange(index, 'description', e.target.value)}
              rows="3"
            />
            <button 
              className="btn-remove"
              onClick={() => onWorkExperienceRemove(index)}
            >
              Remove
            </button>
          </div>
        ))}
        {safeWorkExperience.length === 0 && (
          <p className="optional-note">Add your professional work experience here.</p>
        )}
      </div>

      {/* ✅ NEW: Internships */}
      <div className="form-section">
        <div className="section-header">
          <h4>Internships</h4>
          <button className="btn-add" onClick={onInternshipAdd}>
            + Add Internship
          </button>
        </div>
        {safeInternships.map((intern, index) => (
          <div key={index} className="form-item">
            <input
              type="text"
              placeholder="Company"
              value={intern.company || ""}
              onChange={(e) => onInternshipChange(index, 'company', e.target.value)}
            />
            <input
              type="text"
              placeholder="Position"
              value={intern.position || ""}
              onChange={(e) => onInternshipChange(index, 'position', e.target.value)}
            />
            <div className="form-row">
              <input
                type="text"
                placeholder="Start Date"
                value={intern.startDate || ""}
                onChange={(e) => onInternshipChange(index, 'startDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="End Date"
                value={intern.endDate || ""}
                onChange={(e) => onInternshipChange(index, 'endDate', e.target.value)}
              />
            </div>
            <textarea
              placeholder="Description & Learnings"
              value={intern.description || ""}
              onChange={(e) => onInternshipChange(index, 'description', e.target.value)}
              rows="3"
            />
            <button 
              className="btn-remove"
              onClick={() => onInternshipRemove(index)}
            >
              Remove
            </button>
          </div>
        ))}
        {safeInternships.length === 0 && (
          <p className="optional-note">Add your internship experiences here.</p>
        )}
      </div>

      {/* Education */}
      <div className="form-section">
        <div className="section-header">
          <h4>Education</h4>
          <button className="btn-add" onClick={onAddEducation}>
            + Add Education
          </button>
        </div>
        {data.education.map((edu, index) => (
          <div key={index} className="form-item">
            <input
              type="text"
              placeholder="Degree"
              value={edu.degree || ""}
              onChange={(e) => onEducationChange(index, 'degree', e.target.value)}
            />
            <input
              type="text"
              placeholder="Institution"
              value={edu.institution || ""}
              onChange={(e) => onEducationChange(index, 'institution', e.target.value)}
            />
            <input
              type="text"
              placeholder="Year"
              value={edu.year || ""}
              onChange={(e) => onEducationChange(index, 'year', e.target.value)}
            />
            <input
              type="text"
              placeholder="Score/Grade"
              value={edu.score || ""}
              onChange={(e) => onEducationChange(index, 'score', e.target.value)}
            />
            <textarea
              placeholder="Details"
              value={edu.details || ""}
              onChange={(e) => onEducationChange(index, 'details', e.target.value)}
              rows="2"
            />
            <button 
              className="btn-remove"
              onClick={() => onRemoveEducation(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* ✅ NEW: Extra Curricular Activities */}
      <div className="form-section">
        <div className="section-header">
          <h4>Extra Curricular Activities</h4>
          <button className="btn-add" onClick={onExtracurricularAdd}>
            + Add Activity
          </button>
        </div>
        {safeExtracurriculars.map((activity, index) => (
          <div key={index} className="form-item">
            <input
              type="text"
              placeholder="Role/Position"
              value={activity.role || ""}
              onChange={(e) => onExtracurricularChange(index, 'role', e.target.value)}
            />
            <input
              type="text"
              placeholder="Organization"
              value={activity.organization || ""}
              onChange={(e) => onExtracurricularChange(index, 'organization', e.target.value)}
            />
            <div className="form-row">
              <input
                type="text"
                placeholder="Start Date"
                value={activity.startDate || ""}
                onChange={(e) => onExtracurricularChange(index, 'startDate', e.target.value)}
              />
              <input
                type="text"
                placeholder="End Date"
                value={activity.endDate || ""}
                onChange={(e) => onExtracurricularChange(index, 'endDate', e.target.value)}
              />
            </div>
            <textarea
              placeholder="Description & Responsibilities"
              value={activity.description || ""}
              onChange={(e) => onExtracurricularChange(index, 'description', e.target.value)}
              rows="3"
            />
            <button 
              className="btn-remove"
              onClick={() => onExtracurricularRemove(index)}
            >
              Remove
            </button>
          </div>
        ))}
        {safeExtracurriculars.length === 0 && (
          <p className="optional-note">Add your club activities, volunteering, sports, etc.</p>
        )}
      </div>

      {/* Skills with Recommendations */}
      <div className="form-section">
        <h4>Skills</h4>
        
        {/* ✅ NEW: Skill Recommendations */}
        {skillRecommendations.length > 0 && (
          <div className="skill-recommendations">
            <p className="recommendations-title">💡 Recommended Skills:</p>
            <div className="recommendations-list">
              {skillRecommendations.map((skill, index) => (
                <button
                  key={index}
                  className="recommendation-tag"
                  onClick={() => onSkillRecommendationClick(skill)}
                >
                  {skill} +
                </button>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSkillSubmit} className="add-item-form">
          <input
            type="text"
            placeholder="Add skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        <div className="items-list">
          {safeSkills.map((skill, index) => (
            <div key={index} className="item-tag">
              {skill}
              <button onClick={() => onSkillRemove(skill)}>×</button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ NEW: Languages */}
      <div className="form-section">
        <div className="section-header">
          <h4>Languages</h4>
          <button className="btn-add" onClick={onLanguageAdd}>
            + Add Language
          </button>
        </div>
        {safeLanguages.map((lang, index) => (
          <div key={index} className="form-item">
            <input
              type="text"
              placeholder="Language"
              value={lang.language || ""}
              onChange={(e) => onLanguageChange(index, 'language', e.target.value)}
            />
            <select
              value={lang.proficiency || "Intermediate"}
              onChange={(e) => onLanguageChange(index, 'proficiency', e.target.value)}
            >
              <option value="Native">Native</option>
              <option value="Fluent">Fluent</option>
              <option value="Advanced">Advanced</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Basic">Basic</option>
            </select>
            <button 
              className="btn-remove"
              onClick={() => onLanguageRemove(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="form-section">
        <div className="section-header">
          <h4>Projects</h4>
          <button className="btn-add" onClick={onProjectAdd}>
            + Add Project
          </button>
        </div>
        {data.projects.map((project, index) => (
          <div key={index} className="form-item">
            <input
              type="text"
              placeholder="Project Title"
              value={project.title || ""}
              onChange={(e) => onProjectChange(index, 'title', e.target.value)}
            />
            <textarea
              placeholder="Project Description"
              value={project.description || ""}
              onChange={(e) => onProjectChange(index, 'description', e.target.value)}
              rows="3"
            />
            <button 
              className="btn-remove"
              onClick={() => onProjectRemove(index)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="form-section">
        <h4>Certifications</h4>
        <form onSubmit={handleCertificationSubmit} className="add-item-form">
          <input
            type="text"
            placeholder="Add certification"
            value={newCertification}
            onChange={(e) => setNewCertification(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        <div className="items-list">
          {safeCertifications.map((cert, index) => (
            <div key={index} className="item-tag">
              {cert}
              <button onClick={() => onCertificationRemove(cert)}>×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="form-section">
        <h4>Achievements</h4>
        <form onSubmit={handleAchievementSubmit} className="add-item-form">
          <input
            type="text"
            placeholder="Add achievement"
            value={newAchievement}
            onChange={(e) => setNewAchievement(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        <div className="items-list">
          {safeAchievements.map((achievement, index) => (
            <div key={index} className="item-tag">
              {achievement}
              <button onClick={() => onAchievementRemove(achievement)}>×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Clear All Button */}
      <div className="form-section">
        <button className="btn-clear" onClick={onClearAll}>
          Clear All Data
        </button>
      </div>
    </div>
  );
};

export default EditorPage;
