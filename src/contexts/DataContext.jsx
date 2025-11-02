import { createContext, useState, useEffect } from 'react';
import storage from '../utils/localStorage';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [pomodoroStats, setPomodoroStats] = useState({});

  // Load from localStorage on mount
  useEffect(() => {
    const savedTasks = storage.getTasks();
    const savedHabits = storage.getHabits();
    const savedGoals = storage.getGoals();
    const savedNotes = storage.getNotes();
    const savedStats = storage.getPomodoroStats();

    if (savedTasks.length > 0) setTasks(savedTasks);
    if (savedHabits.length > 0) setHabits(savedHabits);
    if (savedGoals.length > 0) setGoals(savedGoals);
    if (savedNotes.length > 0) setNotes(savedNotes);
    if (Object.keys(savedStats).length > 0) setPomodoroStats(savedStats);
  }, []);

  // Save functions
  const saveNotes = (updatedTasks) => {
    setTasks(updatedTasks);
    storage.saveTasks(updatedTasks);
  };

  const saveHabits = (updatedHabits) => {
    setHabits(updatedHabits);
    storage.saveHabits(updatedHabits);
  };

  const saveGoals = (updatedGoals) => {
    setGoals(updatedGoals);
    storage.saveGoals(updatedGoals);
  };

  const saveNotesData = (updatedNotes) => {
    setNotes(updatedNotes);
    storage.saveNotes(updatedNotes);
  };

  const savePomodoroStats = (updatedStats) => {
    setPomodoroStats(updatedStats);
    storage.savePomodoroStats(updatedStats);
  };

  return (
    <DataContext.Provider value={{
      tasks,
      habits,
      goals,
      notes,
      pomodoroStats,
      saveNotes,
      saveHabits,
      saveGoals,
      saveNotesData,
      savePomodoroStats
    }}>
      {children}
    </DataContext.Provider>
  );
};
