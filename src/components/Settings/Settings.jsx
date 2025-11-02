import { useState, useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import storage from '../../utils/localStorage';
import exportData from '../../utils/exportData';
import notifications from '../../utils/notifications';
import { Icons } from '../../assets/icons';
import '../../styles/Settings.css';

const Settings = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [settings, setSettings] = useState(storage.getSettings());

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    storage.saveSettings(newSettings);
  };

  const handleNotificationRequest = async () => {
    const granted = await notifications.requestPermission();
    if (granted) {
      alert('Notifications enabled!');
    } else {
      alert('Notification permission denied');
    }
  };

  const handleExport = (format) => {
    if (format === 'json') {
      exportData.toJSON();
    } else if (format === 'tasks-csv') {
      exportData.toCSV('tasks');
    } else if (format === 'habits-csv') {
      exportData.toCSV('habits');
    } else if (format === 'notes-csv') {
      exportData.toCSV('notes');
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await exportData.fromJSON(file);
          alert('Data imported successfully! Refresh the page to see changes.');
          window.location.reload();
        } catch (error) {
          alert('Failed to import data: ' + error);
        }
      }
    };
    input.click();
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure? This will delete ALL your data permanently!')) {
      if (window.confirm('Last chance! This action cannot be undone.')) {
        storage.clearAllData();
        alert('All data cleared. Refreshing page...');
        window.location.reload();
      }
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-sections">
        {/* Appearance */}
        <div className="settings-section">
          <div className="section-header">
            <div className="section-icon">
              <Icons.Sun />
            </div>
            <div>
              <h2 className="section-title">Appearance</h2>
              <p className="section-description">Customize the look and feel</p>
            </div>
          </div>
          
          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Theme</div>
                <div className="setting-description">Choose your preferred color theme</div>
              </div>
              <div className="setting-control">
                <select 
                  className="setting-select"
                  value={theme}
                  onChange={(e) => toggleTheme(e.target.value)}
                >
                  <option value="dark">Dark</option>
                  <option value="daylight">Daylight</option>
                  <option value="eye-protection">Eye Protection</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="section-header">
            <div className="section-icon">
              <Icons.Bell />
            </div>
            <div>
              <h2 className="section-title">Notifications</h2>
              <p className="section-description">Manage notification preferences</p>
            </div>
          </div>
          
          <div className="settings-grid">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Enable Notifications</div>
                <div className="setting-description">Get notified about tasks and timers</div>
              </div>
              <div className="setting-control">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={handleNotificationRequest}
                >
                  Enable
                </button>
              </div>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-label">Sound Effects</div>
                <div className="setting-description">Play sounds for notifications</div>
              </div>
              <div className="setting-control">
                <div 
                  className={`toggle-switch ${settings.soundEnabled ? 'active' : ''}`}
                  onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                >
                  <div className="toggle-slider" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="settings-section export-section">
          <div className="section-header">
            <div className="section-icon">
              <Icons.Download />
            </div>
            <div>
              <h2 className="section-title">Data Management</h2>
              <p className="section-description">Export and import your data</p>
            </div>
          </div>
          
          <div className="export-options">
            <div className="export-option" onClick={() => handleExport('json')}>
              <div className="export-icon">
                <Icons.Download />
              </div>
              <div className="export-title">Export All Data</div>
              <div className="export-description">JSON format</div>
            </div>
            
            <div className="export-option" onClick={() => handleExport('tasks-csv')}>
              <div className="export-icon">
                <Icons.Tasks />
              </div>
              <div className="export-title">Export Tasks</div>
              <div className="export-description">CSV format</div>
            </div>
            
            <div className="export-option" onClick={() => handleExport('habits-csv')}>
              <div className="export-icon">
                <Icons.Habits />
              </div>
              <div className="export-title">Export Habits</div>
              <div className="export-description">CSV format</div>
            </div>
            
            <div className="export-option" onClick={handleImport}>
              <div className="export-icon">
                <Icons.Upload />
              </div>
              <div className="export-title">Import Data</div>
              <div className="export-description">JSON format</div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <div className="section-header">
            <div className="section-icon" style={{ background: 'var(--danger-color)' }}>
              <Icons.Delete />
            </div>
            <div>
              <h2 className="section-title">Danger Zone</h2>
              <p className="section-description">Irreversible actions</p>
            </div>
          </div>
          
          <div className="danger-actions">
            <div className="danger-action">
              <div className="setting-info">
                <div className="setting-label">Clear All Data</div>
                <div className="setting-description">Permanently delete all your data</div>
              </div>
              <button 
                className="btn btn-danger"
                onClick={handleClearData}
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
