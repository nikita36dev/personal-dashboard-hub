import { useState, useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { Icons } from '../../assets/icons';
import { User } from 'lucide-react';
import '../../styles/Sidebar.css';

const Sidebar = ({ activeView, setActiveView, isMobile }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { tasks, habits, goals, notes } = useContext(DataContext);

  const activeTasks = tasks.filter(t => !t.completed).length;
  const todayHabits = habits.filter(h => {
    const today = new Date().toDateString();
    return !(h.completedDates && h.completedDates.includes(today));
  }).length;
  const todayGoals = goals.filter(g => !g.completed).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
    { id: 'tasks', label: 'Tasks', icon: Icons.Tasks, badge: activeTasks },
    { id: 'habits', label: 'Habits', icon: Icons.Habits, badge: todayHabits },
    { id: 'timer', label: 'Pomodoro', icon: Icons.Timer },
    { id: 'goals', label: 'Daily Goals', icon: Icons.Goals, badge: todayGoals },
    { id: 'notes', label: 'Notes', icon: Icons.Notes, badge: notes.length },
    { id: 'calendar', label: 'Calendar', icon: Icons.Calendar },
    { id: 'analytics', label: 'Analytics', icon: Icons.Analytics },
    { id: 'settings', label: 'Settings', icon: Icons.Settings }
  ];

  const handleNavClick = (id) => {
    setActiveView(id);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {isMobile && mobileOpen && (
        <div 
          className="sidebar-overlay active" 
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${isMobile && mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Icons.Dashboard />
            <span>Dashboard</span>
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icons.ChevronLeft />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main</div>
            {navItems.slice(0, 5).map(item => (
              <div
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <item.icon />
                <span className="nav-item-text">{item.label}</span>
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Tools</div>
            {navItems.slice(5, 8).map(item => (
              <div
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <item.icon />
                <span className="nav-item-text">{item.label}</span>
                {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Other</div>
            {navItems.slice(8).map(item => (
              <div
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <item.icon />
                <span className="nav-item-text">{item.label}</span>
              </div>
            ))}
          </div>
        </nav>

        {/* User Button */}
        <div className="sidebar-footer">
          <button
            className={`nav-item user-btn ${activeView === 'profile' ? 'active' : ''}`}
            onClick={() => handleNavClick('profile')}
          >
            <User size={20} />
            <span className="nav-item-text">Profile</span>
          </button>
        </div>
      </aside>

      {isMobile && !mobileOpen && (
        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(true)}
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--gradient-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px var(--shadow-md)',
            zIndex: 999
          }}
        >
          <Icons.Menu />
        </button>
      )}
    </>
  );
};

export default Sidebar;
