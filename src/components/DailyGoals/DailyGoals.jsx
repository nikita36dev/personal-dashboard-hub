import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { AlertContext } from '../../contexts/AlertContext';
import GoalForm from './GoalForm';
import { Plus, Trash2, CheckCircle2, Circle, Edit2 } from 'lucide-react';
import '../../styles/DailyGoals.css';

const DailyGoals = () => {
  const { goals, saveGoals } = useContext(DataContext);
  const { showSuccess } = useContext(AlertContext);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Get today's date string
  const getTodayString = () => new Date().toDateString();

  // Filter goals for today
  const getTodayGoals = () => {
    if (!goals || !Array.isArray(goals)) return [];
    
    const today = getTodayString();
    return goals.filter(g => {
      if (!g || !g.date) return false;
      const goalDate = new Date(g.date).toDateString();
      return goalDate === today;
    });
  };

  const todayGoals = getTodayGoals();
  const completedCount = todayGoals.filter(g => g.completed).length;
  const progressPercent = todayGoals.length > 0 ? (completedCount / todayGoals.length) * 100 : 0;

  const handleAddGoal = (goalData) => {
    const newGoal = {
      ...goalData,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    const allGoals = goals || [];
    const updatedGoals = [...allGoals, newGoal];
    saveGoals(updatedGoals);
    showSuccess('Goal added successfully!');
    setShowForm(false);
  };

  const handleEditGoal = (goalData) => {
    if (!editingGoal) return;
    
    const updatedGoals = (goals || []).map(g =>
      g.id === editingGoal.id ? { ...g, ...goalData, updatedAt: new Date().toISOString() } : g
    );
    
    saveGoals(updatedGoals);
    showSuccess('Goal updated successfully!');
    setEditingGoal(null);
    setShowForm(false);
  };

  const handleToggleComplete = (id) => {
    const updatedGoals = (goals || []).map(g =>
      g.id === id ? { ...g, completed: !g.completed } : g
    );
    
    saveGoals(updatedGoals);
    
    const goal = updatedGoals.find(g => g.id === id);
    if (goal?.completed) {
      showSuccess('Goal completed! Awesome!');
    }
  };

  const handleDeleteGoal = (id) => {
    const updatedGoals = (goals || []).filter(g => g.id !== id);
    saveGoals(updatedGoals);
    showSuccess('Goal deleted successfully!');
  };

  const handleOpenEdit = (goal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGoal(null);
  };

  return (
    <div className="daily-goals-container">
      {/* Header */}
      <div className="goals-header-section">
        <div>
          <h1>Today's Goals</h1>
          <p className="goals-subtitle">{completedCount} of {todayGoals.length} completed</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingGoal(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Goal
        </button>
      </div>

      {/* Progress Section */}
      {todayGoals.length > 0 && (
        <div className="goals-stats">
          <div className="stat-item">
            <div className="stat-number">{completedCount}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">{todayGoals.length}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">{Math.round(progressPercent)}%</div>
            <div className="stat-label">Progress</div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {todayGoals.length > 0 && (
        <div className="progress-section">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Goals List */}
      <div className="goals-content">
        {todayGoals.length === 0 ? (
          <div className="empty-goals">
            <Circle size={64} strokeWidth={1} />
            <h3>No goals for today</h3>
            <p>Create a goal to get started on your journey</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />
              Create First Goal
            </button>
          </div>
        ) : (
          <div className="goals-list">
            {todayGoals.map(goal => (
              <div key={goal.id} className={`goal-card ${goal.completed ? 'completed' : ''}`}>
                <div className="goal-card-content">
                  <button
                    className="goal-checkbox"
                    onClick={() => handleToggleComplete(goal.id)}
                    title={goal.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {goal.completed ? (
                      <CheckCircle2 size={24} strokeWidth={2} />
                    ) : (
                      <Circle size={24} strokeWidth={2} />
                    )}
                  </button>

                  <div className="goal-text-content">
                    <h4 className="goal-title">{goal.text}</h4>
                    {goal.description && (
                      <p className="goal-desc">{goal.description}</p>
                    )}
                  </div>
                </div>

                <div className="goal-card-actions">
                  <button
                    className="goal-btn edit"
                    onClick={() => handleOpenEdit(goal)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="goal-btn delete"
                    onClick={() => handleDeleteGoal(goal.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingGoal ? 'Edit Goal' : 'Add New Goal'}</h2>
              <button 
                className="modal-close"
                onClick={handleCloseForm}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              {editingGoal ? (
                <GoalForm
                  goal={editingGoal}
                  onSubmit={handleEditGoal}
                  onCancel={handleCloseForm}
                />
              ) : (
                <GoalForm
                  onSubmit={handleAddGoal}
                  onCancel={handleCloseForm}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyGoals;
