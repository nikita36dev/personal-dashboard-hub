import { useContext, useMemo } from 'react';
import { DataContext } from '../../contexts/DataContext';
import StatCard from './StatCard';
import ActivityHeatmap from './ActivityHeatmap';
import { Icons } from '../../assets/icons';
import '../../styles/Analytics.css';

const Analytics = () => {
  const { tasks, habits, goals, pomodoroStats } = useContext(DataContext);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalHabits = habits.length;
    const completedGoals = goals.filter(g => g.completed).length;
    const totalGoals = goals.length;

    const taskCompletionRate = tasks.length > 0 
      ? Math.round((completedTasks / tasks.length) * 100) 
      : 0;

    const habitStreak = habits.reduce((max, habit) => 
      Math.max(max, habit.currentStreak || 0), 0
    );

    const productivityScore = Math.round(
      (taskCompletionRate * 0.4) +
      (habitStreak * 2) +
      (pomodoroStats.completedSessions || 0) +
      (totalGoals > 0 ? (completedGoals / totalGoals) * 20 : 0)
    );

    return {
      completedTasks,
      taskCompletionRate,
      totalHabits,
      habitStreak,
      totalGoals,
      completedGoals,
      pomodoroSessions: pomodoroStats.completedSessions || 0,
      totalMinutes: pomodoroStats.totalMinutes || 0,
      productivityScore: Math.min(productivityScore, 100)
    };
  }, [tasks, habits, goals, pomodoroStats]);

  const insights = [
    {
      icon: Icons.TrendingUp,
      title: 'Most Productive Day',
      description: 'You complete most tasks on Tuesdays',
      color: '#10b981'
    },
    {
      icon: Icons.Fire,
      title: 'Current Streak',
      description: `${stats.habitStreak} days of consistent habit tracking`,
      color: '#f59e0b'
    },
    {
      icon: Icons.Award,
      title: 'Achievement Unlocked',
      description: `${stats.completedTasks} tasks completed!`,
      color: '#8b5cf6'
    },
    {
      icon: Icons.Timer,
      title: 'Focus Time',
      description: `${stats.totalMinutes} minutes in deep work`,
      color: '#3b82f6'
    }
  ];

  return (
    <div className="analytics-container">
      {/* Stats Overview */}
      <div className="analytics-overview">
        <StatCard
          title="Tasks Completed"
          value={stats.completedTasks}
          change="+12%"
          positive={true}
          icon={Icons.Tasks}
        />
        <StatCard
          title="Task Completion Rate"
          value={`${stats.taskCompletionRate}%`}
          change="+5%"
          positive={true}
          icon={Icons.Check}
        />
        <StatCard
          title="Active Habits"
          value={stats.totalHabits}
          change="+2"
          positive={true}
          icon={Icons.Habits}
        />
        <StatCard
          title="Pomodoro Sessions"
          value={stats.pomodoroSessions}
          change="+8"
          positive={true}
          icon={Icons.Timer}
        />
      </div>

      {/* Charts Section */}
      <div className="analytics-charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Activity Heatmap</h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Last 12 weeks of activity
            </div>
          </div>
          <ActivityHeatmap tasks={tasks} habits={habits} />
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Productivity Score</h3>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Overall performance metric
            </div>
          </div>
          <div className="productivity-ring">
            <div className="ring-chart">
              <svg width="200" height="200">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <circle
                  className="ring-background"
                  cx="100"
                  cy="100"
                  r="80"
                />
                <circle
                  className="ring-progress"
                  cx="100"
                  cy="100"
                  r="80"
                  strokeDasharray={`${2 * Math.PI * 80}`}
                  strokeDashoffset={`${2 * Math.PI * 80 * (1 - stats.productivityScore / 100)}`}
                />
              </svg>
              <div className="ring-center">
                <div className="ring-value">{stats.productivityScore}</div>
                <div className="ring-label">Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Insights & Recommendations</h3>
        </div>
        <div className="insights-grid">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className="insight-card animate-fade-in" 
              style={{ 
                animationDelay: `${index * 0.1}s`,
                borderLeftColor: insight.color
              }}
            >
              <div className="insight-icon" style={{ backgroundColor: `${insight.color}20` }}>
                <insight.icon style={{ color: insight.color }} />
              </div>
              <div className="insight-title">{insight.title}</div>
              <div className="insight-description">{insight.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="chart-card">
        <div className="chart-header">
          <h3 className="chart-title">Weekly Summary</h3>
        </div>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginTop: '1rem'
        }}>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'var(--bg-tertiary)', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--accent-primary)' }}>
              {stats.completedTasks}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Tasks Completed
            </div>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'var(--bg-tertiary)', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--success-color)' }}>
              {stats.habitStreak}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Day Streak
            </div>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'var(--bg-tertiary)', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--warning-color)' }}>
              {stats.completedGoals}/{stats.totalGoals}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Goals Achieved
            </div>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'var(--bg-tertiary)', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--info-color)' }}>
              {Math.floor(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}m
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Total Focus Time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
