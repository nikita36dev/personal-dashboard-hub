import '../../styles/ProgressCharts.css';

const TaskChart = ({ tasks }) => {
  const categories = ['Work', 'Personal', 'Urgent', 'Shopping', 'Health'];
  
  const getCategoryCount = (category) => {
    return tasks.filter(task => task.category === category).length;
  };

  const getCompletedCount = (category) => {
    return tasks.filter(task => task.category === category && task.completed).length;
  };

  const maxCount = Math.max(...categories.map(cat => getCategoryCount(cat)), 1);

  return (
    <div className="chart-section">
      <h3 className="chart-title">Tasks by Category</h3>
      
      <div className="chart-stats">
        <div className="stat-card">
          <div className="stat-card-value">{tasks.length}</div>
          <div className="stat-card-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{tasks.filter(t => t.completed).length}</div>
          <div className="stat-card-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-value">{tasks.filter(t => !t.completed).length}</div>
          <div className="stat-card-label">Active</div>
        </div>
      </div>

      <div className="chart-visual">
        {tasks.length === 0 ? (
          <div className="no-data-message">No task data available</div>
        ) : (
          <div className="chart-bars">
            {categories.map(category => {
              const count = getCategoryCount(category);
              const completed = getCompletedCount(category);
              const height = (count / maxCount) * 100;
              
              return (
                <div key={category} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div 
                    className="chart-bar" 
                    style={{ height: `${height}%` }}
                    title={`${category}: ${count} tasks (${completed} completed)`}
                  >
                    <span className="bar-value">{count}</span>
                  </div>
                  <span className="bar-label">{category}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskChart;
