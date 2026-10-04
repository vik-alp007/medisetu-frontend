import React from 'react';

export const DashboardSection = ({ title, subtitle, action, children, className = '' }) => (
  <section
    className={`bg-white dark:bg-[#1E293B] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-xs min-w-0 ${className}`}
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="min-w-0">
        <h2 className="text-base font-bold text-medisetu-navy dark:text-white">{title}</h2>
        {subtitle && <p className="text-xs text-medisetu-muted dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </section>
);

export const SectionEmpty = ({ children }) => (
  <p className="text-sm text-medisetu-muted dark:text-slate-400 py-5 text-center">{children}</p>
);

export default DashboardSection;
