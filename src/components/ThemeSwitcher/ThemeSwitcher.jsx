import { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Icons } from '../../assets/icons';
import '../../styles/ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const themes = [
    { 
      name: 'dark', 
      icon: Icons.Moon, 
      label: 'Dark Mode',
      description: 'Dark theme for night'
    },
    { 
      name: 'daylight', 
      icon: Icons.Sun, 
      label: 'Light Mode',
      description: 'Bright & clean'
    },
    { 
      name: 'eye-protection', 
      icon: Icons.Eye, 
      label: 'Eye Care',
      description: 'Warm & easy on eyes'
    }
  ];

  return (
    <div className="theme-switcher">
      <div className="theme-buttons">
        {themes.map((t) => (
          <button
            key={t.name}
            className={`theme-btn ${theme === t.name ? 'active' : ''}`}
            onClick={() => toggleTheme(t.name)}
            title={t.label}
          >
            <t.icon />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
