import { useState } from 'react';
import { Icons } from '../../assets/icons';
import '../../styles/QuickActions.css';

const QuickActions = ({ onAction }) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { id: 'add-task', label: 'Add Task', icon: Icons.Tasks },
    { id: 'add-note', label: 'Add Note', icon: Icons.Notes },
    { id: 'add-event', label: 'Add Event', icon: Icons.Calendar },
    { id: 'start-timer', label: 'Start Timer', icon: Icons.Timer }
  ];

  const handleAction = (actionId) => {
    onAction(actionId);
    setIsOpen(false);
  };

  return (
    <div className="quick-actions">
      <div className={`quick-actions-menu ${isOpen ? 'open' : ''}`}>
        {actions.map((action, index) => (
          <div
            key={action.id}
            className="quick-action-item"
            onClick={() => handleAction(action.id)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="quick-action-icon">
              <action.icon />
            </div>
            <span className="quick-action-label">{action.label}</span>
          </div>
        ))}
      </div>

      <button 
        className={`quick-actions-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icons.Plus />
      </button>
    </div>
  );
};

export default QuickActions;
