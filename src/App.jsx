import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './components/DashboardPage';
import EditorPage from './components/EditorPage';
import AdminPortal from './components/AdminPortal';
import ErrorBoundary from './components/ErrorBoundary';
import DebugPage from './components/DebugPage';
import Homepage from './components/Homepage.jsx';
import AuthPage from './components/AuthPage.jsx';
import AiPromptPage from './components/AIPromptPage.jsx';
import CreateResume from './components/CreateResume.jsx';
import { AuthProvider } from '../contexts/AuthContext';
import './App.css';

// AdminPortalPage Component (moved from main.jsx)
const AdminPortalPage = () => {
  const [adminData, setAdminData] = React.useState({
    users: 0,
    activeSessions: 0,
    revenue: 0,
    successRate: 0,
    recentActivities: [],
    websiteStats: {
      pageViews: 0,
      uniqueVisitors: 0,
      bounceRate: 0,
      avgSessionDuration: 0
    }
  });

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setAdminData({
            users: 156,
            activeSessions: 23,
            revenue: 2845.50,
            successRate: 87,
            recentActivities: [
              { id: 1, action: 'New user registration', user: 'john@email.com', time: '5 min ago', type: 'registration' },
              { id: 2, action: 'Resume created', user: 'sarah@email.com', time: '12 min ago', type: 'resume_created' },
              { id: 3, action: 'User login', user: 'mike@email.com', time: '18 min ago', type: 'login' }
            ],
            websiteStats: {
              pageViews: 1247,
              uniqueVisitors: 423,
              bounceRate: 42.3,
              avgSessionDuration: 5.8
            }
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="header-content">
          <h1 className="admin-title">Resume Builder Admin</h1>
          <div className="admin-badge">Real-time Dashboard</div>
        </div>
        <div className="user-info">
          <div className="user-avatar">AD</div>
          <span className="user-name">Administrator</span>
        </div>
      </header>

      <div className="admin-content">
        <div className="stats-grid">
          <div className="stat-card fade-in">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>{adminData.users.toLocaleString()}</h3>
              <p>Total Users</p>
            </div>
            <div className="stat-trend">+5%</div>
          </div>

          <div className="stat-card fade-in" style={{animationDelay: '0.1s'}}>
            <div className="stat-icon">🌐</div>
            <div className="stat-info">
              <h3>{adminData.activeSessions}</h3>
              <p>Active Sessions</p>
            </div>
            <div className="stat-trend live-indicator">Live</div>
          </div>

          <div className="stat-card fade-in" style={{animationDelay: '0.2s'}}>
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>${adminData.revenue.toLocaleString()}</h3>
              <p>Monthly Revenue</p>
            </div>
            <div className="stat-trend">+12%</div>
          </div>

          <div className="stat-card fade-in" style={{animationDelay: '0.3s'}}>
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{adminData.successRate}%</h3>
              <p>Success Rate</p>
            </div>
            <div className="stat-trend">+3%</div>
          </div>
        </div>

        <div className="content-grid">
          <div className="actions-section slide-up">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <button className="action-btn">
                <span className="btn-icon">📊</span>
                View Analytics
              </button>
              <button className="action-btn">
                <span className="btn-icon">👥</span>
                Manage Users
              </button>
              <button className="action-btn">
                <span className="btn-icon">📝</span>
                Create Template
              </button>
              <button className="action-btn">
                <span className="btn-icon">🔧</span>
                System Settings
              </button>
            </div>
          </div>

          <div className="activity-section slide-up" style={{animationDelay: '0.2s'}}>
            <div className="section-header">
              <h2>Recent Activity</h2>
              <span className="live-badge">Live</span>
            </div>
            <div className="activity-list">
              {adminData.recentActivities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className={`activity-dot ${activity.type}`}></div>
                  <div className="activity-content">
                    <p>{activity.action}</p>
                    <div className="activity-meta">
                      <span className="activity-user">{activity.user}</span>
                      <span className="activity-time">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      {/* ✅ AuthProvider wraps EVERYTHING */}
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            
            {/* Protected Routes (will have auth access) */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/ai-prompt" element={<AiPromptPage />} />
            <Route path="/create-resume" element={<CreateResume />} />
            
            {/* Admin Routes */}
            <Route path="/adminportal" element={<AdminPortalPage />} />
            <Route path="/admin" element={<AdminPortal />} />
            
            {/* Debug Route */}
            <Route path="/debug" element={<DebugPage />} />
            
            {/* 404 Route */}
            <Route path="*" element={<div>Page not found - 404 Error</div>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
