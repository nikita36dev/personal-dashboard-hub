import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import Login from './pages/Login/Login';
import MainLayout from './layouts/MainLayout';
import AlertSystem from './components/AlertSystem/AlertSystem';
import { AlertProvider } from './contexts/AlertContext';
import authService from './utils/authService';
import './styles/global.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    if (savedUser) {
      setUser(savedUser);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#0f172a',
        color: '#f1f5f9'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AlertProvider>
        <DataProvider>
          {isLoggedIn ? (
            <MainLayout user={user} onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          <AlertSystem />
        </DataProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
