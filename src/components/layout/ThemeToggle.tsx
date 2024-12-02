import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

function ThemeToggle(): JSX.Element{
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved: string|null = localStorage.getItem('theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setIsDark(!isDark)}
      aria-label="テーマ切り替え"
    >
      <FontAwesomeIcon 
        icon={isDark ? faMoon : faSun}
        className="theme-icon"
      />
    </button>
  );
}

export default ThemeToggle;