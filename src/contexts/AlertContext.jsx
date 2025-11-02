import { createContext, useState, useCallback } from 'react';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now();
    const alert = { id, message, type };

    setAlerts(prev => [...prev, alert]);

    if (duration > 0) {
      setTimeout(() => {
        setAlerts(prev => prev.filter(a => a.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const showSuccess = (message, duration) => showAlert(message, 'success', duration);
  const showError = (message, duration) => showAlert(message, 'error', duration);
  const showWarning = (message, duration) => showAlert(message, 'warning', duration);
  const showInfo = (message, duration) => showAlert(message, 'info', duration);

  return (
    <AlertContext.Provider value={{
      showAlert,
      removeAlert,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      alerts
    }}>
      {children}
    </AlertContext.Provider>
  );
};
