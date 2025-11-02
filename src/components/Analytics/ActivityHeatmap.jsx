import { useMemo } from 'react';

const ActivityHeatmap = ({ tasks, habits }) => {
  const heatmapData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    // Generate last 12 weeks of data (84 days)
    for (let week = 11; week >= 0; week--) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + (6 - day)));
        const dateStr = date.toDateString();
        
        // Count activities for this day
        const taskCount = tasks.filter(t => 
          t.completed && t.createdAt && new Date(t.createdAt).toDateString() === dateStr
        ).length;
        
        const habitCount = habits.filter(h => 
          h.completedDates && h.completedDates.includes(dateStr)
        ).length;
        
        const totalActivity = taskCount + habitCount;
        
        // Determine level (0-4) based on activity
        let level = 0;
        if (totalActivity > 0) level = 1;
        if (totalActivity > 2) level = 2;
        if (totalActivity > 4) level = 3;
        if (totalActivity > 6) level = 4;
        
        data.push({
          date: dateStr,
          level,
          count: totalActivity
        });
      }
    }
    
    return data;
  }, [tasks, habits]);

  return (
    <div className="heatmap-container">
      <div className="heatmap-grid">
        {heatmapData.map((cell, index) => (
          <div
            key={index}
            className="heatmap-cell"
            data-level={cell.level}
            title={`${cell.date}: ${cell.count} activities`}
          />
        ))}
      </div>
      
      <div className="heatmap-legend">
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Less</span>
        <div className="legend-scale">
          {[0, 1, 2, 3, 4].map(level => (
            <div 
              key={level} 
              className="heatmap-cell" 
              data-level={level}
              style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '2px',
                margin: '0 2px'
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>More</span>
      </div>
    </div>
  );
};

export default ActivityHeatmap;
