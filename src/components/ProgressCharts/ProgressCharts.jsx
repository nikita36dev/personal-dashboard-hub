import { useState, useEffect } from 'react';
import TaskChart from './TaskChart';
import HabitChart from './HabitChart';
import storage  from '../../utils/localStorage';
import '../../styles/ProgressCharts.css';

const ProgressCharts = () => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [pomodoroStats, setPomodoroStats] = useState({});

  useEffect(() => {
    setTasks(storage.getTasks());
    setHabits(storage.getHabits());
    setGoals(storage.getGoals());
    setPomodoroStats(storage.getPomodoroStats());
  }, []);

  const calculateProductivityScore = () => {
    let score = 0;
    
    // Tasks completion (max 30 points)
    const completedTasks = tasks.filter(t => t.completed).length;
    const taskScore = tasks.length > 0 ? (completedTasks / tasks.length) * 30 : 0;
    score += taskScore;
    
    // Habits completion (max 30 points)
    const totalHabitCompletions = habits.reduce((sum, h) => 
      sum + (h.completedDates ? h.completedDates.length : 0), 0
    );
    const habitScore = habits.length > 0 ? Math.min((totalHabitCompletions / habits.length) * 3, 30) : 0;
    score += habitScore;
    
    // Goals completion (max 20 points)
    const completedGoals = goals.filter(g => g.completed).length;
    const goalScore = goals.length > 0 ? (completedGoals / goals.length) * 20 : 0;
    score += goalScore;
    
    // Pomodoro sessions (max 20 points)
    const pomodoroScore = Math.min(pomodoroStats.completedSessions * 2, 20);
    score += pomodoroScore;
    
    return Math.round(score);
  };

  const getScoreDescription = (score) => {
    if (score >= 80) return 'Outstanding productivity! 🌟';
    if (score >= 60) return 'Great work! Keep it up! 💪';
    if (score >= 40) return 'Good progress! Room to improve 📈';
    if (score >= 20) return 'Getting started! Stay consistent 🎯';
    return 'Let\'s build momentum! 🚀';
  };

  const productivityScore = calculateProductivityScore();

  return (
    <div className="progress-charts">
      <div className="charts-container">
        <TaskChart tasks={tasks} />
        <HabitChart habits={habits} />
        
        <div className="productivity-score">
          <div className="score-title">Productivity Score</div>
          <div className="score-value">{productivityScore}/100</div>
          <div className="score-description">{getScoreDescription(productivityScore)}</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCharts;
