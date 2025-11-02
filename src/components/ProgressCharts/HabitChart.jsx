import '../../styles/ProgressCharts.css';

const HabitChart = ({ habits }) => {
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push({
        date: date.toDateString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    return days;
  };

  const getCompletedHabitsForDay = (dateString) => {
    return habits.filter(habit => 
      habit.completedDates && habit.completedDates.includes(dateString)
    ).length;
  };

  const days = getLast7Days();
  const totalHabits = habits.length;
  const totalCompletions = habits.reduce((sum, habit) => 
    sum + (habit.completedDates ? habit.completedDates.length : 0), 0
  );
  const averageStreak = habits.length > 0 
    ? Math.round(habits.reduce((sum, habit) => sum + (habit.currentStreak || 0), 0) / habits.length)
    : 0;

  return (
    <div className="chart-section">
      <h3 className="chart-title">Habit Tracking Overview</h3>
      
      <div className="chart-stats">
        <div className="stat-card">
          <div className="stat-card-value">{totalHabits}</div>
          <div className="stat-card-label">Total Habits</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{totalCompletions}</div>
          <div className="stat-card-label">Completions</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{averageStreak}</div>
          <div className="stat-card-label">Avg Streak</div>
        </div>
      </div>

      <div className="chart-visual">
        {habits.length === 0 ? (
          <div className="no-data-message">No habit data available</div>
        ) : (
          <div className="weekly-overview">
            {days.map(day => {
              const completedCount = getCompletedHabitsForDay(day.date);
              const percentage = totalHabits > 0 ? (completedCount / totalHabits) * 100 : 0;
              
              return (
                <div 
                  key={day.date} 
                  className="day-card"
                  style={{ 
                    opacity: percentage > 0 ? 1 : 0.5,
                    borderColor: percentage > 50 ? 'var(--success-color)' : 'var(--border-color)'
                  }}
                >
                  <div className="day-name">{day.dayName}</div>
                  <div className="day-count">{completedCount}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitChart;
