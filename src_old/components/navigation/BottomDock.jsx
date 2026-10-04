import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, FileText, CreditCard, User } from 'lucide-react';

/**
 * Bottom Navigation Dock
 * Appears persistently across Patient pages (Figma Screens 8, 9, 13, 14, 16, 17, 18)
 */
export const BottomDock = () => {
  const navItems = [
    { label: 'Home', to: '/dashboard', icon: Home },
    { label: 'Appointments', to: '/doctors', icon: Calendar },
    { label: 'Records', to: '/records', icon: FileText },
    { label: 'Bills', to: '/bills', icon: CreditCard },
    { label: 'Profile', to: '/profile', icon: User },
  ];

  return (
    <nav
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-dock rounded-3xl px-5 sm:px-8 py-2 flex items-center justify-around gap-4 sm:gap-10 transition-colors duration-200"
      aria-label="Bottom Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 relative group ${
                isActive
                  ? 'text-medisetu-primary font-semibold'
                  : 'text-medisetu-muted dark:text-slate-400 hover:text-medisetu-slate dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-medisetu-primary' : 'group-hover:scale-105'
                  }`}
                />
                <span className="text-[11px] mt-1 tracking-tight leading-tight">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-5 h-0.5 bg-medisetu-primary rounded-full absolute -bottom-0.5" />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomDock;
