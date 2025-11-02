import { Icons } from '../../assets/icons';
import dateHelpers from '../../utils/dateHelpers';

const EventDetailModal = ({ item, onEdit, onDelete, onClose }) => {
  const getItemIcon = () => {
    switch(item.type) {
      case 'event': return <Icons.Calendar />;
      case 'task': return <Icons.Tasks />;
      case 'habit': return <Icons.Habits />;
      case 'goal': return <Icons.Goals />;
      default: return <Icons.Calendar />;
    }
  };

  const getItemTitle = () => {
    return item.title || item.name || item.text || 'Untitled';
  };

  const getItemDescription = () => {
    return item.description || item.content || 'No description available';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal event-detail-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="event-detail-header">
          <div className="event-detail-icon" style={{ backgroundColor: `${item.color}20` }}>
            {getItemIcon()}
          </div>
          <div className="event-detail-title-section">
            <div className="event-detail-type">{item.type.toUpperCase()}</div>
            <h2 className="event-detail-title">{getItemTitle()}</h2>
          </div>
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
              flexShrink: 0
            }}
          >
            <Icons.Close />
          </button>
        </div>

        {/* Content */}
        <div className="event-detail-content">
          {/* Date/Time Info */}
          <div className="detail-section">
            <div className="detail-label">
              <Icons.Calendar />
              Date & Time
            </div>
            <div className="detail-value">
              {item.date && dateHelpers.formatDate(item.date, 'long')}
              {item.startTime && (
                <span className="detail-time"> at {item.startTime}</span>
              )}
              {item.endTime && (
                <span className="detail-time"> - {item.endTime}</span>
              )}
            </div>
          </div>

          {/* Description */}
          {getItemDescription() !== 'No description available' && (
            <div className="detail-section">
              <div className="detail-label">
                <Icons.Notes />
                Description
              </div>
              <div className="detail-value detail-description">
                {getItemDescription()}
              </div>
            </div>
          )}

          {/* Task specific info */}
          {item.type === 'task' && (
            <>
              <div className="detail-section">
                <div className="detail-label">
                  <Icons.Check />
                  Status
                </div>
                <div className="detail-value">
                  <span className={`status-badge ${item.completed ? 'completed' : 'pending'}`}>
                    {item.completed ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
              {item.category && (
                <div className="detail-section">
                  <div className="detail-label">Category</div>
                  <div className="detail-value">
                    <span className="category-badge">{item.category}</span>
                  </div>
                </div>
              )}
              {item.priority && (
                <div className="detail-section">
                  <div className="detail-label">Priority</div>
                  <div className="detail-value">
                    <span className={`priority-badge priority-${item.priority.toLowerCase()}`}>
                      {item.priority}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Habit specific info */}
          {item.type === 'habit' && (
            <>
              <div className="detail-section">
                <div className="detail-label">
                  <Icons.Fire />
                  Streak
                </div>
                <div className="detail-value">
                  <div className="streak-info">
                    Current: <strong>{item.currentStreak || 0}</strong> days | 
                    Best: <strong>{item.longestStreak || 0}</strong> days
                  </div>
                </div>
              </div>
              <div className="detail-section">
                <div className="detail-label">Frequency</div>
                <div className="detail-value">
                  <span className="frequency-badge">{item.frequency}</span>
                </div>
              </div>
            </>
          )}

          {/* Goal specific info */}
          {item.type === 'goal' && (
            <div className="detail-section">
              <div className="detail-label">
                <Icons.Check />
                Status
              </div>
              <div className="detail-value">
                <span className={`status-badge ${item.completed ? 'completed' : 'pending'}`}>
                  {item.completed ? 'Achieved' : 'In Progress'}
                </span>
              </div>
            </div>
          )}

          {/* Event specific info */}
          {item.type === 'event' && item.reminder && (
            <div className="detail-section">
              <div className="detail-label">
                <Icons.Bell />
                Reminder
              </div>
              <div className="detail-value">
                <span className="reminder-badge">Enabled</span>
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="detail-section detail-metadata">
            {item.createdAt && (
              <div className="metadata-item">
                Created: {dateHelpers.formatDate(item.createdAt, 'short')}
              </div>
            )}
            {item.updatedAt && item.type === 'event' && (
              <div className="metadata-item">
                Updated: {dateHelpers.getRelativeTime(item.updatedAt)}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="event-detail-actions">
          {item.type === 'event' && (
            <>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  onEdit(item);
                  onClose();
                }}
              >
                <Icons.Edit />
                Edit Event
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => onDelete(item.id)}
              >
                <Icons.Delete />
                Delete
              </button>
            </>
          )}
          {item.type !== 'event' && (
            <div className="detail-info-badge">
              <Icons.TrendingUp />
              This {item.type} is managed in its respective tab
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
