import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import '../../styles/DailyGoals.css';

const GoalForm = ({ goal, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    text: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (goal) {
      setFormData({
        text: goal.text || '',
        description: goal.description || '',
        date: goal.date ? goal.date.split('T')[0] : new Date().toISOString().split('T')[0]
      });
    }
  }, [goal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      alert('Goal text is required');
      return;
    }
    onSubmit(formData);
    setFormData({
      text: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <form onSubmit={handleSubmit} className="goal-form">
      <div className="form-group">
        <label>Goal</label>
        <input
          type="text"
          name="text"
          value={formData.text}
          onChange={handleChange}
          placeholder="What's your goal for today?"
          autoFocus
        />
      </div>

      <div className="form-group">
        <label>Description (Optional)</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add more details about your goal"
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="form-button submit">
          <Save size={18} />
          {goal ? 'Update Goal' : 'Add Goal'}
        </button>
        <button type="button" className="form-button cancel" onClick={onCancel}>
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default GoalForm;
