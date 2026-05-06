import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, User, LogOut, Moon, Sun, Save, Camera } from 'lucide-react';
import './Settings.css';

const SettingsPage = () => {
  const { user, updateProfile, theme, toggleTheme, logout } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(formData);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="settings-page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate('/dashboard')}>
          <ArrowLeft size={24} />
        </button>
        <h2>Settings</h2>
        <div style={{ width: 24 }}></div>
      </header>

      <div className="settings-content">
        {/* Profile Section */}
        <section className="settings-section glass-panel">
          <h3>Profile Information</h3>
          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="avatar-upload">
              <div className="avatar-preview">
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" />
                ) : (
                  <div className="avatar-placeholder">{formData.name.charAt(0) || 'U'}</div>
                )}
              </div>
              <label className="upload-btn">
                <Camera size={16} />
                <span>Change Photo</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
              </label>
            </div>

            <div className="form-group">
              <label>Full Name</label>
              <div className="input-group">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                disabled
                className="disabled-input"
              />
            </div>

            <button type="submit" className="primary-btn glow-btn submit-btn">
              <Save size={18} /> Save Changes
            </button>
          </form>
        </section>

        {/* Preferences Section */}
        <section className="settings-section glass-panel">
          <h3>App Preferences</h3>
          <div className="preference-item">
            <div className="preference-info">
              <h4>Appearance</h4>
              <p>Toggle between Light and Dark mode globally.</p>
            </div>
            <button className={`theme-toggle ${theme}`} onClick={toggleTheme}>
              <div className="toggle-slider">
                {theme === 'light' ? <Sun size={14} className="icon-sun" /> : <Moon size={14} className="icon-moon" />}
              </div>
            </button>
          </div>
        </section>

        {/* Account Section */}
        <section className="settings-section glass-panel danger-zone">
          <h3>Account Actions</h3>
          <p className="danger-desc">Securely clear your session and return to the login screen.</p>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Log Out
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
