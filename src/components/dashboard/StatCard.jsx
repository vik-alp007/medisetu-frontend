import React from 'react';

/**
 * Dashboard statistic tile. `value === null` means the backend did not
 * provide this figure - we show "—" and say so, instead of inventing a number.
 */
export const StatCard = ({ label, value, hint, icon: Icon, tone = 'blue', source }) => {
  const tones = {
    blue: 'bg-blue-50 dark:bg-blue-950/60 text-medisetu-primary dark:text-blue-400',
    teal: 'bg-teal-50 dark:bg-teal-950/50 text-medisetu-teal dark:text-teal-400',
    amber: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    purple: 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
  };
  const unavailable = value === null || value === undefined;

  return (
    <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-xs min-w-0">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-medisetu-muted dark:text-slate-400 leading-tight">{label}</p>
        {Icon && (
          <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`}>
            <Icon className="w-4 h-4" />
          </span>
        )}
      </div>
      <p className="text-xl sm:text-2xl font-bold text-medisetu-navy dark:text-white mt-2 break-words">
        {unavailable ? '—' : value}
      </p>
      <p className="text-[11px] text-medisetu-muted dark:text-slate-500 mt-1 leading-snug">
        {unavailable ? 'Not provided by backend yet' : hint}
        {!unavailable && source === 'derived' && (
          <span title="Calculated from the individual list endpoints"> · calculated</span>
        )}
      </p>
    </div>
  );
};

export default StatCard;
