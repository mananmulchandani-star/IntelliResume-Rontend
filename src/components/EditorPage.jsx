import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getBackendUrl } from '../config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AdBanner from './AdBanner';
import './EditorPage.css';




//  FIXED: Enhanced Skill Verification Popup Component with proper question flow
const SkillVerificationPopup = ({ 
  skills, 
  onComplete, 
  onClose, 
  resumeData 
}) => {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [attemptedSkills, setAttemptedSkills] = useState([]);
  const [timeoutOccurred, setTimeoutOccurred] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [showProceedButton, setShowProceedButton] = useState(false);
  const timerRef = useRef(null);

  const currentSkill = skills[currentSkillIndex];

  //  FIXED: Enhanced Timer effect with proper cleanup
  useEffect(() => {
    if (!currentQuestion || showResults || timeoutOccurred || isAnswerSubmitted || showProceedButton) return;
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimeLeft(50); // Reset timer for new question
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestion, showResults, timeoutOccurred, isAnswerSubmitted, showProceedButton]);

  // Check verification status on component mount
  useEffect(() => {
    checkVerificationStatus();
  }, []);

  // Load question for current skill
  useEffect(() => {
    if (currentSkill && !showResults && verificationStatus?.can_attempt && !timeoutOccurred) {
      loadQuestionForSkill(currentSkill);
    }
  }, [currentSkill, showResults, verificationStatus, timeoutOccurred]);

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
    setTimeoutOccurred(false);
    setShowProceedButton(false);
    setIsAnswerSubmitted(false);
    
    try {
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
        setTimeLeft(50); // Reset to 50 seconds
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

  //  FIXED: Enhanced handleAnswerSelect with proper state management
  const handleAnswerSelect = async (answer) => {
    if (!currentQuestion || timeoutOccurred || isAnswerSubmitted) return;

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Mark that answer is being submitted
    setIsAnswerSubmitted(true);
    
    // Mark skill as attempted
    if (!attemptedSkills.includes(currentSkill)) {
      setAttemptedSkills(prev => [...prev, currentSkill]);
    }

    // Verify answer with backend
    try {
      const userIdentifier = resumeData.personalInfo.fullName || 'default_user';
      
      const response = await fetch(`${getBackendUrl()}/api/verify-skill-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: currentQuestion,
          selectedAnswer: answer,
          skill: currentSkill,
          level: 'intermediate',
          userIdentifier: userIdentifier,
          timeRemaining: timeLeft
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.success) {
          // Store result
          setResults(prev => ({
            ...prev,
            [currentSkill]: result.result.is_correct
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

          // Show proceed button after delay
          setTimeout(() => {
            setShowProceedButton(true);
          }, 1000);
        } else {
          console.error('Backend verification failed:', result.error);
          // Handle backend error
          setResults(prev => ({
            ...prev,
            [currentSkill]: false
          }));
          
          setTimeout(() => {
            setShowProceedButton(true);
          }, 1000);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('HTTP error:', response.status, errorData);
        if (errorData.error) {
            alert(`Backend notice: ${errorData.error}`);
        } else {
            alert(`HTTP error: ${response.status}`);
        }
        
        // Handle HTTP error
        setResults(prev => ({
          ...prev,
          [currentSkill]: false
        }));
        
        setTimeout(() => {
          setShowProceedButton(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error verifying answer:', error);
      // Handle network error
      setResults(prev => ({
        ...prev,
        [currentSkill]: false
      }));
      
      setTimeout(() => {
        setShowProceedButton(true);
      }, 1000);
    }
  };

  //  FIXED: Enhanced handleTimeUp to show proceed button
  const handleTimeUp = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Mark skill as not attempted
    if (!attemptedSkills.includes(currentSkill)) {
      setAttemptedSkills(prev => [...prev, currentSkill]);
      setResults(prev => ({
        ...prev,
        [currentSkill]: 'not_attempted'
      }));
    }

    // Set timeout flag and show proceed button
    setTimeoutOccurred(true);
    setShowProceedButton(true);
    
    console.log(`Time's up for ${currentSkill}!`);
  };

  //  FIXED: Enhanced handleProceedToNext to properly move to next skill
  const handleProceedToNext = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Reset flags
    setTimeoutOccurred(false);
    setIsAnswerSubmitted(false);
    setShowProceedButton(false);
    
    // Move to next skill or show results
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
    const passed = score >= 67;
    
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
        return ' Verification Passed';
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
            <div className="lock-icon"></div>
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
              <h3>{passed ? ' Verification Passed!' : ' Verification Failed'}</h3>
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
                      {status === 'correct' && ' Verified'}
                      {status === 'incorrect' && ' Incorrect'}
                      {status === 'not_attempted' && ' Not Attempted (0 marks)'}
                      {status === 'pending' && ' Pending'}
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
                   Continue to Download
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
          <button className="close-btn" onClick={onClose}>×</button>
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
              <p className="timer-note">50 seconds per question</p>
              {timeLeft <= 10 && (
                <p className="timer-warning"> Hurry up! Time is running out</p>
              )}
            </div>

            <div className="question-content">
              <h3>{currentQuestion.question}</h3>
              
              {/* Show answer options or timeout message */}
              {timeoutOccurred ? (
                <div className="timeout-message">
                  <div className="timeout-alert">
                    <h4> Time's Up!</h4>
                    <p>This question has been marked as <strong>"Not Attempted"</strong> and will receive <strong>0 marks</strong>.</p>
                  </div>
                </div>
              ) : (
                <div className="options-grid">
                  {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <button
                      key={key}
                      className={`option-btn ${isAnswerSubmitted ? 'disabled' : ''}`}
                      onClick={() => handleAnswerSelect(key)}
                      disabled={isAnswerSubmitted || showProceedButton}
                    >
                      <span className="option-key">{key}</span>
                      <span className="option-text">{value}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Show feedback after answering */}
              {isAnswerSubmitted && (
                <div className="answer-feedback">
                  <p className="feedback-text">
                    {results[currentSkill] === true ? ' Correct!' : ' Incorrect!'}
                  </p>
                  {currentQuestion.explanation && (
                    <p className="explanation-text">
                      <strong>Explanation:</strong> {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Show time warning */}
              {!timeoutOccurred && !isAnswerSubmitted && (
                <div className="time-warning">
                  <p> If time runs out without answering, this question will be marked as "Not Attempted" and will receive 0 marks.</p>
                </div>
              )}
            </div>

            {/*  FIXED: Show proceed button after answering or timeout */}
            {(showProceedButton || timeoutOccurred || isAnswerSubmitted) && (
              <div className="proceed-section">
                <button 
                  className="proceed-btn"
                  onClick={handleProceedToNext}
                >
                  {currentSkillIndex < skills.length - 1 ? 'Next Question →' : 'View Results →'}
                </button>
                <p className="proceed-note">
                  Click to continue to {currentSkillIndex < skills.length - 1 ? 'the next question' : 'see your results'}
                </p>
              </div>
            )}
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
  
  // Default resume structure
  const defaultResumeData = {
    personalInfo: {
      fullName: 'Your Name',
      jobTitle: 'Professional Title',
      email: 'your.email@example.com',
      phone: '+1 234 567 8900',
      location: 'Your City, Country',
      dateOfBirth: '',
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
  
  // Download Tracking States
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadSuccessTimestamp, setDownloadSuccessTimestamp] = useState(null);

  // Mobile layout state
  const [mobileTab, setMobileTab] = useState('edit');

  // Timer to hide download success ad after 2 minutes
  useEffect(() => {
    if (downloadSuccess && downloadSuccessTimestamp) {
      const timer = setTimeout(() => {
        if (Date.now() - downloadSuccessTimestamp > 120000) { // 2 minutes
          setDownloadSuccess(false);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [downloadSuccess, downloadSuccessTimestamp]);

  //  FIXED: Enhanced data loading
  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true);

        // Check for AI-generated data from navigation state
        if (location.state?.resumeData) {
          const aiData = location.state.resumeData;
          const formData = location.state.formData || {};
          const transformedData = transformAIDataToEditorFormat(aiData, formData);
          setResumeData(transformedData);
          setIsFromAI(true);
          setIsLoading(false);
          return;
        }

        // Check localStorage for saved AI data
        const savedResume = localStorage.getItem('currentResume');
        const savedFormData = localStorage.getItem('resumeFormData');
        
        if (savedResume) {
          try {
            const aiData = JSON.parse(savedResume);
            const formData = savedFormData ? JSON.parse(savedFormData) : {};
            const transformedData = transformAIDataToEditorFormat(aiData, formData);
            setResumeData(transformedData);
            setIsFromAI(true);
          } catch (error) {
            console.error('Error parsing saved data:', error);
            setResumeData(defaultResumeData);
          }
        } 
        // Check for manually saved resume data
        else if (localStorage.getItem('resumeData')) {
          try {
            const savedData = JSON.parse(localStorage.getItem('resumeData'));
            setResumeData(savedData);
            setIsFromAI(false);
          } catch (error) {
            console.error('Error parsing saved resume data:', error);
            setResumeData(defaultResumeData);
          }
        }
        else {
          setResumeData(defaultResumeData);
        }

      } catch (error) {
        console.error(' Error loading data:', error);
        setResumeData(defaultResumeData);
      } finally {
        setIsLoading(false);
      }
    };

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

  // Professional Title Generator
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

  // Enhanced skill recommendations
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

  // Update skill recommendations when data changes
  useEffect(() => {
    const recommendations = getSkillRecommendations();
    setSkillRecommendations(recommendations);
  }, [resumeData.personalInfo.jobTitle, resumeData.skills]);

  // Transform AI data to editor format
  const transformAIDataToEditorFormat = (aiData, formData = {}) => {
    return {
      personalInfo: {
        fullName: aiData.fullName || formData.fullName || 'Your Name',
        jobTitle: aiData.jobTitle || formData.targetRole || 'Professional',
        email: aiData.email || formData.email || 'your.email@example.com',
        phone: aiData.phone || formData.phone || '+1 234 567 8900',
        location: aiData.location || formData.location || 'Your Location',
        dateOfBirth: aiData.dateOfBirth || formData.dateOfBirth || '',
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

  // PDF Generation Function
  const generateAndDownloadPDF = async () => {
    try {
      const element = resumeRef.current;
      if (!element) {
        console.error('Resume element not found');
        return;
      }
      
      const A4_WIDTH = 794;
      const A4_HEIGHT = 1123;
      
      element.classList.add('pdf-export', 'pdf-optimized');
      
      const clonedElement = element.cloneNode(true);
      clonedElement.style.width = `${A4_WIDTH}px`;
      clonedElement.style.height = 'auto';
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      clonedElement.classList.add('pdf-export', 'pdf-optimized');
      document.body.appendChild(clonedElement);

      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        width: A4_WIDTH,
        height: clonedElement.scrollHeight,
        windowWidth: A4_WIDTH,
        windowHeight: clonedElement.scrollHeight,
        onclone: (clonedDoc, element) => {
          const style = clonedDoc.createElement('style');
          style.textContent = `
            .pdf-export {
              width: ${A4_WIDTH}px !important;
              min-height: ${A4_HEIGHT}px !important;
              background: white !important;
              margin: 0 !important;
              padding: 40px !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              position: relative !important;
            }
            .pdf-export * {
              box-sizing: border-box !important;
              max-width: 100% !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            .pdf-export .a4-page {
              width: ${A4_WIDTH}px !important;
              min-height: ${A4_HEIGHT}px !important;
              padding: 40px !important;
              margin: 0 !important;
              page-break-after: always !important;
              box-shadow: none !important;
            }
            .pdf-export .shadow, 
            .pdf-export .box-shadow {
              box-shadow: none !important;
            }
            .pdf-export img {
              max-width: 100% !important;
              height: auto !important;
            }
            .pdf-export .professional-template,
            .pdf-export .modern-template,
            .pdf-export .creative-template,
            .pdf-export .irm-template,
            .pdf-export .insight-twin-grid-template {
              width: 100% !important;
              min-height: ${A4_HEIGHT}px !important;
              padding: 40px !important;
              margin: 0 !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });

      document.body.removeChild(clonedElement);
      element.classList.remove('pdf-export', 'pdf-optimized');

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      
      pdf.save(`${resumeData.personalInfo.fullName.replace(/\s+/g, '_') || 'resume'}_${Date.now()}.pdf`);
      
      setSaveMessage(' PDF downloaded successfully!');
      setDownloadSuccess(true);
      setDownloadSuccessTimestamp(Date.now());
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSaveMessage(' Error generating PDF. Please try again.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  // Download without verification
  const handleDownloadWithoutVerification = async () => {
    try {
      await generateAndDownloadPDF();
      setSaveMessage('PDF downloaded successfully!');
      setDownloadSuccess(true);
      setDownloadSuccessTimestamp(Date.now());
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
    
    if (results.passed || results.result?.passed_verification) {
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

  // Internship handlers
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

  // Extra Curricular Activities handlers
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

  // Languages handlers
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
               AI-Generated Resume - Ready to Customize!
            </div>
          )}
          
          {/* Verification Status Badge */}
          {isVerificationComplete && verifiedSkills.length > 0 && (
            <div className="verification-badge">
               Skills Verified! {verifiedSkills.length} skills certified
            </div>
          )}
          
          {/* Attempt Status Badge */}
          {verificationStatus && !verificationStatus.can_attempt && (
            <div className="attempt-status-badge">
               {verificationStatus.message}
            </div>
          )}
          
          {saveMessage && <div className="save-message">{saveMessage}</div>}
          
          {/* AdSense Ad after Download Success */}
          {downloadSuccess && saveMessage.includes('downloaded successfully') && (
            <div className="download-success-ad">
              <AdBanner 
                adSlot="REPLACE_WITH_DOWNLOAD_SUCCESS_SLOT_ID"
                style={{ 
                  margin: '24px 0',
                  maxWidth: '728px',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              />
              <p className="ad-note">Advertisement</p>
            </div>
          )}
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
                 Download PDF (Without Verification)
              </button>
              <button 
                className={`dropdown-item ${isVerificationComplete ? 'verified' : ''}`}
                onClick={handleDownloadWithVerification}
              >
                {isVerificationComplete ? ' Download Verified PDF' : ' Download with Verification'}
              </button>
              <button 
                className="dropdown-item"
                onClick={handleSaveResume}
              >
                 Save Resume
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="editor-layout">
        {/* Left Sidebar - Template Selector */}
        <div className={`template-selector ${mobileTab !== 'templates' ? 'mobile-hidden' : ''}`}>
          <h3>Choose Template</h3>
          <div className="template-buttons">
            {[
              { id: 'professional', name: 'Professional' },
              { id: 'modern', name: 'Modern' },
              { id: 'creative', name: 'Creative' },
              { id: 'irm', name: 'IRM Special' },
              { id: 'twin-grid', name: 'INSIGHT TWIN-GRID' }
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

          {/* Professional Title Generator */}
          <div className="title-generator-section">
            <h4>Professional Title</h4>
            <button 
              className="btn-generate-title"
              onClick={generateProfessionalTitle}
            >
               Generate Professional Title
            </button>
            <p className="generator-note">
              Based on your education and skills
            </p>
          </div>

          {/* Enhanced Skill Verification Status */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="verification-status-section">
              <h4>Download Options</h4>
              
              {/* Quick Download Options */}
              <div className="quick-download-options">
                <button 
                  className="btn-download-quick"
                  onClick={handleDownloadWithoutVerification}
                >
                   Quick Download
                </button>
                
                {isVerificationComplete ? (
                  <button 
                    className="btn-download-verified"
                    onClick={handleDownloadWithVerification}
                  >
                     Download Verified
                  </button>
                ) : (
                  <button 
                    className="btn-download-verify"
                    onClick={handleDownloadWithVerification}
                  >
                     Verify & Download
                  </button>
                )}
              </div>

              {isVerificationComplete ? (
                <div className="verification-success">
                  <p> {verifiedSkills.length} skills verified</p>
                  <p>Ready for download!</p>
                </div>
              ) : verificationStatus && !verificationStatus.can_attempt ? (
                <div className="verification-locked">
                  <p> {verificationStatus.message}</p>
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
        <div className={`preview-panel ${mobileTab !== 'preview' ? 'mobile-hidden' : ''}`}>
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
              {resumeData.selectedTemplate === 'INSIGHT TWIN-GRID' && (
                <InsightTwinGridTemplate data={resumeData} verifiedSkills={verifiedSkills} />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Editing Controls */}
        <div className={`editing-panel ${mobileTab !== 'edit' ? 'mobile-hidden' : ''}`}>
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

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        <button 
          className={`mobile-nav-btn ${mobileTab === 'templates' ? 'active' : ''}`}
          onClick={() => setMobileTab('templates')}
        >
           Templates
        </button>
        <button 
          className={`mobile-nav-btn ${mobileTab === 'edit' ? 'active' : ''}`}
          onClick={() => setMobileTab('edit')}
        >
           Edit
        </button>
        <button 
          className={`mobile-nav-btn ${mobileTab === 'preview' ? 'active' : ''}`}
          onClick={() => setMobileTab('preview')}
        >
          ️ Preview
        </button>
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

// Professional Template Component
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
          <span> {personalInfo.phone || "Phone"}</span>
          <span> {personalInfo.email || "Email"}</span>
          <span> {personalInfo.location || "Location"}</span>
          {personalInfo.dateOfBirth && <span> {personalInfo.dateOfBirth}</span>}
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

      {/* Internships - ONLY SHOW IF EXISTS */}
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

      {/* Extra Curricular Activities - ONLY SHOW IF EXISTS */}
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
                  {verifiedSkills.includes(skill) && <span className="verified-badge"></span>}
                </span>
              ))}
            </div>
            {verifiedSkills.length > 0 && (
              <div className="verification-badge-footer">
                <small>Verified skills certified by InsightResume</small>
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

      {/* Languages - ONLY SHOW IF EXISTS */}
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

// Modern Template Component
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
          {personalInfo.dateOfBirth && <span> {personalInfo.dateOfBirth}</span>}
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

      {/* Internships - Conditionally rendered */}
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

      {/* Extra Curricular Activities - Conditionally rendered */}
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
                {verifiedSkills.includes(skill) && <span className="verified-badge"></span>}
              </span>
            ))}
          </div>
          {verifiedSkills.length > 0 && (
            <div className="verification-badge-footer">
              <small>Verified skills certified by InsightResume</small>
            </div>
          )}
        </div>
      )}

      {/* Languages - Conditionally rendered */}
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

// Creative Template Component
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
          <span> {personalInfo.email || "Email"}</span>
          <span> {personalInfo.phone || "Phone"}</span>
          <span> {personalInfo.location || "Location"}</span>
          {personalInfo.dateOfBirth && <span> {personalInfo.dateOfBirth}</span>}
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

      {/* Internships - Conditionally rendered */}
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

      {/* Extra Curricular Activities - Conditionally rendered */}
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
                {verifiedSkills.includes(skill) && <span className="verified-badge"></span>}
              </span>
            ))}
          </div>
          {verifiedSkills.length > 0 && (
            <div className="verification-badge-footer">
              <small>Verified skills certified by InsightResume</small>
            </div>
          )}
        </div>
      )}

      {/* Languages - Conditionally rendered */}
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

// IRM Special Template Component
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
            <span> {personalInfo.phone || "Phone"}</span>
            <span> {personalInfo.email || "Email"}</span>
            <span> {personalInfo.location || "Location"}</span>
            {personalInfo.dateOfBirth && <span> {personalInfo.dateOfBirth}</span>}
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

      {/* Internships - ONLY SHOW IF EXISTS */}
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

      {/* Extra Curricular Activities - ONLY SHOW IF EXISTS */}
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
                  {verifiedSkills.includes(skill) && <span className="verified-badge"></span>}
                </span>
              ))}
            </div>
            {verifiedSkills.length > 0 && (
              <div className="verification-badge-footer">
                <small>Verified skills certified by InsightResume</small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Languages - ONLY SHOW IF EXISTS */}
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

// INSIGHT TWIN-GRID Template Component
const InsightTwinGridTemplate = ({ data, verifiedSkills = [] }) => {
  const { personalInfo, education, skills, projects, workExperience, internships, extracurriculars, languages } = data;
  
  // Ensure all data is safe to render
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
    <div className="insight-twin-grid-template a4-document">
      {/* Top Header - Centered Name and Title */}
      <div className="twin-grid-header">
        <h1 className="twin-grid-name">{personalInfo.fullName || "Your Name"}</h1>
        <p className="twin-grid-title">{personalInfo.jobTitle || "Professional Title"}</p>
      </div>

      {/* Main Body - Two Column Layout */}
      <div className="twin-grid-body">
        {/* Left Column - One Third Width */}
        <div className="twin-grid-left">
          {/* CONTACT Section */}
          <div className="twin-grid-section">
            <h2 className="twin-grid-section-title">CONTACT</h2>
            <div className="twin-grid-section-content">
              <div className="contact-item">
                <span className="contact-icon"></span>
                <span className="contact-text">{personalInfo.phone || "Phone"}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon"></span>
                <span className="contact-text">{personalInfo.email || "Email"}</span>
              </div>
              <div className="contact-item">
                <span className="contact-icon"></span>
                <span className="contact-text">{personalInfo.location || "Location"}</span>
              </div>
              {personalInfo.dateOfBirth && (
                <div className="contact-item">
                  <span className="contact-icon"></span>
                  <span className="contact-text">{personalInfo.dateOfBirth}</span>
                </div>
              )}
            </div>
          </div>

          {/* SKILLS Section */}
          {safeSkills.length > 0 && (
            <div className="twin-grid-section">
              <h2 className="twin-grid-section-title">SKILLS</h2>
              <div className="twin-grid-section-content">
                <ul className="skills-list">
                  {safeSkills.map((skill, index) => (
                    <li key={index} className={`skill-item ${verifiedSkills.includes(skill) ? 'verified' : ''}`}>
                      {skill}
                      {verifiedSkills.includes(skill) && <span className="verified-badge"></span>}
                    </li>
                  ))}
                </ul>
                  {verifiedSkills.length > 0 && (
                    <div className="verification-badge-footer">
                      <small>Verified skills certified by InsightResume</small>
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* LANGUAGES Section */}
          {hasLanguages && (
            <div className="twin-grid-section">
              <h2 className="twin-grid-section-title">LANGUAGES</h2>
              <div className="twin-grid-section-content">
                <ul className="languages-list">
                  {safeLanguages.map((lang, index) => (
                    <li key={index} className="language-item">
                      <strong>{lang.language}</strong>: {lang.proficiency}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* EDUCATION Section */}
          <div className="twin-grid-section">
            <h2 className="twin-grid-section-title">EDUCATION</h2>
            <div className="twin-grid-section-content">
              {education && education.map((edu, index) => (
                <div key={index} className="education-item">
                  <div className="education-degree"><strong>{edu.degree || "Degree"}</strong></div>
                  <div className="education-institution">{edu.institution || "Institution"}</div>
                  <div className="education-year">{edu.year || "Year"}</div>
                  {edu.score && <div className="education-score">Score: {edu.score}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="twin-grid-divider"></div>

        {/* Right Column - Two Thirds Width */}
        <div className="twin-grid-right">
          {/* PROFILE Section */}
          <div className="twin-grid-section">
            <h2 className="twin-grid-section-title">PROFILE</h2>
            <div className="twin-grid-section-content">
              <p className="profile-text">{personalInfo.about || "Professional summary about your background, skills, and career objectives."}</p>
            </div>
          </div>

          {/* INTERNSHIP EXPERIENCE Section */}
          {(hasInternships || projects.length > 0) && (
            <div className="twin-grid-section">
              <h2 className="twin-grid-section-title">INTERNSHIP EXPERIENCE</h2>
              <div className="twin-grid-section-content">
                {/* Internships */}
                {hasInternships && safeInternships.map((intern, index) => (
                  <div key={index} className="experience-item">
                    <div className="experience-header">
                      <strong>{intern.position || "Position"}</strong>
                      <span className="experience-date">{intern.startDate || "Start"} - {intern.endDate || "End"}</span>
                    </div>
                    <div className="experience-company">{intern.company || "Company"}</div>
                    {intern.description && (
                      <ul className="experience-bullets">
                        <li>{intern.description}</li>
                      </ul>
                    )}
                  </div>
                ))}

                {/* Academic Projects */}
                {projects && projects.length > 0 && projects.map((project, index) => (
                  <div key={index} className="experience-item">
                    <div className="experience-header">
                      <strong>{project.title || "Project Title"} - Academic Project</strong>
                      <span className="experience-date">{project.date || "Date"}</span>
                    </div>
                    {project.description && (
                      <ul className="experience-bullets">
                        <li>{project.description}</li>
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CO- AND EXTRA CURRICULAR Section */}
          {hasExtracurriculars && (
            <div className="twin-grid-section">
              <h2 className="twin-grid-section-title">CO- AND EXTRA CURRICULAR</h2>
              <div className="twin-grid-section-content">
                <ul className="extracurricular-list">
                  {safeExtracurriculars.map((activity, index) => (
                    <li key={index} className="extracurricular-item">
                      {activity.description || `${activity.role} at ${activity.organization}`}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* WORK EXPERIENCE Section - Only if exists */}
          {hasWorkExperience && (
            <div className="twin-grid-section">
              <h2 className="twin-grid-section-title">WORK EXPERIENCE</h2>
              <div className="twin-grid-section-content">
                {safeWorkExperience.map((exp, index) => (
                  <div key={index} className="experience-item">
                    <div className="experience-header">
                      <strong>{exp.position || "Position"}</strong>
                      <span className="experience-date">{exp.startDate || "Start"} - {exp.endDate || "End"}</span>
                    </div>
                    <div className="experience-company">{exp.company || "Company"}</div>
                    {exp.description && (
                      <ul className="experience-bullets">
                        <li>{exp.description}</li>
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Resume Form Component for Editing
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

      {/* Internships */}
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

      {/* Extra Curricular Activities */}
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
        
        {/* Skill Recommendations */}
        {skillRecommendations.length > 0 && (
          <div className="skill-recommendations">
            <p className="recommendations-title"> Recommended Skills:</p>
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

      {/* Languages */}
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

      {/* ── AdSense Banner ── */}
      <div className="form-section">
        <AdBanner adSlot="5880009725" />
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
