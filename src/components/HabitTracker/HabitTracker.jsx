import { useState, useContext, useEffect } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { AlertContext } from '../../contexts/AlertContext';
import HabitItem from './HabitItem';
import HabitForm from './HabitForm';
import { Plus } from 'lucide-react';
import '../../styles/HabitTracker.css';

const HabitTracker = () => {
  const { habits, saveHabits } = useContext(DataContext);
  const { showSuccess } = useContext(AlertContext);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [allHabits, setAllHabits] = useState(habits || []);

  useEffect(() => {
    setAllHabits(habits || []);
  }, [habits]);

  const handleAddHabit = (habitData) => {
    const newHabit = {
      ...habitData,
      id: Date.now(),
      completedDates: [],
      currentStreak: 0,
      longestStreak: 0,
      createdAt: new Date().toISOString()
    };

    const updatedHabits = [...allHabits, newHabit];
    setAllHabits(updatedHabits);
    saveHabits(updatedHabits);
    showSuccess('Habit added successfully!');
    setShowForm(false);
  };

  const handleEditHabit = (habitData) => {
    if (!editingHabit) return;
    
    const updatedHabits = allHabits.map(h =>
      h.id === editingHabit.id ? { ...h, ...habitData, updatedAt: new Date().toISOString() } : h
    );
    
    setAllHabits(updatedHabits);
    saveHabits(updatedHabits);
    showSuccess('Habit updated successfully!');
    setEditingHabit(null);
    setShowForm(false);
  };

  const handleCompleteHabit = (id) => {
    const today = new Date().toDateString();
    
    const updatedHabits = allHabits.map(h => {
      if (h.id === id) {
        const isCompletedToday = h.completedDates?.includes(today);
        let newCompletedDates = h.completedDates || [];
        let newCurrentStreak = h.currentStreak || 0;

        if (!isCompletedToday) {
          newCompletedDates = [...newCompletedDates, today];
          newCurrentStreak = (h.currentStreak || 0) + 1;
        }

        const longestStreak = Math.max(h.longestStreak || 0, newCurrentStreak);

        return {
          ...h,
          completedDates: newCompletedDates,
          currentStreak: newCurrentStreak,
          longestStreak: longestStreak
        };
      }
      return h;
    });

    setAllHabits(updatedHabits);
    saveHabits(updatedHabits);
    showSuccess('Habit marked as complete!');
  };

  const handleDeleteHabit = (id) => {
    const updatedHabits = allHabits.filter(h => h.id !== id);
    setAllHabits(updatedHabits);
    saveHabits(updatedHabits);
    showSuccess('Habit deleted successfully!');
  };

  return (
    <div className="habit-tracker">
      <div className="habits-header">
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingHabit(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Habit
        </button>
      </div>

      <div className="habit-list">
        {allHabits.length === 0 ? (
          <div className="empty-state">
            <p>No habits yet. Create one to get started!</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Create Habit
            </button>
          </div>
        ) : (
          allHabits.map(habit => (
            <HabitItem
              key={habit.id}
              habit={habit}
              onComplete={handleCompleteHabit}
              onEdit={(h) => {
                setEditingHabit(h);
                setShowForm(true);
              }}
              onDelete={handleDeleteHabit}
            />
          ))
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => {
          setShowForm(false);
          setEditingHabit(null);
        }}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingHabit ? 'Edit Habit' : 'Add New Habit'}</h2>
            {editingHabit ? (
              <HabitForm
                habit={editingHabit}
                onSubmit={handleEditHabit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingHabit(null);
                }}
              />
            ) : (
              <HabitForm
                onSubmit={handleAddHabit}
                onCancel={() => setShowForm(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
