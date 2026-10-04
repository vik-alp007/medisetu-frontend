import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomDock from '../components/navigation/BottomDock';

/**
 * Shared PatientLayout Component
 * Visual Reference: Screens 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
 * Desktop canvas with ambient curved background, responsive padding, and persistent bottom dock.
 */
export const PatientLayout = ({
  children,
  maxWidth = 'max-w-[1280px]', // 'max-w-[1280px]' | 'max-w-[1440px]'
  showDock = true,
  className = '',
}) => {
  return (
    <div className="min-h-screen w-full bg-[#F4F9FF] dark:bg-[#0B132B] text-medisetu-slate dark:text-slate-200 flex flex-col relative pb-24 sm:pb-28 transition-colors duration-200">
      {/* Ambient soft background decorative gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[550px] h-[550px] bg-blue-100/40 dark:bg-blue-900/15 rounded-full blur-3xl" />
        <div className="absolute top-[35%] -right-[15%] w-[650px] h-[650px] bg-cyan-100/35 dark:bg-cyan-950/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-[15%] left-[20%] w-[500px] h-[500px] bg-sky-100/30 dark:bg-indigo-950/20 rounded-full blur-3xl" />
      </div>

      {/* Main framed container (1280px or 1440px desktop frame) */}
      <main
        className={`w-full ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col relative z-10 ${className}`}
      >
        {children || <Outlet />}
      </main>

      {/* Persistent Docked Navigation */}
      {showDock && <BottomDock />}
    </div>
  );
};

export default PatientLayout;
