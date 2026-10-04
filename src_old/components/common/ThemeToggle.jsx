import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

/**
 * Reusable ThemeToggle Component
 * Smooth micro-animated toggle between Light & Dark mode.
 */
export const ThemeToggle = ({
  variant = 'icon', // 'icon' | 'pill' | 'switch'
  className = '',
}) => {
  const { theme, toggleTheme, isDark } = useTheme();

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 active:scale-95 ${
          isDark
            ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
            : 'bg-blue-50 text-medisetu-navy border-blue-200 hover:bg-blue-100'
        } ${className}`}
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-medisetu-primary" />}
        </motion.div>
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    );
  }

  if (variant === 'switch') {
    return (
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
          isDark ? 'bg-medisetu-primary' : 'bg-slate-200'
        } ${className}`}
      >
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          className={`bg-white w-4 h-4 rounded-full shadow-md flex items-center justify-center ${
            isDark ? 'translate-x-6' : 'translate-x-0'
          }`}
        >
          {isDark ? (
            <Moon className="w-2.5 h-2.5 text-medisetu-primary" />
          ) : (
            <Sun className="w-2.5 h-2.5 text-amber-500" />
          )}
        </motion.div>
      </button>
    );
  }

  // Default: Icon button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`p-2 rounded-xl border transition-all duration-150 active:scale-95 flex items-center justify-center ${
        isDark
          ? 'bg-slate-800/90 text-amber-400 border-slate-700 hover:bg-slate-750 hover:border-slate-600'
          : 'bg-white/90 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300 shadow-xs'
      } ${className}`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -45, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-medisetu-slate" />
        )}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;
