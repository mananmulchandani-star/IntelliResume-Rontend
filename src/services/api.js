const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const analyzeResume = async (resumeText, jobDescription) => {
  const response = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      resume_text: resumeText,
      job_description: jobDescription
    }),
  });
  return response.json();
};

export const getATSScore = async (resumeText) => {
  const response = await fetch(`${API_BASE_URL}/api/ats-score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ resume_text: resumeText }),
  });
  return response.json();
};