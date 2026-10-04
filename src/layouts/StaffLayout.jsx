import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import MediSetuLogo from '../components/common/MediSetuLogo';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';

/**
 * Shared shell for the Doctor and Admin dashboards.
 * Same ambient background/colours as PatientLayout, but no patient bottom dock.
 */
export const StaffLayout = ({ roleLabel, children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() || user?.username || '';

  return (
    <div className="min-h-screen w-full bg-[#F4F9FF] dark:bg-[#0B132B] text-medisetu-slate dark:text-slate-200 relative transition-colors duration-200">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[550px] h-[550px] bg-blue-100/40 dark:bg-blue-900/15 rounded-full blur-3xl" />
        <div className="absolute top-[35%] -right-[15%] w-[650px] h-[650px] bg-cyan-100/35 dark:bg-cyan-950/20 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <MediSetuLogo size="sm" showTagline={false} />
            <span className="hidden sm:inline-flex text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-medisetu-primary dark:text-blue-400">
              {roleLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {displayName && (
              <span className="hidden md:block text-sm font-medium text-medisetu-navy dark:text-white truncate max-w-[180px]">
                {displayName}
              </span>
            )}
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-medisetu-danger hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-2 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5">
        {children}
      </main>
    </div>
  );
};

export default StaffLayout;
