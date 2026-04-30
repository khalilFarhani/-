'use client';

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn-smooth btn-smooth-outline !p-2.5 group shadow-xl"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? (
        <div className="flex items-center gap-3">
           <svg
             xmlns="http://www.w3.org/2000/svg"
             width="18"
             height="18"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             strokeWidth="3"
             strokeLinecap="round"
             strokeLinejoin="round"
             className="text-yellow-500 group-hover:rotate-45 transition-transform duration-500"
           >
             <circle cx="12" cy="12" r="4" />
             <path d="M12 2v2" />
             <path d="M12 20v2" />
             <path d="m4.93 4.93 1.41 1.41" />
             <path d="m17.66 17.66 1.41 1.41" />
             <path d="M2 12h2" />
             <path d="M20 12h2" />
             <path d="m6.34 17.66-1.41 1.41" />
             <path d="m19.07 4.93-1.41 1.41" />
           </svg>

        </div>
      ) : (
        <div className="flex items-center gap-3">
           <svg
             xmlns="http://www.w3.org/2000/svg"
             width="18"
             height="18"
             viewBox="0 0 24 24"
             fill="none"
             stroke="currentColor"
             strokeWidth="3"
             strokeLinecap="round"
             strokeLinejoin="round"
             className="text-primary group-hover:-rotate-12 transition-transform duration-500"
           >
             <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
           </svg>

        </div>
      )}
    </button>
  );
}
