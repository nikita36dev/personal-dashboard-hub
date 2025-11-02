import dateHelpers from '../../utils/dateHelpers';

const CalendarView = ({ currentDate, events, tasks, habits, goals, onDayClick, onEventClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendar = dateHelpers.getMonthCalendar(year, month);
  const today = new Date().toDateString();

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (day) => {
    if (!day) return [];
    
    const dateStr = new Date(year, month, day).toDateString();
    const allEvents = [];

    // Add calendar events
    if (events && events.length > 0) {
      events.forEach(event => {
        if (event.date && new Date(event.date).toDateString() === dateStr) {
          allEvents.push({ 
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
        if (task.dueDate && new Date(task.dueDate).toDateString() === dateStr && !task.completed) {
          allEvents.push({ 
            id: `task-${task.id}`, 
            title: task.title, 
            type: 'task' 
          });
        }
      });
    }

    // Add habits completed today
    if (habits && habits.length > 0) {
      habits.forEach(habit => {
        if (habit.completedDates && habit.completedDates.includes(dateStr)) {
          allEvents.push({ 
            id: `habit-${habit.id}`, 
            title: habit.name, 
            type: 'habit' 
          });
        }
      });
    }

    return allEvents;
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
          const dayEvents = day ? getEventsForDay(day) : [];

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
                    {dayEvents.slice(0, 3).map((event, idx) => (
                      <div
                        key={`${event.id}-${idx}`}
                        className={`day-event ${event.type}`}
                        style={event.type === 'event' && event.color ? { backgroundColor: event.color } : {}}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (event.type === 'event') {
                            onEventClick(event);
                          }
                        }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="day-event" style={{ backgroundColor: 'var(--text-tertiary)', fontSize: '0.7rem' }}>
                        +{dayEvents.length - 3} more
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

export default CalendarView;
