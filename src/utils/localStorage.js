// Enhanced localStorage with data versioning and backup
const STORAGE_VERSION = '2.0';
const STORAGE_PREFIX = 'dashboard_';

const storage = {
  // Get item with fallback
  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  },

  // Set item with error handling
  setItem(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
      console.log(`Saved ${key} to localStorage`);
      return true;
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
      return false;
    }
  },

  // Remove item
  removeItem(key) {
    try {
      localStorage.removeItem(STORAGE_PREFIX + key);
      console.log(`Removed ${key} from localStorage`);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },

  // Tasks
  getTasks: () => storage.getItem('tasks', []),
  saveTasks: (tasks) => storage.setItem('tasks', tasks),

  // Habits
  getHabits: () => storage.getItem('habits', []),
  saveHabits: (habits) => storage.setItem('habits', habits),

  // Daily Goals
  getGoals: () => storage.getItem('dailyGoals', []),
  saveGoals: (goals) => storage.setItem('dailyGoals', goals),

  // Notes
  getNotes: () => storage.getItem('notes', []),
  saveNotes: (notes) => storage.setItem('notes', notes),

  // Calendar Events
  getEvents: () => storage.getItem('events', []),
  saveEvents: (events) => storage.setItem('events', events),

  // Pomodoro Settings
  getPomodoroSettings: () => storage.getItem('pomodoroSettings', {
    workDuration: 25,
    breakDuration: 5,
    breakSeconds: 0,
    longBreakDuration: 15,
    longBreakSeconds: 0,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    soundEnabled: true
  }),
  savePomodoroSettings: (settings) => storage.setItem('pomodoroSettings', settings),

  // Pomodoro Stats
  getPomodoroStats: () => storage.getItem('pomodoroStats', {
    totalSessions: 0,
    completedSessions: 0,
    totalMinutes: 0,
    dailyStats: {},
    weeklyStats: {}
  }),
  savePomodoroStats: (stats) => storage.setItem('pomodoroStats', stats),

  // Pomodoro Running Timer
  getPomodoroRunning: () => storage.getItem('pomodoroTimerRunning', null),
  savePomodoroRunning: (timerData) => storage.setItem('pomodoroTimerRunning', timerData),
  removePomodoroRunning: () => storage.removeItem('pomodoroTimerRunning'),

  // User Settings
  getSettings: () => storage.getItem('settings', {
    theme: 'dark',
    notifications: true,
    soundEnabled: true,
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    startOfWeek: 'monday',
    defaultView: 'dashboard'
  }),
  saveSettings: (settings) => storage.setItem('settings', settings),

  // Analytics Data
  getAnalytics: () => storage.getItem('analytics', {
    tasksCompleted: [],
    habitsCompleted: [],
    pomodoroSessions: [],
    productivityScore: []
  }),
  saveAnalytics: (analytics) => storage.setItem('analytics', analytics),

  // Export all data
  exportAllData: () => {
    return {
      version: STORAGE_VERSION,
      exportDate: new Date().toISOString(),
      tasks: storage.getTasks(),
      habits: storage.getHabits(),
      goals: storage.getGoals(),
      notes: storage.getNotes(),
      events: storage.getEvents(),
      pomodoroSettings: storage.getPomodoroSettings(),
      pomodoroStats: storage.getPomodoroStats(),
      settings: storage.getSettings(),
      analytics: storage.getAnalytics()
    };
  },

  // Import data
  importAllData: (data) => {
    try {
      if (data.tasks) storage.saveTasks(data.tasks);
      if (data.habits) storage.saveHabits(data.habits);
      if (data.goals) storage.saveGoals(data.goals);
      if (data.notes) storage.saveNotes(data.notes);
      if (data.events) storage.saveEvents(data.events);
      if (data.pomodoroSettings) storage.savePomodoroSettings(data.pomodoroSettings);
      if (data.pomodoroStats) storage.savePomodoroStats(data.pomodoroStats);
      if (data.settings) storage.saveSettings(data.settings);
      if (data.analytics) storage.saveAnalytics(data.analytics);
      console.log('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  },

  // Clear all data
  clearAllData: () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    console.log('All data cleared');
  }
};

export default storage;
