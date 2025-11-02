import '../../styles/PomodoroTimer.css';

const TimerDisplay = ({ minutes, seconds, mode, sessionCount, totalDuration, currentDuration, isRunning }) => {
  const progressPercentage = totalDuration > 0 
    ? ((totalDuration - currentDuration) / totalDuration) * 100 
    : 0;

  return (
    <div className="timer-display">
      <div className="timer-mode">{mode}</div>
      <div className={`timer-time ${isRunning ? 'running' : ''}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="timer-session-count">
        Session #{sessionCount + 1}
      </div>
      <div className="timer-progress">
        <div 
          className="timer-progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default TimerDisplay;
