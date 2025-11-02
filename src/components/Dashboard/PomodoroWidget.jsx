import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { Timer, Play, Pause } from 'lucide-react';
import storage from '../../utils/localStorage';
import '../../styles/Dashboard.css';

const PomodoroWidget = () => {
  const { pomodoroStats } = useContext(DataContext);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('work');
  const [settings, setSettings] = useState(storage.getPomodoroSettings());

  useEffect(() => {
    const timerData = storage.getPomodoroRunning();
    if (timerData) {
      setIsRunning(true);
      setMode(timerData.mode);
      
      const startTime = timerData.startTime;
      const duration = timerData.duration;
      const currentSystemTime = Date.now();
      const elapsedTime = Math.floor((currentSystemTime - startTime) / 1000);
      const remainingTime = duration - elapsedTime;
      
      setTimeLeft(Math.max(0, remainingTime));
    } else {
      setTimeLeft(settings.workDuration * 60);
    }
  }, []);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="pomodoro-widget">
      <div className="widget-header">
        <Timer size={20} />
        <h3>Pomodoro Timer</h3>
      </div>

      <div className="widget-timer">
        <span className="timer-display">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
        <span className="timer-mode">{mode === 'work' ? 'Work' : 'Break'}</span>
      </div>

      <div className="widget-stats">
        <div className="stat">
          <span className="stat-value">{pomodoroStats?.completedSessions || 0}</span>
          <span className="stat-label">Sessions</span>
        </div>
        <div className="stat">
          <span className="stat-value">{pomodoroStats?.totalMinutes || 0}m</span>
          <span className="stat-label">Worked</span>
        </div>
      </div>

      <div className="widget-status">
        {isRunning ? (
          <div className="status-badge running">
            <span className="pulse-dot"></span>
            Running
          </div>
        ) : (
          <div className="status-badge paused">
            <span className="pause-dot"></span>
            Ready
          </div>
        )}
      </div>

      <a href="#/pomodoro" className="widget-link">
        View Timer
      </a>
    </div>
  );
};

export default PomodoroWidget;
