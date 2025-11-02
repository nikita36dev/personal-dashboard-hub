import { Edit2, Trash2 } from 'lucide-react';
import '../../styles/TaskManager.css';

const TaskItem = ({ task, onToggle, onEdit, onDelete, onDragStart, onDragOver, onDrop }) => {
  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    if (timeString) {
      return `${date} at ${timeString}`;
    }
    return date;
  };

  return (
    <div
      className={`task-item ${task.completed ? 'completed' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div
        className={`task-checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
      >
        {task.completed && (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
      </div>

      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-description">{task.description}</p>
        )}
        <div className="task-meta">
          {task.priority && (
            <span className={`task-priority ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          )}
          {task.category && (
            <span className="task-category">{task.category}</span>
          )}
          {task.dueDate && (
            <span className="task-date">
              {formatDateTime(task.dueDate, task.dueTime)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button
          className="task-action-btn edit"
          onClick={() => onEdit(task)}
          title="Edit task"
        >
          <Edit2 size={16} />
        </button>
        <button
          className="task-action-btn delete"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
