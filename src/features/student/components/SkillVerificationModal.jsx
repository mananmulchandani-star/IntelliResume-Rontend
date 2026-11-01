// src/features/student/components/SkillVerificationModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { verificationService } from '../../../services/api';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import Spinner from '../../../components/ui/Spinner';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export default function SkillVerificationModal({
  isOpen,
  onClose,
  skillToVerify,
  availableSkills = [],
  jobTitle = 'Software Engineer',
  onVerificationComplete,
}) {
  const { user } = useAuth();
  // REQUIREMENT 5: User identification using user.id || user.email instead of fullName
  const userIdentifier = user?.id || user?.email || 'student_guest';

  // Skills queue
  const skillsToProcess = skillToVerify
    ? [skillToVerify]
    : availableSkills.length > 0
    ? availableSkills
    : ['React', 'JavaScript', 'Python'];

  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const currentSkill = skillsToProcess[currentSkillIndex] || '';

  const [questionData, setQuestionData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null); // { isCorrect, explanation, correctAnswer }
  const [timeLeft, setTimeLeft] = useState(50);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [, setStatusCheck] = useState(null);
  const [completedSkills, setCompletedSkills] = useState({}); // { [skill]: true/false }
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef(null);

  // Initialize or reset when modal opens or skill changes
  useEffect(() => {
    if (isOpen && currentSkill) {
      checkStatusAndLoadQuestion();
    } else {
      resetState();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, currentSkillIndex, currentSkill]);

  const resetState = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setQuestionData(null);
    setSelectedOption(null);
    setVerificationResult(null);
    setTimeLeft(50);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(50);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    if (!verificationResult) {
      setVerificationResult({
        isCorrect: false,
        explanation: 'Time expired for this question. InsightResume verification requires timely responses.',
        correctAnswer: questionData?.correct_answer || 'A',
      });
      setCompletedSkills((prev) => ({ ...prev, [currentSkill]: false }));
    }
  };

  const checkStatusAndLoadQuestion = async () => {
    setLoadingQuestion(true);
    resetState();

    try {
      // 1. Check status with backend
      let canAttempt = true;
      try {
        const statusRes = await verificationService.checkStatus(userIdentifier);
        setStatusCheck(statusRes);
        if (statusRes && statusRes.can_attempt === false) {
          canAttempt = false;
        }
      } catch (err) {
        console.warn('Skill verification checkStatus fallback active:', err);
      }

      if (!canAttempt) {
        setLoadingQuestion(false);
        return;
      }

      // 2. Fetch AI Generated Question for this skill
      try {
        const questionRes = await verificationService.generateQuestion(currentSkill, jobTitle);
        if (questionRes && (questionRes.question || questionRes.options)) {
          const q = questionRes.question?.question ? questionRes.question : questionRes;
          setQuestionData({
            question: q.question || `What core problem does ${currentSkill} solve in modern software architecture?`,
            options: q.options || {
              A: `It provides standard patterns for scalable ${currentSkill} workflows.`,
              B: 'It acts solely as a static file compression engine.',
              C: 'It replaces underlying operating system networking drivers.',
              D: 'It is exclusively used for hardware BIOS updates.',
            },
            correct_answer: q.correct_answer || 'A',
            explanation: q.explanation || `${currentSkill} is an industry standard used to develop reliable, high-performance applications.`,
          });
          startTimer();
        } else {
          throw new Error('Invalid question response format');
        }
      } catch (genErr) {
        console.warn('Using intelligent fallback question for skill:', currentSkill, genErr);
        setQuestionData({
          question: `In modern software development, what is the primary architectural purpose of ${currentSkill}?`,
          options: {
            A: `To structure and optimize modular components and logic related to ${currentSkill}.`,
            B: 'To function solely as a network firewall bypass.',
            C: 'To recompile CPU microcode instructions.',
            D: 'To encrypt plain disk sectors without algorithmic keys.',
          },
          correct_answer: 'A',
          explanation: `${currentSkill} is deployed in production environments to build maintainable, performant, and scalable applications.`,
        });
        startTimer();
      }
    } catch (error) {
      console.error('Error during verification load:', error);
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleSelectOption = (optKey) => {
    if (verificationResult || isSubmitting) return;
    setSelectedOption(optKey);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption || !questionData || verificationResult || isSubmitting) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsSubmitting(true);

    try {
      let isCorrect = false;
      let explanation = questionData.explanation;

      try {
        const verifyRes = await verificationService.verifyAnswer({
          question: questionData,
          selectedAnswer: selectedOption,
          skill: currentSkill,
          level: 'intermediate',
          userIdentifier: userIdentifier,
          timeRemaining: timeLeft,
        });

        if (verifyRes?.success && verifyRes.result) {
          isCorrect = Boolean(verifyRes.result.is_correct);
          explanation = verifyRes.result.explanation || questionData.explanation;
        } else {
          isCorrect = selectedOption.toUpperCase() === String(questionData.correct_answer).toUpperCase();
        }
      } catch (apiErr) {
        console.warn('Backend verify answer fallback used:', apiErr);
        isCorrect = selectedOption.toUpperCase() === String(questionData.correct_answer).toUpperCase();
      }

      const resultPayload = {
        isCorrect,
        explanation,
        correctAnswer: questionData.correct_answer,
      };

      setVerificationResult(resultPayload);
      setCompletedSkills((prev) => {
        const updated = { ...prev, [currentSkill]: isCorrect };
        return updated;
      });
    } catch (error) {
      console.error('Verification submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextSkill = () => {
    if (currentSkillIndex + 1 < skillsToProcess.length) {
      setCurrentSkillIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
      const passedSkills = Object.entries(completedSkills)
        .filter(([, passed]) => passed)
        .map(([skill]) => skill);

      // Save to localStorage
      try {
        const existing = JSON.parse(localStorage.getItem('verifiedSkills') || '[]');
        const merged = Array.from(new Set([...existing, ...passedSkills]));
        localStorage.setItem('verifiedSkills', JSON.stringify(merged));
      } catch (err) {
        console.error('Error saving verified skills:', err);
      }

      onVerificationComplete?.(passedSkills);
    }
  };

  const handleDone = () => {
    const passedSkills = Object.entries(completedSkills)
      .filter(([, passed]) => passed)
      .map(([skill]) => skill);

    try {
      const existing = JSON.parse(localStorage.getItem('verifiedSkills') || '[]');
      const merged = Array.from(new Set([...existing, ...passedSkills]));
      localStorage.setItem('verifiedSkills', JSON.stringify(merged));
    } catch (err) {
      console.error('Error saving verified skills:', err);
    }

    onVerificationComplete?.(passedSkills);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" closeOnOverlayClick={false}>
      <ModalHeader onClose={onClose} showCloseButton={true}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 leading-tight">
              InsightResume Skill Certification
            </h3>
            <p className="text-xs text-neutral-500">
              Verify competencies with real-time AI technical challenges
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="p-6">
        {loadingQuestion ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-sm font-medium text-neutral-700">
              Generating verification challenge for <strong className="text-primary-600">{currentSkill}</strong>...
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Synthesizing domain question & options
            </p>
          </div>
        ) : isFinished ? (
          /* Finished summary */
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-neutral-900">
                Verification Assessment Complete!
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Your verified skill credentials have been updated and linked to your resumes.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-lg bg-neutral-50 border border-neutral-200 text-left space-y-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                Assessment Results
              </span>
              {Object.entries(completedSkills).map(([sk, passed]) => (
                <div key={sk} className="flex items-center justify-between py-1 border-b border-neutral-100 last:border-none text-xs">
                  <span className="font-medium text-neutral-800">{sk}</span>
                  {passed ? (
                    <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="error" size="sm" icon={<XCircle className="w-3 h-3" />}>
                      Not Verified
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : questionData ? (
          /* Active Question View */
          <div className="space-y-5">
            {/* Top Bar: Current Skill & Timer */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500">Skill {currentSkillIndex + 1} of {skillsToProcess.length}:</span>
                <span className="font-bold text-sm text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded">
                  {currentSkill}
                </span>
              </div>

              <div
                className={`flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-md transition-colors ${
                  timeLeft <= 10
                    ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-pulse'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s remaining</span>
              </div>
            </div>

            {/* Question Prompt */}
            <div>
              <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wider block mb-1">
                Technical Challenge
              </span>
              <h4 className="text-sm font-semibold text-neutral-900 leading-relaxed">
                {questionData.question}
              </h4>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {Object.entries(questionData.options || {}).map(([key, optionText]) => {
                const isSelected = selectedOption === key;
                const isCorrect = verificationResult && key.toUpperCase() === String(verificationResult.correctAnswer).toUpperCase();
                const isWrongSelection = verificationResult && isSelected && !verificationResult.isCorrect;

                let btnStyles = 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800';

                if (isSelected && !verificationResult) {
                  btnStyles = 'border-primary-500 bg-primary-50/40 text-primary-900 ring-2 ring-primary-500/20';
                } else if (isCorrect) {
                  btnStyles = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20';
                } else if (isWrongSelection) {
                  btnStyles = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500/20';
                }

                return (
                  <button
                    key={key}
                    type="button"
                    disabled={Boolean(verificationResult) || isSubmitting}
                    onClick={() => handleSelectOption(key)}
                    className={`w-full flex items-start gap-3 p-3 text-left rounded-lg border transition-all text-xs cursor-pointer disabled:cursor-default ${btnStyles}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-primary-600 text-white border-primary-600'
                          : isCorrect
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : isWrongSelection
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                      }`}
                    >
                      {key}
                    </span>
                    <span className="leading-relaxed mt-0.5">{optionText}</span>
                  </button>
                );
              })}
            </div>

            {/* Verification Result Feedback */}
            {verificationResult && (
              <div
                className={`p-4 rounded-lg border text-xs leading-relaxed space-y-1.5 animate-in fade-in-50 ${
                  verificationResult.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {verificationResult.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Skill Verified Successfully!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>Verification Unsuccessful</span>
                    </>
                  )}
                </div>
                {verificationResult.explanation && (
                  <p className="text-[11px] opacity-90">
                    <strong>Explanation:</strong> {verificationResult.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-neutral-500">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            Unable to load question. Please try again.
          </div>
        )}
      </ModalBody>

      <ModalFooter className="flex justify-between items-center">
        {isFinished ? (
          <Button variant="primary" fullWidth onClick={handleDone}>
            Complete & Apply to Resume
          </Button>
        ) : verificationResult ? (
          <div className="flex justify-between items-center w-full">
            <span className="text-xs text-neutral-500">
              {currentSkillIndex + 1 < skillsToProcess.length
                ? `${skillsToProcess.length - (currentSkillIndex + 1)} more skills queued`
                : 'Final skill assessed'}
            </span>
            <Button
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleNextSkill}
            >
              {currentSkillIndex + 1 < skillsToProcess.length ? 'Next Skill' : 'Finish Certification'}
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center w-full">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!selectedOption || isSubmitting}
              isLoading={isSubmitting}
              onClick={handleSubmitAnswer}
            >
              Submit Answer
            </Button>
          </div>
        )}
      </ModalFooter>
    </Modal>
  );
}
