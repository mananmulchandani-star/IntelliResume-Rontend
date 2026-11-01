// src/services/api.js
// Centralized API client for all backend calls
import { config } from '../config';

class ApiClient {
  constructor() {
    this.baseUrl = config.apiBaseUrl;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const { method = 'GET', body, headers = {} } = options;

    const response = await fetch(url, {
      method,
      headers: { ...this.getAuthHeaders(), ...headers },
      ...(body && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || `Request failed: ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return response.json();
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  }

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  }

  patch(endpoint, body) {
    return this.request(endpoint, { method: 'PATCH', body });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();

// ============================================================
// Resume Service
// ============================================================

export const resumeService = {
  generateFromPrompt(data) {
    return api.post('/api/generate-resume-from-prompt', data);
  },

  analyzeResume(data) {
    return api.post('/api/analyze-resume', data);
  },

  getATSScore(data) {
    return api.post('/api/ats-score', data);
  },
};

// ============================================================
// Skill Verification Service
// ============================================================

export const verificationService = {
  checkStatus(userIdentifier) {
    return api.post('/api/check-verification-status', { userIdentifier });
  },

  generateQuestion(skill, field) {
    return api.post('/api/generate-skill-question', {
      skill,
      level: 'intermediate',
      field,
      difficulty: 'basic',
    });
  },

  verifyAnswer(data) {
    return api.post('/api/verify-skill-answer', data);
  },
};

// ============================================================
// Job Service (API contract — backend TBD)
// ============================================================

export const jobService = {
  getJobs(params) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/jobs?${query}`);
  },

  getJobById(id) {
    return api.get(`/api/jobs/${id}`);
  },

  createJob(data) {
    return api.post('/api/jobs', data);
  },

  updateJob(id, data) {
    return api.put(`/api/jobs/${id}`, data);
  },

  applyToJob(jobId, data) {
    return api.post(`/api/jobs/${jobId}/apply`, data);
  },
};

// ============================================================
// University Service (API contract — backend TBD)
// ============================================================

export const universityService = {
  getDashboard() {
    return api.get('/api/university/dashboard');
  },

  getStudents(params) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/university/students?${query}`);
  },

  importStudents(data) {
    return api.post('/api/university/students/import', data);
  },

  inviteStudent(data) {
    return api.post('/api/university/students/invite', data);
  },

  getDrives(params) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/university/drives?${query}`);
  },

  createDrive(data) {
    return api.post('/api/university/drives', data);
  },

  updateDrive(id, data) {
    return api.put(`/api/university/drives/${id}`, data);
  },

  getAnalytics() {
    return api.get('/api/university/analytics');
  },
};

// ============================================================
// Company Service (API contract — backend TBD)
// ============================================================

export const companyService = {
  getDashboard() {
    return api.get('/api/company/dashboard');
  },

  getApplicants(params) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/company/applicants?${query}`);
  },

  updateCandidateStatus(candidateId, status) {
    return api.patch(`/api/company/candidates/${candidateId}`, { status });
  },

  getProfile() {
    return api.get('/api/company/profile');
  },

  updateProfile(data) {
    return api.put('/api/company/profile', data);
  },
};

// ============================================================
// Admin Service (API contract — backend TBD)
// ============================================================

export const adminService = {
  getDashboard() {
    return api.get('/api/admin/dashboard');
  },

  getUsers(params) {
    const query = new URLSearchParams(params).toString();
    return api.get(`/api/admin/users?${query}`);
  },

  verifyUniversity(id, data) {
    return api.post(`/api/admin/universities/${id}/verify`, data);
  },

  verifyCompany(id, data) {
    return api.post(`/api/admin/companies/${id}/verify`, data);
  },

  getReports() {
    return api.get('/api/admin/reports');
  },
};

export default api;