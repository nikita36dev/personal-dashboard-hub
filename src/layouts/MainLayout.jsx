import { useState } from 'react';
import Sidebar from '../components/Sidebar/Sidebar';
import ThemeSwitcher from '../components/ThemeSwitcher/ThemeSwitcher';
import TaskManager from '../components/TaskManager/TaskManager';
import HabitTracker from '../components/HabitTracker/HabitTracker';
import PomodoroTimer from '../components/PomodoroTimer/PomodoroTimer';
import DailyGoals from '../components/DailyGoals/DailyGoals';
import ProgressCharts from '../components/ProgressCharts/ProgressCharts';
import Notes from '../components/Notes/Notes';
import Calendar from '../components/Calendar/Calendar';
import Analytics from '../components/Analytics/Analytics';
import Settings from '../components/Settings/Settings';
import Profile from '../pages/Profile/Profile';
import DashboardView from '../components/Dashboard/DashboardView';
import '../styles/global.css';

const MainLayout = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TaskManager />;
      case 'habits':
        return <HabitTracker />;
      case 'timer':
        return <PomodoroTimer />;
      case 'goals':
        return <DailyGoals />;
      case 'notes':
        return <Notes />;
      case 'calendar':
        return <Calendar />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return <Profile user={user} onLogout={onLogout} />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardView />;
    }
  };

  const getViewTitle = (view) => {
    const titles = {
      dashboard: 'Dashboard',
      tasks: 'Task Manager',
      habits: 'Habit Tracker',
      timer: 'Pomodoro Timer',
      goals: 'Daily Goals',
      notes: 'Notes',
      calendar: 'Calendar',
      analytics: 'Analytics',
      profile: 'Profile',
      settings: 'Settings'
    };
    return titles[view] || 'Dashboard';
  };

  return (
    <div className="app-layout">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView}
        isMobile={isMobile}
      />
      
      <main className="app-main">
        <header className="app-header">
          <div>
            <h1>{getViewTitle(activeView)}</h1>
            <p>Manage your productivity</p>
          </div>
          <ThemeSwitcher />
        </header>

        <div className="app-content">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
