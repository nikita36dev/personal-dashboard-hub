import { Icons } from '../../assets/icons';
import '../../styles/PomodoroTimer.css';

const TimerControls = ({ isRunning, onStart, onPause, onReset, onSkip }) => {
  return (
    <div className="timer-controls">
      <div className="controls-row primary">
        {!isRunning ? (
          <button className="timer-button primary" onClick={onStart}>
            <Icons.Play />
            <span>START</span>
          </button>
        ) : (
          <button className="timer-button primary pause" onClick={onPause}>
            <Icons.Pause />
            <span>PAUSE</span>
          </button>
        )}
      </div>

      <div className="controls-row secondary">
        <button className="timer-button secondary" onClick={onReset}>
          <Icons.Reset />
          <span>RESET</span>
        </button>
        
        <button className="timer-button secondary skip" onClick={onSkip}>
          <Icons.Skip />
          <span>SKIP TIMER</span>
        </button>
      </div>
    </div>
  );
};

export default TimerControls;
