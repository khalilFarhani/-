'use client';

import { useTheme } from './ThemeProvider';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      onTouchEnd={(e) => { e.preventDefault(); toggleTheme(); }}
      className="btn-smooth btn-smooth-outline group shadow-md"
      style={{ minWidth: 44, minHeight: 44, padding: '10px', touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400" strokeWidth={2.5} />
      )}
    </button>
  );
}
