import '../../styles/DailyGoals.css';

const GoalItem = ({ goal, onToggle, onDelete }) => {
  return (
    <div className="goal-item">
      <input
        type="checkbox"
        className="goal-checkbox"
        checked={goal.completed}
        onChange={() => onToggle(goal.id)}
        id={`goal-${goal.id}`}
      />
      <div className="goal-content">
        <label 
          htmlFor={`goal-${goal.id}`}
          className={`goal-text ${goal.completed ? 'completed' : ''}`}
        >
          {goal.text}
        </label>
      </div>
      <div className="goal-actions">
        <button className="goal-action-btn delete" onClick={() => onDelete(goal.id)}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GoalItem;
