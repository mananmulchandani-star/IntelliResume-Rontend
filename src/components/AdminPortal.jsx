import React, { useState, useEffect } from 'react';
import './AdminPortal.css';

const AdminPortal = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    resumeCreated: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [adminType, setAdminType] = useState(''); // 'full' or 'limited'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Admin credentials
  const adminCredentials = {
    'CARDxTRIKE': { password: '5da7f23y4g', type: 'full' },
    'MANANCEO': { password: '5da7f23y5g', type: 'limited' }
  };

  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadUserData();
    }
  }, [isAuthenticated]);

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleLogin = (e) => {
    e.preventDefault();
    const admin = adminCredentials[loginData.username];
    
    if (admin && admin.password === loginData.password) {
      setIsAuthenticated(true);
      setAdminType(admin.type);
      setShowPassword(admin.type === 'full');
    } else {
      alert('Invalid credentials!');
    }
  };

  const loadUserData = () => {
    try {
      // Get all keys from localStorage
      const allKeys = Object.keys(localStorage);
      const userData = [];
      let totalResumes = 0;

      // Count resumes from userResumes
      const userResumes = localStorage.getItem('userResumes');
      if (userResumes) {
        try {
          const resumes = JSON.parse(userResumes);
          totalResumes = Array.isArray(resumes) ? resumes.length : 0;
        } catch (error) {
          console.error('Error parsing userResumes:', error);
        }
      }

      allKeys.forEach(key => {
        if (key === 'signupData' || key.startsWith('signupData_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data && data.email) {
              userData.push({
                id: key,
                ...data,
                signupDate: data.signupDate || new Date().toISOString(),
                // Check if user has created resume by looking for resume data
                hasResume: !!localStorage.getItem('resumeData') || 
                          !!localStorage.getItem('currentResume') ||
                          !!localStorage.getItem('userResumes')
              });
            }
          } catch (error) {
            console.error('Error parsing user data:', error);
          }
        }
      });

      setUsers(userData);
      setFilteredUsers(userData);
      
      // Calculate REAL statistics
      const totalUsers = userData.length;
      const resumeCreated = totalResumes > 0 ? totalResumes : userData.filter(user => user.hasResume).length;

      setStats({
        totalUsers,
        resumeCreated
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.fullName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.includes(term)
      );
      setFilteredUsers(filtered);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const user = users.find(u => u.id === userId);
      if (user) {
        // Remove user data from localStorage
        localStorage.removeItem(userId);
        localStorage.removeItem('resumeData');
        localStorage.removeItem('currentResume');
        
        // Update state
        const updatedUsers = users.filter(u => u.id !== userId);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        
        // Recalculate stats
        const totalUsers = updatedUsers.length;
        const userResumes = localStorage.getItem('userResumes');
        let resumeCreated = 0;
        
        if (userResumes) {
          try {
            const resumes = JSON.parse(userResumes);
            resumeCreated = Array.isArray(resumes) ? resumes.length : 0;
          } catch (error) {
            console.error('Error parsing userResumes:', error);
          }
        }

        setStats({
          totalUsers,
          resumeCreated
        });
        
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser(null);
        }
      }
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminType('');
    setLoginData({ username: '', password: '' });
    setUsers([]);
    setSelectedUser(null);
    setDarkMode(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (!isAuthenticated) {
    return (
      <div className={`admin-login-page ${darkMode ? 'dark-mode' : ''}`}>
        <div className="login-container">
          <div className="login-header">
            <h1>Admin Portal</h1>
            <p>Enter your credentials to access the dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                placeholder="Enter username"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                placeholder="Enter password"
                required
              />
            </div>
            
            <button type="submit" className="login-btn">
              Login to Admin Portal
            </button>
          </form>

          <div className="admin-notes">
            <h3>Available Admin Accounts:</h3>
            <div className="admin-account">
              <strong>Username:</strong> CARDxTRIKE<br/>
              <strong>Access:</strong> Full Access (Can view passwords)
            </div>
            <div className="admin-account">
              <strong>Username:</strong> MANANCEO<br/>
              <strong>Access:</strong> Limited Access (Cannot view passwords)
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`admin-portal ${darkMode ? 'dark-mode' : ''}`}>
      {/* Header */}
      <header className="admin-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Real-time User Management Portal</p>
          </div>
          <div className="header-right">
            <button 
              onClick={toggleDarkMode} 
              className="theme-toggle-btn"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <span className="admin-welcome">
              Welcome, <strong>{loginData.username}</strong> 
              <span className="admin-badge">{adminType === 'full' ? 'Full Access' : 'Limited Access'}</span>
            </span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {/* Statistics Cards - REAL DATA ONLY */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon users-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalUsers}</h3>
            <p>Total Users Signed Up</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon resume-icon">📄</div>
          <div className="stat-info">
            <h3>{stats.resumeCreated}</h3>
            <p>Resumes Generated</p>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="controls-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <div className="access-info">
          <span className={`access-badge ${adminType}`}>
            {adminType === 'full' ? '🔓 Full Access' : '🔒 Limited Access'}
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User Details</th>
              <th>Signup Date</th>
              <th>Resume Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className="user-row">
                  <td>
                    <div className="user-basic-info">
                      <strong>{user.fullName || 'Not Provided'}</strong>
                      <span>{user.email}</span>
                      <span>{user.phone || 'No Phone'}</span>
                    </div>
                  </td>
                  <td>
                    {new Date(user.signupDate).toLocaleDateString()}
                  </td>
                  <td>
                    <span className={`status-badge ${user.hasResume ? 'completed' : 'pending'}`}>
                      {user.hasResume ? '✅ Yes' : '❌ No'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        onClick={() => viewUserDetails(user)}
                        className="view-btn"
                      >
                        View Details
                      </button>
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-users">
                  {searchTerm ? 'No users found matching your search.' : 'No users found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>User Details</h2>
              <button onClick={closeUserDetails} className="close-btn">×</button>
            </div>
            
            <div className="user-details">
              <div className="detail-section">
                <h3>Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Full Name:</label>
                    <span>{selectedUser.fullName || 'Not Provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedUser.phone || 'Not Provided'}</span>
                  </div>
                  {adminType === 'full' && (
                    <div className="detail-item">
                      <label>Password:</label>
                      <span className="password-field">{selectedUser.password || 'Not Available'}</span>
                    </div>
                  )}
                  <div className="detail-item">
                    <label>Job Title:</label>
                    <span>{selectedUser.jobTitle || 'Not Provided'}</span>
                  </div>
                  <div className="detail-item">
                    <label>University:</label>
                    <span>{selectedUser.university || 'Not Provided'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Activity Status</h3>
                <div className="status-grid">
                  <div className="status-item">
                    <label>Resume Created:</label>
                    <span className={`status ${selectedUser.hasResume ? 'completed' : 'pending'}`}>
                      {selectedUser.hasResume ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="status-item">
                    <label>Signup Date:</label>
                    <span>{new Date(selectedUser.signupDate).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {selectedUser.about && (
                <div className="detail-section">
                  <h3>About User</h3>
                  <p className="about-text">{selectedUser.about}</p>
                </div>
              )}

              <div className="modal-actions">
                <button 
                  onClick={() => {
                    deleteUser(selectedUser.id);
                    closeUserDetails();
                  }}
                  className="delete-btn"
                >
                  Delete User
                </button>
                <button onClick={closeUserDetails} className="close-modal-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;