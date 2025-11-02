import { Trash2, Edit2, Check } from 'lucide-react';
import '../../styles/HabitTracker.css';

const HabitItem = ({ habit, onComplete, onEdit, onDelete }) => {
  const today = new Date().toDateString();
  const completedToday = habit.completedDates?.includes(today);

  return (
    <div className="habit-item">
      <div className="habit-header">
        <h3 className="habit-name">{habit.name}</h3>
        <div className="habit-actions">
          <button
            className="habit-action-btn edit"
            onClick={() => onEdit(habit)}
            title="Edit habit"
          >
            <Edit2 size={16} />
          </button>
          <button
            className="habit-action-btn delete"
            onClick={() => onDelete(habit.id)}
            title="Delete habit"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {habit.description && (
        <p className="habit-description">{habit.description}</p>
      )}

      <div className="habit-frequency">
        {habit.frequency}
      </div>

      <div className="habit-progress">
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${habit.currentStreak ? (habit.currentStreak / 30) * 100 : 0}%` }}
          />
        </div>
        <div className="progress-text">
          Current Streak: {habit.currentStreak || 0} days
        </div>
      </div>

      <div className="habit-streaks">
        <div className="streak-info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
            <polyline points="13 2 13 9 20 9"/>
          </svg>
          <span>Current: <span className="streak-number">{habit.currentStreak || 0}</span></span>
        </div>
        <div className="streak-info">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          <span>Best: <span className="streak-number">{habit.longestStreak || 0}</span></span>
        </div>
      </div>

      <button
        className={`habit-complete-btn ${completedToday ? 'completed' : ''}`}
        onClick={() => onComplete(habit.id)}
      >
        <Check size={18} />
        {completedToday ? 'Completed Today' : 'Mark Complete'}
      </button>
    </div>
  );
};

export default HabitItem;
