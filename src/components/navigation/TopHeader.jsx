import React from 'react';
import BackButton from './BackButton';
import { Bell } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

/**
 * Top Header Component
 * Flexible header supporting:
 * 1. Sub-page Mode: Back Button + Title + optional Right Action (Screens 9, 10, 11, 13, 14, 15, 16, 17)
 * 2. Greeting Mode: "Good Morning, [Name] 👋" + Subtitle + Notifications + Avatar (Screen 8)
 */
export const TopHeader = ({
  title,
  subtitle,
  greetingName,
  greetingTime = 'Good Morning,',
  showBack = false,
  onBack,
  backTo,
  rightElement,
  showNotification = false,
  hasUnreadNotification = true,
  showThemeToggle = true,
  userAvatar,
  className = '',
}) => {
  // Mode 1: Greeting Header (Dashboard)
  if (greetingName) {
    return (
      <header className={`w-full flex items-center justify-between py-4 ${className}`}>
        <div>
          <span className="text-xs sm:text-sm font-medium text-medisetu-muted dark:text-slate-400 block">
            {greetingTime}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-medisetu-navy dark:text-white flex items-center gap-1.5 mt-0.5">
            {greetingName} <span className="inline-block animate-wave">👋</span>
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-medisetu-muted dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        {/* Right Actions: Theme Toggle + Notification Bell + User Avatar */}
        <div className="flex items-center gap-2.5">
          {showThemeToggle && <ThemeToggle />}
          
          {showNotification && (
            <button
              type="button"
              aria-label="Notifications"
              className="relative p-2.5 rounded-xl text-medisetu-navy dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {hasUnreadNotification && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-medisetu-danger rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          )}
          {userAvatar && (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-xs bg-blue-100 flex items-center justify-center text-medisetu-primary font-bold">
              {typeof userAvatar === 'string' ? (
                <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                userAvatar
              )}
            </div>
          )}
          {rightElement}
        </div>
      </header>
    );
  }

  // Mode 2: Standard Sub-Page Header with Back Button
  return (
    <header className={`w-full flex items-center justify-between py-4 ${className}`}>
      <div className="flex items-center gap-3">
        {showBack && <BackButton onClick={onBack} to={backTo} />}
        {title && (
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-medisetu-navy dark:text-white leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-medisetu-muted dark:text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        )}
      </div>

      {/* Right Elements (Theme toggle + optional right actions) */}
      <div className="flex items-center gap-2">
        {showThemeToggle && <ThemeToggle />}
        {rightElement}
      </div>
    </header>
  );
};

export default TopHeader;
