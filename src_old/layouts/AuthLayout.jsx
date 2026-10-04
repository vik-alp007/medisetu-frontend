import React from 'react';
import { Outlet } from 'react-router-dom';
import ThemeToggle from '../components/common/ThemeToggle';

/**
 * Shared AuthLayout Component
 * Visual Reference: Screens 5, 6, 7
 * Split layout with branding/illustration on the left and elevated form card on the right
 */
export const AuthLayout = ({
  leftContent,
  children,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#F4F9FF] dark:bg-[#0B132B] text-medisetu-slate dark:text-slate-200 flex flex-col justify-center items-center py-6 sm:py-10 px-4 sm:px-6 relative overflow-x-hidden transition-colors duration-200">
      {/* Ambient background curves */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[15%] -left-[10%] w-[500px] h-[500px] bg-blue-100/50 dark:bg-blue-900/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-cyan-100/40 dark:bg-cyan-950/20 rounded-full blur-3xl" />
      </div>

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Branding, Value Props, or Doctor Graphic */}
        {leftContent && (
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-6">
            {leftContent}
          </div>
        )}

        {/* Right Column: Elevated Form Card */}
        <div className={`${leftContent ? 'lg:col-span-7' : 'max-w-xl mx-auto w-full'}`}>
          <div className="w-full bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card p-6 sm:p-10 relative">
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
