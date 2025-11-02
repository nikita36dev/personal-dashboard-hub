const WeekView = ({ currentDate, events, tasks, habits, goals, onDayClick, onItemClick }) => {
  const weekStart = new Date(currentDate);
  weekStart.setDate(currentDate.getDate() - currentDate.getDay());
  
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    weekDays.push(day);
  }

  const today = new Date().toDateString();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getItemsForDay = (date) => {
    const dateStr = date.toDateString();
    const allItems = [];

    if (events) {
      events.forEach(event => {
        if (event.date && new Date(event.date).toDateString() === dateStr) {
          allItems.push({ ...event, type: 'event', color: event.color || '#6366f1' });
        }
      });
    }

    if (tasks) {
      tasks.forEach(task => {
        if (task.dueDate && new Date(task.dueDate).toDateString() === dateStr) {
          allItems.push({ ...task, type: 'task', color: task.completed ? '#10b981' : '#f59e0b' });
        }
      });
    }

    if (habits) {
      habits.forEach(habit => {
        if (habit.completedDates && habit.completedDates.includes(dateStr)) {
          allItems.push({ ...habit, type: 'habit', color: '#10b981' });
        }
      });
    }

    return allItems;
  };

  return (
    <div className="week-view">
      <div className="week-header">
        {weekDays.map((day, idx) => {
          const isToday = day.toDateString() === today;
          return (
            <div 
              key={idx} 
              className={`week-day-header ${isToday ? 'today' : ''}`}
              onClick={() => onDayClick(day)}
            >
              <div className="week-day-name">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="week-day-number">{day.getDate()}</div>
            </div>
          );
        })}
      </div>

      <div className="week-grid">
        {weekDays.map((day, dayIdx) => {
          const items = getItemsForDay(day);
          const isToday = day.toDateString() === today;
          
          return (
            <div 
              key={dayIdx} 
              className={`week-day-column ${isToday ? 'today' : ''}`}
            >
              {items.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className={`week-event ${item.type}`}
                  style={{ backgroundColor: item.color }}
                  onClick={() => onItemClick(item)}
                >
                  <div className="week-event-time">
                    {item.startTime || 'All day'}
                  </div>
                  <div className="week-event-title">
                    {item.title || item.name || item.text}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
