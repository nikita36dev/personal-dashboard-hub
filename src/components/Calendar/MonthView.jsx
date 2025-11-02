import dateHelpers from '../../utils/dateHelpers';

const MonthView = ({ currentDate, events, tasks, habits, goals, onDayClick, onItemClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendar = dateHelpers.getMonthCalendar(year, month);
  const today = new Date().toDateString();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getItemsForDay = (day) => {
    if (!day) return [];
    
    const dateStr = new Date(year, month, day).toDateString();
    const allItems = [];

    // Add calendar events
    if (events && events.length > 0) {
      events.forEach(event => {
        if (event.date && new Date(event.date).toDateString() === dateStr) {
          allItems.push({ 
            ...event, 
            type: 'event',
            color: event.color || '#6366f1'
          });
        }
      });
    }

    // Add tasks with due dates
    if (tasks && tasks.length > 0) {
      tasks.forEach(task => {
        if (task.dueDate && new Date(task.dueDate).toDateString() === dateStr) {
          allItems.push({ 
            ...task,
            type: 'task',
            color: task.completed ? '#10b981' : '#f59e0b'
          });
        }
      });
    }

    // Add habits completed today
    if (habits && habits.length > 0) {
      habits.forEach(habit => {
        if (habit.completedDates && habit.completedDates.includes(dateStr)) {
          allItems.push({ 
            ...habit,
            type: 'habit',
            color: '#10b981'
          });
        }
      });
    }

    // Add goals for today
    if (goals && goals.length > 0) {
      goals.forEach(goal => {
        if (goal.date && new Date(goal.date).toDateString() === dateStr) {
          allItems.push({
            ...goal,
            type: 'goal',
            color: goal.completed ? '#10b981' : '#8b5cf6'
          });
        }
      });
    }

    return allItems;
  };

  const isToday = (day) => {
    if (!day) return false;
    return new Date(year, month, day).toDateString() === today;
  };

  return (
    <div className="calendar-grid">
      {weekDays.map(day => (
        <div key={day} className="calendar-day-header">
          {day}
        </div>
      ))}

      {calendar.map((week, weekIndex) => (
        week.map((day, dayIndex) => {
          const dayItems = day ? getItemsForDay(day) : [];

          return (
            <div
              key={`${weekIndex}-${dayIndex}`}
              className={`calendar-day ${!day ? 'other-month' : ''} ${isToday(day) ? 'today' : ''}`}
              onClick={() => day && onDayClick(new Date(year, month, day))}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  <div className="day-events">
                    {dayItems.slice(0, 3).map((item, idx) => (
                      <div
                        key={`${item.id}-${idx}`}
                        className={`day-event ${item.type}`}
                        style={{ 
                          backgroundColor: item.color,
                          borderLeft: `3px solid ${item.color}`
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onItemClick(item);
                        }}
                        title={`${item.type.toUpperCase()}: ${item.title || item.name || item.text}`}
                      >
                        <span className="event-type-badge">{item.type[0].toUpperCase()}</span>
                        {item.title || item.name || item.text}
                      </div>
                    ))}
                    {dayItems.length > 3 && (
                      <div 
                        className="day-event more-items" 
                        style={{ backgroundColor: 'var(--text-tertiary)', fontSize: '0.7rem' }}
                      >
                        +{dayItems.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })
      ))}
    </div>
  );
};

export default MonthView;
