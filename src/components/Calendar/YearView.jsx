const YearView = ({ currentDate, events, tasks, habits, onMonthClick }) => {
  const year = currentDate.getFullYear();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getMonthData = (monthIndex) => {
    const monthEvents = events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === monthIndex;
    });

    const monthTasks = tasks.filter(t => {
      if (!t.dueDate) return false;
      const taskDate = new Date(t.dueDate);
      return taskDate.getFullYear() === year && taskDate.getMonth() === monthIndex;
    });

    const monthHabits = habits.filter(h => {
      if (!h.completedDates) return false;
      return h.completedDates.some(dateStr => {
        const date = new Date(dateStr);
        return date.getFullYear() === year && date.getMonth() === monthIndex;
      });
    });

    return {
      events: monthEvents.length,
      tasks: monthTasks.length,
      habits: monthHabits.length,
      total: monthEvents.length + monthTasks.length + monthHabits.length
    };
  };

  return (
    <div className="year-view">
      {months.map((month, idx) => {
        const data = getMonthData(idx);
        const hasActivity = data.total > 0;
        
        return (
          <div
            key={idx}
            className={`year-month-card ${hasActivity ? 'has-activity' : ''}`}
            onClick={() => onMonthClick(idx)}
          >
            <div className="year-month-name">{month}</div>
            <div className="year-month-stats">
              {data.total > 0 ? (
                <>
                  <div className="year-stat">📅 {data.events}</div>
                  <div className="year-stat">✅ {data.tasks}</div>
                  <div className="year-stat">🔥 {data.habits}</div>
                </>
              ) : (
                <div className="year-stat-empty">No activity</div>
              )}
            </div>
            <div className="year-month-indicator" style={{
              backgroundColor: hasActivity ? 'var(--accent-primary)' : 'var(--border-color)',
              height: `${Math.min((data.total / 10) * 100, 100)}%`
            }} />
          </div>
        );
      })}
    </div>
  );
};

export default YearView;
