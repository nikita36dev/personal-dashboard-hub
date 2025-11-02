import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { AlertContext } from '../../contexts/AlertContext';
import TaskForm from '../TaskManager/TaskForm';
import HabitForm from '../HabitTracker/HabitForm';
import GoalForm from '../DailyGoals/GoalForm';
import DashboardCard from './DashboardCard';
import PomodoroWidget from './PomodoroWidget';
import { Plus, X } from 'lucide-react';
import storage from '../../utils/localStorage';
import '../../styles/Dashboard.css';

const DashboardView = () => {
  const { tasks, saveNotes, habits, saveHabits, goals, saveGoals, pomodoroStats } = useContext(DataContext);
  const { showSuccess } = useContext(AlertContext);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [pomodoroSettings, setPomodoroSettings] = useState(storage.getPomodoroSettings());

  // Quick stats
  const activeTasks = tasks.filter(t => !t.completed).length;
  const completedTasks = tasks.filter(t => t.completed).length;
  
  const todayHabits = habits.filter(h => {
    const today = new Date().toDateString();
    return !(h.completedDates && h.completedDates.includes(today));
  }).length;
  const completedHabits = habits.filter(h => {
    const today = new Date().toDateString();
    return h.completedDates && h.completedDates.includes(today);
  }).length;
  
  const todayGoals = goals.filter(g => {
    const today = new Date().toDateString();
    const goalDate = g.date ? new Date(g.date).toDateString() : '';
    return goalDate === today && !g.completed;
  }).length;
  const completedGoals = goals.filter(g => {
    const today = new Date().toDateString();
    const goalDate = g.date ? new Date(g.date).toDateString() : '';
    return goalDate === today && g.completed;
  }).length;

  const handleAddTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    saveNotes([newTask, ...tasks]);
    showSuccess('Task added successfully!');
    setShowTaskForm(false);
  };

  const handleAddHabit = (habitData) => {
    const newHabit = {
      ...habitData,
      id: Date.now(),
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString()
    };
    saveHabits([...habits, newHabit]);
    showSuccess('Habit added successfully!');
    setShowHabitForm(false);
  };

  const handleAddGoal = (goalData) => {
    const newGoal = {
      ...goalData,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    saveGoals([...goals, newGoal]);
    showSuccess('Goal added successfully!');
    setShowGoalForm(false);
  };

  return (
    <div className="dashboard-view">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Your productivity overview</p>
      </div>

      {/* Stats Row */}
      <div className="dashboard-stats">
        <div className="stat-box">
          <div className="stat-icon tasks">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{activeTasks}</div>
            <div className="stat-label">Active Tasks</div>
            <div className="stat-secondary">{completedTasks} completed</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon habits">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{todayHabits}</div>
            <div className="stat-label">Habits Today</div>
            <div className="stat-secondary">{completedHabits} completed</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon goals">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{todayGoals}</div>
            <div className="stat-label">Daily Goals</div>
            <div className="stat-secondary">{completedGoals} completed</div>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-icon pomodoro">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="stat-content">
            <div className="stat-number">{pomodoroStats?.completedSessions || 0}</div>
            <div className="stat-label">Pomodoro</div>
            <div className="stat-secondary">{pomodoroStats?.totalMinutes || 0}m worked</div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="dashboard-cards">
        {/* Quick Task Card */}
        <DashboardCard
          title="Quick Tasks"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>}
          onAddClick={() => setShowTaskForm(true)}
          color="#3b82f6"
        >
          <div className="card-quick-list">
            {tasks.slice(0, 3).map(task => (
              <div key={task.id} className="quick-item">
                <div className="quick-item-check">
                  {task.completed && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className={task.completed ? 'completed' : ''}>
                  {task.title}
                </span>
              </div>
            ))}
            {tasks.length === 0 && <p className="empty-text">No tasks yet. Add one to get started!</p>}
          </div>
        </DashboardCard>

        {/* Quick Habit Card */}
        <DashboardCard
          title="Today's Habits"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>}
          onAddClick={() => setShowHabitForm(true)}
          color="#10b981"
        >
          <div className="card-quick-list">
            {habits.slice(0, 3).map(habit => (
              <div key={habit.id} className="quick-item">
                <span>{habit.name}</span>
                <span className="streak">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <path d="M12.62 20.81c-.4.49-.84.86-1.41.97-.28.05-.58.05-.88.05-1.53 0-2.75-.5-3.54-1.5-.79-1-1.18-2.51-1.18-4.54 0-2.17.42-3.72 1.26-4.68.84-.96 2.1-1.49 3.77-1.49 1.08 0 2.02.27 2.82.81.8.54 1.36 1.35 1.68 2.42h-2.37c-.3-.62-.8-.93-1.41-.93-.65 0-1.16.29-1.52.87-.36.58-.54 1.43-.54 2.57 0 1.08.16 1.9.48 2.48.32.58.82.87 1.48.87.65 0 1.18-.35 1.58-.94v-1.88h-1.9v-1.76h4.36v5.25zm6.82-1.27c.49-.55.73-1.31.73-2.29 0-.96-.24-1.7-.73-2.23-.49-.53-1.19-.79-2.1-.79s-1.61.26-2.1.79c-.49.53-.73 1.27-.73 2.23 0 .98.24 1.74.73 2.29.49.55 1.19.82 2.1.82s1.61-.27 2.1-.82zm-2.16-1.33c-.28-.31-.42-.77-.42-1.39 0-.62.14-1.08.42-1.39.28-.31.68-.46 1.18-.46.5 0 .9.15 1.18.46.28.31.42.77.42 1.39 0 .62-.14 1.08-.42 1.39-.28.31-.68.46-1.18.46-.5 0-.9-.15-1.18-.46z"/>
                  </svg>
                  {habit.currentStreak || 0}
                </span>
              </div>
            ))}
            {habits.length === 0 && <p className="empty-text">No habits yet. Create one!</p>}
          </div>
        </DashboardCard>

        {/* Quick Goal Card */}
        <DashboardCard
          title="Today's Goals"
          icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>}
          onAddClick={() => setShowGoalForm(true)}
          color="#8b5cf6"
        >
          <div className="card-quick-list">
            {goals.slice(0, 3).map(goal => (
              <div key={goal.id} className="quick-item">
                <div className="quick-item-check">
                  {goal.completed && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className={goal.completed ? 'completed' : ''}>
                  {goal.text}
                </span>
              </div>
            ))}
            {goals.length === 0 && <p className="empty-text">No goals yet. Start your day!</p>}
          </div>
        </DashboardCard>

        {/* Pomodoro Widget */}
        <PomodoroWidget />
      </div>

      {/* Modals */}
      {showTaskForm && (
        <div className="modal-overlay" onClick={() => setShowTaskForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button 
                onClick={() => setShowTaskForm(false)}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <TaskForm
                onSubmit={handleAddTask}
                onCancel={() => setShowTaskForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showHabitForm && (
        <div className="modal-overlay" onClick={() => setShowHabitForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Habit</h2>
              <button 
                onClick={() => setShowHabitForm(false)}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <HabitForm
                onSubmit={handleAddHabit}
                onCancel={() => setShowHabitForm(false)}
              />
            </div>
          </div>
        </div>
      )}

      {showGoalForm && (
        <div className="modal-overlay" onClick={() => setShowGoalForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Goal</h2>
              <button 
                onClick={() => setShowGoalForm(false)}
                className="modal-close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-content">
              <GoalForm
                onSubmit={handleAddGoal}
                onCancel={() => setShowGoalForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
