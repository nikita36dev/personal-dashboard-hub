import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import '../../styles/HabitTracker.css';

const HabitForm = ({ habit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'Daily'
  });

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name || '',
        description: habit.description || '',
        frequency: habit.frequency || 'Daily'
      });
    }
  }, [habit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Habit name is required');
      return;
    }
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      frequency: 'Daily'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <div className="form-group">
        <label>Habit Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Morning Exercise, Read"
          autoFocus
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Why this habit matters"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Frequency</label>
        <select name="frequency" value={formData.frequency} onChange={handleChange}>
          <option>Daily</option>
          <option>Weekly</option>
          <option>Monthly</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="form-button submit">
          <Save size={18} />
          {habit ? 'Update Habit' : 'Add Habit'}
        </button>
        <button type="button" className="form-button cancel" onClick={onCancel}>
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default HabitForm;
