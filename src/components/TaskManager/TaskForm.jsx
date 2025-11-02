import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import '../../styles/TaskManager.css';

const TaskForm = ({ task, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    priority: 'Medium',
    dueDate: '',
    dueTime: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'Personal',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate || '',
        dueTime: task.dueTime || ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Task title is required');
      return;
    }
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      category: 'Personal',
      priority: 'Medium',
      dueDate: '',
      dueTime: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="form-group">
        <label>Task Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          autoFocus
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Add task details"
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            <option>Personal</option>
            <option>Work</option>
            <option>Shopping</option>
            <option>Health</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Due Time</label>
          <input
            type="time"
            name="dueTime"
            value={formData.dueTime}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="form-button submit">
          <Save size={18} />
          {task ? 'Update Task' : 'Add Task'}
        </button>
        <button type="button" className="form-button cancel" onClick={onCancel}>
          <X size={18} />
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
