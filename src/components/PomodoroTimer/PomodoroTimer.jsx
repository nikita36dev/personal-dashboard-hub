import { useState, useEffect, useRef, useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';
import { AlertContext } from '../../contexts/AlertContext';
import TimerDisplay from './TimerDisplay';
import TimerControls from './TimerControls';
import storage from '../../utils/localStorage';
import notifications from '../../utils/notifications';
import { Timer, Award, Settings, BarChart3, X } from 'lucide-react';
import '../../styles/PomodoroTimer.css';

const PomodoroTimer = () => {
  const { pomodoroStats, savePomodoroStats } = useContext(DataContext);
  const { showSuccess, showInfo } = useContext(AlertContext);
  
  const [settings, setSettings] = useState(storage.getPomodoroSettings());
  const [mode, setMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(() => {
    return storage.getItem('pomodoroSessionCount', 0);
  });
  const [completedSessions, setCompletedSessions] = useState(() => {
    return storage.getItem('pomodoroCompletedSessions', 0);
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const intervalRef = useRef(null);

  // Save session count to localStorage whenever it changes
  useEffect(() => {
    storage.setItem('pomodoroSessionCount', sessionCount);
    console.log('Saved sessionCount to localStorage:', sessionCount);
  }, [sessionCount]);

  // Save completed sessions to localStorage whenever it changes
  useEffect(() => {
    storage.setItem('pomodoroCompletedSessions', completedSessions);
    console.log('Saved completedSessions to localStorage:', completedSessions);
  }, [completedSessions]);

  // On component mount: Check if timer is running from localStorage
  useEffect(() => {
    const timerData = storage.getPomodoroRunning();
    
    if (timerData) {
      console.log('Found running timer in localStorage:', timerData);
      
      const startTime = timerData.startTime;
      const duration = timerData.duration;
      const currentSystemTime = Date.now();
      const elapsedTime = Math.floor((currentSystemTime - startTime) / 1000);
      const remainingTime = duration - elapsedTime;
      
      console.log('Start time:', new Date(startTime));
      console.log('Current time:', new Date(currentSystemTime));
      console.log('Duration:', duration, 'seconds');
      console.log('Elapsed:', elapsedTime, 'seconds');
      console.log('Remaining:', remainingTime, 'seconds');
      
      if (remainingTime > 0) {
        setMode(timerData.mode);
        setTimeLeft(remainingTime);
        setIsRunning(true);
      } else {
        console.log('Timer finished! Playing sound...');
        playNotificationSound();
        storage.removePomodoroRunning();
        setTimeLeft(0);
        setIsRunning(false);
      }
    }
  }, []);

  // Main timer effect - runs every second
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          
          if (newTime === 0) {
            console.log('Timer completed!');
            playNotificationSound();
            notifications.pomodoroComplete(mode === 'work' ? 'work' : 'break');
            setIsRunning(false);
            storage.removePomodoroRunning();
            handleTimerComplete();
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, mode]);

  const handleTimerComplete = () => {
    if (mode === 'work') {
      const newCompletedSessions = completedSessions + 1;
      setCompletedSessions(newCompletedSessions);
      
      const newStats = {
        ...pomodoroStats,
        completedSessions: (pomodoroStats?.completedSessions || 0) + 1,
        totalMinutes: (pomodoroStats?.totalMinutes || 0) + settings.workDuration,
        totalSessions: (pomodoroStats?.totalSessions || 0) + 1
      };
      savePomodoroStats(newStats);

      showSuccess('Work session completed! Time for a break!');

      if (newCompletedSessions % settings.sessionsBeforeLongBreak === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }

      if (settings.autoStartBreaks) {
        setTimeout(() => {
          handleStart();
        }, 1000);
      }
    } else {
      showSuccess('Break complete! Ready for the next session?');
      switchMode('work');
      
      if (settings.autoStartPomodoros) {
        setTimeout(() => {
          handleStart();
        }, 1000);
      }
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    
    if (newMode === 'work') {
      setTimeLeft(settings.workDuration * 60 + settings.workSeconds);
      setSessionCount(prev => prev + 1);
    } else if (newMode === 'shortBreak') {
      setTimeLeft(settings.breakDuration * 60 + settings.breakSeconds);
    } else if (newMode === 'longBreak') {
      setTimeLeft(settings.longBreakDuration * 60 + settings.longBreakSeconds);
    }
    
    setIsRunning(false);
  };

  const handleStart = () => {
    if (!currentTask && mode === 'work') {
      const task = prompt('What are you working on?');
      if (task) {
        setCurrentTask(task);
      } else {
        return;
      }
    }

    const durationInSeconds = timeLeft;
    const startTimeMs = Date.now();
    
    const timerData = {
      startTime: startTimeMs,
      duration: durationInSeconds,
      mode: mode
    };
    
    console.log('Saving timer to localStorage:', timerData);
    storage.savePomodoroRunning(timerData);
    setIsRunning(true);
    showInfo('Timer started! Stay focused!');
  };

  const handlePause = () => {
    setIsRunning(false);
    showInfo('Timer paused');
  };

  const handleReset = () => {
    setIsRunning(false);
    storage.removePomodoroRunning();
    
    if (mode === 'work') {
      setTimeLeft(settings.workDuration * 60 + settings.workSeconds);
    } else if (mode === 'shortBreak') {
      setTimeLeft(settings.breakDuration * 60 + settings.breakSeconds);
    } else {
      setTimeLeft(settings.longBreakDuration * 60 + settings.longBreakSeconds);
    }
    
    showInfo('Timer reset');
  };

  const handleSkip = () => {
    setIsRunning(false);
    storage.removePomodoroRunning();
    setTimeLeft(0);
    showSuccess('Session skipped');
    handleTimerComplete();
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: parseInt(value) || value };
    setSettings(newSettings);
    storage.savePomodoroSettings(newSettings);
    
    if (!isRunning) {
      if (mode === 'work') {
        setTimeLeft(newSettings.workDuration * 60 + (newSettings.workSeconds || 0));
      } else if (mode === 'shortBreak') {
        setTimeLeft(newSettings.breakDuration * 60 + (newSettings.breakSeconds || 0));
      } else {
        setTimeLeft(newSettings.longBreakDuration * 60 + (newSettings.longBreakSeconds || 0));
      }
    }
    showInfo('Settings updated');
  };

  const playNotificationSound = () => {
    if (settings.soundEnabled) {
      try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);
      } catch (error) {
        console.error('Audio error:', error);
      }
    }
  };

  const getTotalDurationForDisplay = () => {
    if (mode === 'work') return settings.workDuration * 60 + (settings.workSeconds || 0);
    if (mode === 'shortBreak') return settings.breakDuration * 60 + (settings.breakSeconds || 0);
    return settings.longBreakDuration * 60 + (settings.longBreakSeconds || 0);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const modeLabels = {
    work: 'Work Session',
    shortBreak: 'Short Break',
    longBreak: 'Long Break'
  };

  return (
    <div className="pomodoro-timer">
      <div className="timer-mode-selector">
        <button
          className={`mode-btn ${mode === 'work' ? 'active' : ''}`}
          onClick={() => !isRunning && switchMode('work')}
          disabled={isRunning}
        >
          <Timer size={18} />
          Work
        </button>
        <button
          className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => !isRunning && switchMode('shortBreak')}
          disabled={isRunning}
        >
          <Award size={18} />
          Short Break
        </button>
        <button
          className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => !isRunning && switchMode('longBreak')}
          disabled={isRunning}
        >
          <Award size={18} />
          Long Break
        </button>
      </div>

      {currentTask && mode === 'work' && (
        <div className="current-task">
          <div className="task-label">Working on:</div>
          <div className="task-name">{currentTask}</div>
          <button 
            className="task-clear-btn"
            onClick={() => setCurrentTask('')}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <TimerDisplay
        minutes={minutes}
        seconds={seconds}
        mode={modeLabels[mode]}
        sessionCount={sessionCount}
        totalDuration={getTotalDurationForDisplay()}
        currentDuration={timeLeft}
        isRunning={isRunning}
      />

      <TimerControls
        isRunning={isRunning}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onSkip={handleSkip}
      />

      <div className="session-progress">
        <div className="progress-label">
          Sessions: {completedSessions % settings.sessionsBeforeLongBreak} / {settings.sessionsBeforeLongBreak}
        </div>
        <div className="session-dots">
          {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
            <div
              key={i}
              className={`session-dot ${i < (completedSessions % settings.sessionsBeforeLongBreak) ? 'completed' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="timer-actions">
        <button 
          className="btn btn-secondary"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings size={18} />
          Settings
        </button>
        <button 
          className="btn btn-secondary"
          onClick={() => setShowStats(!showStats)}
        >
          <BarChart3 size={18} />
          Statistics
        </button>
      </div>

      {showSettings && (
        <div className="timer-settings animate-fade-in">
          <h3 className="settings-title">
            <Settings size={20} />
            Timer Settings
          </h3>
          <div className="settings-grid">
            {/* Work Duration */}
            <div className="setting-item">
              <label className="setting-label">Work Duration (minutes)</label>
              <input
                type="number"
                className="setting-input"
                value={settings.workDuration}
                onChange={(e) => handleSettingChange('workDuration', e.target.value)}
                min="1"
                max="60"
              />
            </div>

            <div className="setting-item">
              <label className="setting-label">Work Duration (seconds)</label>
              <input
                type="number"
                className="setting-input"
                value={settings.workSeconds || 0}
                onChange={(e) => handleSettingChange('workSeconds', e.target.value)}
                min="0"
                max="59"
              />
            </div>

            {/* Short Break */}
            <div className="setting-item">
              <label className="setting-label">Short Break (minutes)</label>
              <input
                type="number"
                className="setting-input"
                value={settings.breakDuration}
                onChange={(e) => handleSettingChange('breakDuration', e.target.value)}
                min="1"
                max="30"
              />
            </div>

            <div className="setting-item">
              <label className="setting-label">Short Break (seconds)</label>
              <input
                type="number"
                className="setting-input"
                value={settings.breakSeconds || 0}
                onChange={(e) => handleSettingChange('breakSeconds', e.target.value)}
                min="0"
                max="59"
              />
            </div>

            {/* Long Break */}
            <div className="setting-item">
              <label className="setting-label">Long Break (minutes)</label>
              <input
                type="number"
                className="setting-input"
                value={settings.longBreakDuration}
                onChange={(e) => handleSettingChange('longBreakDuration', e.target.value)}
                min="1"
                max="60"
              />
            </div>

            <div className="setting-item">
              <label className="setting-label">Long Break (seconds)</label>
              <input
                type="number"
                className="setting-input"
                value={settings.longBreakSeconds || 0}
                onChange={(e) => handleSettingChange('longBreakSeconds', e.target.value)}
                min="0"
                max="59"
              />
            </div>

            <div className="setting-item">
              <label className="setting-label">Sessions Before Long Break</label>
              <input
                type="number"
                className="setting-input"
                value={settings.sessionsBeforeLongBreak}
                onChange={(e) => handleSettingChange('sessionsBeforeLongBreak', e.target.value)}
                min="2"
                max="10"
              />
            </div>
          </div>

          <div className="settings-toggles">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => handleSettingChange('autoStartBreaks', e.target.checked)}
              />
              <span>Auto-start breaks</span>
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.autoStartPomodoros}
                onChange={(e) => handleSettingChange('autoStartPomodoros', e.target.checked)}
              />
              <span>Auto-start pomodoros</span>
            </label>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
              />
              <span>Sound notifications</span>
            </label>
          </div>
        </div>
      )}

      {showStats && (
        <div className="timer-stats animate-fade-in">
          <h3 className="settings-title">
            <BarChart3 size={20} />
            Your Statistics
          </h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{pomodoroStats?.totalSessions || 0}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{pomodoroStats?.completedSessions || 0}</div>
              <div className="stat-label">Completed</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{pomodoroStats?.totalMinutes || 0}</div>
              <div className="stat-label">Total Minutes</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{Math.floor((pomodoroStats?.totalMinutes || 0) / 60)}h</div>
              <div className="stat-label">Total Hours</div>
            </div>
          </div>
          
          <div className="stats-summary">
            <div className="summary-card">
              <div className="summary-text">
                <div className="summary-value">
                  {completedSessions > 0 ? `${completedSessions} sessions today` : 'No sessions yet'}
                </div>
                <div className="summary-label">Keep up the momentum!</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTimer;
