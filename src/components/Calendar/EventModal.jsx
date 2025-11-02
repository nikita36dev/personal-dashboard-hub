import { useState, useEffect } from 'react';
import { Icons } from '../../assets/icons';

const EventModal = ({ event, selectedDate, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    color: '#6366f1',
    reminder: false
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        color: event.color || '#6366f1',
        reminder: event.reminder || false
      });
    } else if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: dateStr }));
    }
  }, [event, selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title.trim() && formData.date) {
      onSave(event ? { ...event, ...formData } : formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', 
    '#f59e0b', '#10b981', '#06b6d4', '#64748b'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>{event ? 'Edit Event' : 'New Event'}</h2>
          <button 
            onClick={onClose} 
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'var(--bg-tertiary)',
              color: 'var(--text-primary)'
            }}
          >
            <Icons.Close />
          </button>
        </div>

        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Event Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter event title..."
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Add description..."
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>End Time</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Event Color</label>
            <div className="color-picker">
              {colors.map(color => (
                <div
                  key={color}
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleChange('color', color)}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.reminder}
                onChange={(e) => handleChange('reminder', e.target.checked)}
              />
              Set reminder for this event
            </label>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            {event && (
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={() => onDelete(event.id)}
              >
                <Icons.Delete />
                Delete
              </button>
            )}
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose} 
              style={{ marginLeft: event ? '0' : 'auto' }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Icons.Save />
              {event ? 'Update' : 'Save'} Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
