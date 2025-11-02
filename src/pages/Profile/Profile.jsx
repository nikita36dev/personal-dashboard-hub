import { useContext, useState, useEffect } from 'react';
import { AlertContext } from '../../contexts/AlertContext';
import authService from '../../utils/authService';
import { User, Mail, LogOut, Edit2, Save, X } from 'lucide-react';
import '../../styles/Profile.css';

const Profile = ({ user, onLogout }) => {
  const { showSuccess, showError } = useContext(AlertContext);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  useEffect(() => {
    console.log('Profile user:', user);
    if (user) {
      setCurrentUser(user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      showError('Name and email are required');
      return;
    }

    const updatedUser = authService.updateUserProfile({
      name: formData.name,
      email: formData.email,
      bio: formData.bio
    });

    if (updatedUser) {
      setCurrentUser(updatedUser);
      showSuccess('Profile updated successfully!');
      setIsEditing(false);
    } else {
      showError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      bio: currentUser?.bio || ''
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    authService.logout();
    showSuccess('Logged out successfully!', 2000);
    setTimeout(() => onLogout(), 1000);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        <p>Manage your account information</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <span>{currentUser.avatar || 'U'}</span>
          </div>

          <div className="profile-info">
            <div className="profile-section">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="Your full name"
                />
              ) : (
                <p className="profile-value">
                  {currentUser.name || 'Not set'}
                </p>
              )}
            </div>

            <div className="profile-section">
              <label>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="profile-input"
                  placeholder="your@email.com"
                />
              ) : (
                <p className="profile-value">{currentUser.email}</p>
              )}
            </div>

            <div className="profile-section">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="profile-input profile-textarea"
                  placeholder="Tell us about yourself"
                  rows="3"
                />
              ) : (
                <p className="profile-value">
                  {currentUser.bio || 'No bio added yet'}
                </p>
              )}
            </div>

            <div className="profile-section">
              <label>Login Status</label>
              <div className="status-badge online">
                <span className="status-dot"></span>
                Online
              </div>
            </div>

            <div className="profile-section">
              <label>Member Since</label>
              <p className="profile-value">
                {new Date(currentUser.loginTime).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={18} />
                  Save Changes
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  <X size={18} />
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
                <Edit2 size={18} />
                Edit Profile
              </button>
            )}

            <button className="btn btn-danger" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
