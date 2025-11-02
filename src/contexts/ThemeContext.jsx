import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('appTheme');
    return saved || 'dark';
  });

  // Save to localStorage aur apply theme
  useEffect(() => {
    localStorage.setItem('appTheme', theme);
    
    // Remove all theme classes
    document.body.classList.remove('dark', 'daylight', 'eye-protection');
    
    // Add current theme class
    if (theme !== 'dark') {
      document.body.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
