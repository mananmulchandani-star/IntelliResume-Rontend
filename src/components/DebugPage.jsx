import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DebugPage = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAIPrompt = async () => {
    setLoading(true);
    setError('');
    setAiResponse(null);

    try {
      // Test with generic, clean data
      const testData = {
        prompt: prompt,
        fullName: "Test User",
        email: "test@example.com", 
        phone: "+1234567890",
        location: "City, Country",
        stream: "Computer Science",
        specificField: "Software Development",
        youAre: "Student",
        experienceLevel: "No Experience",
        targetRole: "Software Developer",
        keySkills: "Programming, Problem Solving, Teamwork"
      };

      console.log('🚀 Sending to AI:', testData);

      const response = await fetch('http://localhost:5000/api/generate-resume-from-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      const responseData = await response.json();
      console.log('📨 AI Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || `HTTP error! status: ${response.status}`);
      }

      if (!responseData.resumeData) {
        throw new Error('No resume data received from AI');
      }

      setAiResponse(responseData.resumeData);

      // Test localStorage with clean data
      localStorage.setItem('debugResume', JSON.stringify(responseData.resumeData));
      localStorage.setItem('debugFormData', JSON.stringify(testData));
      
      console.log('✅ Saved to localStorage for testing');

    } catch (err) {
      console.error('❌ AI Test Error:', err);
      setError(`AI Test Failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testWithEditor = () => {
    if (aiResponse) {
      localStorage.setItem('currentResume', JSON.stringify(aiResponse));
      localStorage.setItem('resumeFormData', JSON.stringify({
        fullName: "Test User",
        email: "test@example.com",
        phone: "+1234567890",
        location: "City, Country",
        stream: "Computer Science",
        specificField: "Software Development",
        youAre: "Student", 
        experienceLevel: "No Experience",
        targetRole: "Software Developer",
        keySkills: "Programming, Problem Solving"
      }));
      
      console.log('✅ Data loaded into Editor format');
      navigate('/editor');
    }
  };

  const loadSampleData = () => {
    setPrompt("Computer science student with projects in web development and programming. Seeking internship opportunities to apply technical skills and learn from industry professionals.");
  };

  const clearAllData = () => {
    localStorage.removeItem('debugResume');
    localStorage.removeItem('debugFormData');
    localStorage.removeItem('currentResume');
    localStorage.removeItem('resumeFormData');
    setAiResponse(null);
    setPrompt('');
    setError('');
    console.log('✅ All test data cleared');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🧪 AI Debug Page</h1>
      <p>Test if AI is returning proper data before checking Editor</p>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => navigate('/create-resume')} style={{ 
          padding: '8px 16px', 
          backgroundColor: '#6c757d', 
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          ← Back to Create Resume
        </button>
        
        <button onClick={clearAllData} style={{ 
          padding: '8px 16px', 
          backgroundColor: '#dc3545', 
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          🗑️ Clear All Data
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={loadSampleData} style={{ 
          marginRight: '10px',
          padding: '8px 16px',
          backgroundColor: '#17a2b8',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Load Sample Prompt
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Prompt:</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your education and background information here..."
          rows="6"
          style={{ width: '100%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <button 
        onClick={testAIPrompt} 
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px', 
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing AI...' : 'Test AI Response'}
      </button>

      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {aiResponse && (
        <div style={{ marginTop: '30px' }}>
          <h3>✅ AI Response Received:</h3>
          
          <div style={{ 
            backgroundColor: '#d4edda', 
            padding: '15px', 
            borderRadius: '4px',
            marginBottom: '20px'
          }}>
            <strong>Success! AI returned data. Check structure below:</strong>
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
            <button onClick={testWithEditor} style={{ 
              padding: '10px 20px', 
              backgroundColor: '#28a745', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
              Load This Data in Editor
            </button>
          </div>

          <h4>Raw AI Response:</h4>
          <pre style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            maxHeight: '400px'
          }}>
            {JSON.stringify(aiResponse, null, 2)}
          </pre>

          <h4>Key Fields Check:</h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div><strong>fullName:</strong> {aiResponse.fullName || '❌ MISSING'}</div>
            <div><strong>email:</strong> {aiResponse.email || '❌ MISSING'}</div>
            <div><strong>phone:</strong> {aiResponse.phone || '❌ MISSING'}</div>
            <div><strong>location:</strong> {aiResponse.location || '❌ MISSING'}</div>
            <div><strong>jobTitle:</strong> {aiResponse.jobTitle || '❌ MISSING'}</div>
            <div><strong>summary:</strong> {aiResponse.summary ? '✅ PRESENT' : '❌ MISSING'}</div>
            <div><strong>education:</strong> {aiResponse.education ? `✅ ${aiResponse.education.length} items` : '❌ MISSING'}</div>
            <div><strong>skills:</strong> {aiResponse.skills ? `✅ ${aiResponse.skills.length} items` : '❌ MISSING'}</div>
            <div><strong>projects:</strong> {aiResponse.projects ? `✅ ${aiResponse.projects.length} items` : '❌ MISSING'}</div>
            <div><strong>workExperience:</strong> {aiResponse.workExperience ? `✅ ${aiResponse.workExperience.length} items` : '❌ MISSING'}</div>
          </div>

          {aiResponse.education && (
            <div>
              <h4>Education Details:</h4>
              {aiResponse.education.map((edu, index) => (
                <div key={index} style={{ 
                  border: '1px solid #ddd', 
                  padding: '10px', 
                  marginBottom: '10px',
                  borderRadius: '4px'
                }}>
                  <div><strong>Degree:</strong> {edu.degree || '❌ MISSING'}</div>
                  <div><strong>School:</strong> {edu.school || edu.institution || '❌ MISSING'}</div>
                  <div><strong>Year:</strong> {edu.year || '❌ MISSING'}</div>
                  <div><strong>Score:</strong> {edu.score || 'Not specified'}</div>
                </div>
              ))}
            </div>
          )}

          {aiResponse.skills && (
            <div>
              <h4>Skills List:</h4>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                {aiResponse.skills.map((skill, index) => (
                  <span key={index} style={{
                    backgroundColor: '#e9ecef',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <h4>🔍 Debug Instructions:</h4>
        <ol>
          <li>Enter your prompt or click "Load Sample Prompt"</li>
          <li>Click "Test AI Response" to see if backend works</li>
          <li>If green success appears, AI is working correctly</li>
          <li>If red error appears, problem is in backend/AI</li>
          <li>If AI works but Editor doesn't, problem is in frontend data handling</li>
          <li>Use "Clear All Data" to reset everything</li>
          <li>Check browser Console (F12) for detailed logs</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugPage;